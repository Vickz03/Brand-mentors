const express = require('express');
const router = express.Router();
const {
  getMentionsByBrand,
  getLatestMentions,
  getMentionById,
  getMentionStats
} = require('../controllers/mentionController');

router.get('/latest', getLatestMentions);
router.get('/brand/:brandId', getMentionsByBrand);
router.get('/brand/:brandId/stats', getMentionStats);
router.get('/:id', getMentionById);

module.exports = router;

