const Brand = require('../models/Brand');
const Mention = require('../models/Mention');
const { fetchAllMentions } = require('../services/apiService');

/**
 * Get all brands
 */
async function getAllBrands(req, res) {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get brand by ID
 */
async function getBrandById(req, res) {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Create new brand and fetch initial mentions
 */
async function createBrand(req, res) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }

    // Check if brand already exists
    const existingBrand = await Brand.findOne({ name: name.toLowerCase() });
    if (existingBrand) {
      return res.status(400).json({ error: 'Brand already exists' });
    }

    // Create brand
    const brand = new Brand({
      name: name.toLowerCase(),
      displayName: name,
      userId: req.user?.id || null
    });
    await brand.save();

    // Fetch and save initial mentions
    const mentions = await fetchAllMentions(name);
    
    const savedMentions = await Promise.all(
      mentions.map(mention => {
        return Mention.create({
          brandId: brand._id,
          brandName: brand.name,
          ...mention
        });
      })
    );

    brand.totalMentions = savedMentions.length;
    brand.lastScraped = new Date();
    await brand.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`brand-${brand.name}`).emit('new-mentions', {
        brandId: brand._id,
        count: savedMentions.length,
        mentions: savedMentions
      });
    }

    res.status(201).json({
      brand,
      mentionsCount: savedMentions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Update brand
 */
async function updateBrand(req, res) {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Delete brand
 */
async function deleteBrand(req, res) {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Optionally delete all mentions
    // await Mention.deleteMany({ brandId: brand._id });

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Trigger manual scrape for a brand
 */
async function scrapeBrand(req, res) {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Fetch new mentions
    const mentions = await fetchAllMentions(brand.displayName);
    
    // Check for duplicates and save new ones
    const existingUrls = await Mention.find({ brandId: brand._id }).distinct('url');
    const newMentions = mentions.filter(m => !existingUrls.includes(m.url));

    const savedMentions = await Promise.all(
      newMentions.map(mention => {
        return Mention.create({
          brandId: brand._id,
          brandName: brand.name,
          ...mention
        });
      })
    );

    brand.totalMentions += savedMentions.length;
    brand.lastScraped = new Date();
    await brand.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`brand-${brand.name}`).emit('new-mentions', {
        brandId: brand._id,
        count: savedMentions.length,
        mentions: savedMentions
      });
    }

    res.json({
      message: 'Scraping completed',
      newMentions: savedMentions.length,
      totalMentions: brand.totalMentions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  scrapeBrand
};

