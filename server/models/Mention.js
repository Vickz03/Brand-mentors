const mongoose = require('mongoose');

const mentionSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
    index: true
  },
  brandName: {
    type: String,
    required: true,
    index: true
  },
  source: {
    type: String,
    required: true,
    enum: ['news', 'reddit', 'youtube', 'dummy']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Unknown'
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },
  sentiment: {
    type: String,
    required: true,
    enum: ['positive', 'negative', 'neutral'],
    index: true
  },
  sentimentScore: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['complaint', 'review', 'product', 'support', 'general'],
    default: 'general'
  },
  keywords: [{
    type: String
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

mentionSchema.index({ brandId: 1, publishedAt: -1 });
mentionSchema.index({ brandName: 1, publishedAt: -1 });
mentionSchema.index({ sentiment: 1 });
mentionSchema.index({ category: 1 });

module.exports = mongoose.model('Mention', mentionSchema);

