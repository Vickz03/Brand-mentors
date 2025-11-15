const Sentiment = require('sentiment');

const sentiment = new Sentiment();

/**
 * Analyze sentiment of text
 * @param {string} text - Text to analyze
 * @returns {Object} - { sentiment: 'positive'|'negative'|'neutral', score: number }
 */
function analyzeSentiment(text) {
  const result = sentiment.analyze(text);
  const score = result.score || 0;

  let sentimentLabel;
  if (score > 2) {
    sentimentLabel = 'positive';
  } else if (score < -2) {
    sentimentLabel = 'negative';
  } else {
    sentimentLabel = 'neutral';
  }

  return {
    sentiment: sentimentLabel,
    score: score,
    comparative: result.comparative || 0
  };
}

/**
 * Extract keywords from text (simple implementation)
 * @param {string} text - Text to extract keywords from
 * @param {number} maxKeywords - Maximum number of keywords to return
 * @returns {Array<string>} - Array of keywords
 */
function extractKeywords(text, maxKeywords = 5) {
  // Common stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'what', 'which', 'who',
    'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every',
    'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out',
    'off', 'over', 'under', 'again', 'further', 'then', 'once'
  ]);

  // Convert to lowercase, split by non-word characters, filter out stop words and short words
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(entry => entry[0]);
}

/**
 * Categorize mention based on keywords and content
 * @param {string} text - Text to categorize
 * @returns {string} - Category
 */
function categorizeMention(text) {
  const lowerText = text.toLowerCase();

  // Complaint keywords
  if (/bad|poor|terrible|awful|horrible|worst|hate|disappointed|complaint|issue|problem|broken|defect|faulty|error|bug/.test(lowerText)) {
    return 'complaint';
  }

  // Review keywords
  if (/review|rating|stars|recommend|suggest|opinion|thoughts|experience/.test(lowerText)) {
    return 'review';
  }

  // Product keywords
  if (/product|feature|launch|release|new|update|version|upgrade|announcement/.test(lowerText)) {
    return 'product';
  }

  // Support keywords
  if (/support|help|assistance|customer service|ticket|query|question|contact/.test(lowerText)) {
    return 'support';
  }

  return 'general';
}

module.exports = {
  analyzeSentiment,
  extractKeywords,
  categorizeMention
};

