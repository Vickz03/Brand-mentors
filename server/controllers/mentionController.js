const Mention = require('../models/Mention');

/**
 * Get all mentions for a brand
 */
async function getMentionsByBrand(req, res) {
  try {
    const { brandId } = req.params;
    const { 
      sentiment, 
      category, 
      source,
      limit = 50,
      skip = 0,
      sortBy = 'publishedAt',
      order = 'desc'
    } = req.query;

    const query = { brandId };
    if (sentiment) query.sentiment = sentiment;
    if (category) query.category = category;
    if (source) query.source = source;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const mentions = await Mention.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('brandId', 'name displayName');

    const total = await Mention.countDocuments(query);

    res.json({
      mentions,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get latest mentions
 */
async function getLatestMentions(req, res) {
  try {
    const { limit = 20 } = req.query;
    const mentions = await Mention.find()
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .populate('brandId', 'name displayName');

    res.json(mentions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get mention by ID
 */
async function getMentionById(req, res) {
  try {
    const mention = await Mention.findById(req.params.id)
      .populate('brandId', 'name displayName');
    if (!mention) {
      return res.status(404).json({ error: 'Mention not found' });
    }
    res.json(mention);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * Get mentions statistics
 */
async function getMentionStats(req, res) {
  try {
    const { brandId } = req.params;

    const mongoose = require('mongoose')
    const stats = await Mention.aggregate([
      { $match: { brandId: brandId ? new mongoose.Types.ObjectId(brandId) : { $exists: true } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } },
          complaints: { $sum: { $cond: [{ $eq: ['$category', 'complaint'] }, 1, 0] } },
          reviews: { $sum: { $cond: [{ $eq: ['$category', 'review'] }, 1, 0] } },
          products: { $sum: { $cond: [{ $eq: ['$category', 'product'] }, 1, 0] } },
          support: { $sum: { $cond: [{ $eq: ['$category', 'support'] }, 1, 0] } }
        }
      }
    ]);

    res.json(stats[0] || {
      total: 0,
      positive: 0,
      negative: 0,
      neutral: 0,
      complaints: 0,
      reviews: 0,
      products: 0,
      support: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getMentionsByBrand,
  getLatestMentions,
  getMentionById,
  getMentionStats
};

