const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastScraped: {
    type: Date,
    default: null
  },
  totalMentions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

brandSchema.index({ name: 1 });
brandSchema.index({ userId: 1 });

module.exports = mongoose.model('Brand', brandSchema);

