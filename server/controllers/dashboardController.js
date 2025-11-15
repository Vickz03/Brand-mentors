const Mention = require('../models/Mention');
const Brand = require('../models/Brand');
const { detectSpike, detectNegativeSpike } = require('../utils/spikeDetector');

/**
 * Get dashboard data for a brand
 */
async function getDashboardData(req, res) {
  try {
    const { brandId } = req.params;

    // Get brand
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    const mongoose = require('mongoose')
    
    // Get mentions stats
    const stats = await Mention.aggregate([
      { $match: { brandId: new mongoose.Types.ObjectId(brandId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } },
          neutral: { $sum: { $cond: [{ $eq: ['$sentiment', 'neutral'] }, 1, 0] } }
        }
      }
    ]);

    const currentStats = stats[0] || { total: 0, positive: 0, negative: 0, neutral: 0 };

    // Get mentions by category
    const categoryStats = await Mention.aggregate([
      { $match: { brandId: new mongoose.Types.ObjectId(brandId) } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get mentions over time (last 30 days grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendData = await Mention.aggregate([
      {
        $match: {
          brandId: new mongoose.Types.ObjectId(brandId),
          publishedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' }
          },
          count: { $sum: 1 },
          positive: { $sum: { $cond: [{ $eq: ['$sentiment', 'positive'] }, 1, 0] } },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get mentions from previous period for spike detection
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousStats = await Mention.aggregate([
      {
        $match: {
          brandId: new mongoose.Types.ObjectId(brandId),
          publishedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          negative: { $sum: { $cond: [{ $eq: ['$sentiment', 'negative'] }, 1, 0] } }
        }
      }
    ]);

    const prevStats = previousStats[0] || { total: 0, negative: 0 };

    // Detect spikes
    const mentionSpike = detectSpike(currentStats.total, prevStats.total);
    const negativeSpike = detectNegativeSpike(currentStats.negative, prevStats.negative);

    // Get top keywords
    const allMentions = await Mention.find({ brandId }).select('keywords');
    const keywordCount = {};
    allMentions.forEach(mention => {
      mention.keywords.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });

    const topKeywords = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    // Generate AI Summary
    const positivePercentage = currentStats.total > 0 
      ? Math.round((currentStats.positive / currentStats.total) * 100) 
      : 0;
    
    const trendDirection = trendData.length >= 2 
      ? (trendData[trendData.length - 1].count > trendData[0].count ? 'upward' : 'downward')
      : 'stable';

    const summary = {
      positivePercentage,
      topKeywords: topKeywords.map(k => k.word),
      trendDirection,
      hasSpike: mentionSpike.isSpike,
      hasNegativeSpike: negativeSpike.isSpike,
      totalMentions: currentStats.total,
      sentimentBreakdown: {
        positive: currentStats.positive,
        negative: currentStats.negative,
        neutral: currentStats.neutral
      }
    };

    // Get latest mentions
    const latestMentions = await Mention.find({ brandId })
      .sort({ publishedAt: -1 })
      .limit(10)
      .populate('brandId', 'name displayName');

    res.json({
      brand,
      stats: currentStats,
      categoryStats: categoryStats.map(c => ({ category: c._id, count: c.count })),
      trendData: trendData.map(t => ({
        date: t._id,
        mentions: t.count,
        positive: t.positive,
        negative: t.negative
      })),
      spikes: {
        mentions: mentionSpike,
        negative: negativeSpike
      },
      topKeywords,
      summary,
      latestMentions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getDashboardData
};

