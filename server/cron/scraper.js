const cron = require('node-cron');
const Brand = require('../models/Brand');
const Mention = require('../models/Mention');
const { fetchAllMentions } = require('../services/apiService');
const { detectSpike, detectNegativeSpike } = require('../utils/spikeDetector');

/**
 * Scrape all active brands every hour
 */
function startScrapingCron(io) {
  // Run every 30 minutes for real-time tracking
  cron.schedule('*/30 * * * *', async () => {
    console.log('🔄 Starting scheduled scrape...');
    
    try {
      const brands = await Brand.find({ isActive: true });
      
      for (const brand of brands) {
        try {
          console.log(`Scraping brand: ${brand.displayName}`);
          
          // Fetch new mentions
          const mentions = await fetchAllMentions(brand.displayName);
          
          // Get existing URLs to avoid duplicates
          const existingUrls = await Mention.find({ brandId: brand._id }).distinct('url');
          const newMentions = mentions.filter(m => !existingUrls.includes(m.url) && m.url);
          
          if (newMentions.length > 0) {
            // Save new mentions
            const savedMentions = await Promise.all(
              newMentions.map(mention => {
                return Mention.create({
                  brandId: brand._id,
                  brandName: brand.name,
                  ...mention
                });
              })
            );

            // Update brand stats
            const previousTotal = brand.totalMentions;
            brand.totalMentions += savedMentions.length;
            brand.lastScraped = new Date();
            await brand.save();

            // Detect spikes
            const spike = detectSpike(brand.totalMentions, previousTotal);
            
            // Get negative mentions count for spike detection
            const negativeCount = await Mention.countDocuments({
              brandId: brand._id,
              sentiment: 'negative'
            });

            // Emit real-time updates
            if (io) {
              io.to(`brand-${brand.name}`).emit('new-mentions', {
                brandId: brand._id,
                brandName: brand.displayName,
                count: savedMentions.length,
                mentions: savedMentions,
                spike: spike.isSpike ? spike : null
              });

              // Emit spike alert if detected
              if (spike.isSpike) {
                io.to(`brand-${brand.name}`).emit('spike-alert', {
                  brandId: brand._id,
                  brandName: brand.displayName,
                  type: 'mentions',
                  increase: spike.percentage,
                  message: `Mentions increased by ${spike.percentage}%`
                });
              }
            }

            console.log(`✅ Saved ${savedMentions.length} new mentions for ${brand.displayName}`);
          } else {
            console.log(`ℹ️ No new mentions for ${brand.displayName}`);
          }
        } catch (error) {
          console.error(`❌ Error scraping brand ${brand.displayName}:`, error.message);
        }
      }
      
      console.log('✅ Scheduled scrape completed');
    } catch (error) {
      console.error('❌ Scheduled scrape error:', error.message);
    }
  });

  console.log('✅ Cron jobs initialized (runs every 30 minutes for real-time tracking)');
}

module.exports = startScrapingCron;

