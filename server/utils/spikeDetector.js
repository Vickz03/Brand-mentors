/**
 * Detect spikes in mentions (30%+ increase)
 */
function detectSpike(currentMentions, previousMentions) {
  if (!previousMentions || previousMentions === 0) {
    return {
      isSpike: false,
      increase: 0,
      percentage: 0
    };
  }

  const increase = currentMentions - previousMentions;
  const percentage = (increase / previousMentions) * 100;

  return {
    isSpike: percentage >= 30,
    increase: increase,
    percentage: Math.round(percentage * 100) / 100
  };
}

/**
 * Detect negative sentiment spike
 */
function detectNegativeSpike(currentNegative, previousNegative) {
  if (!previousNegative || previousNegative === 0) {
    return {
      isSpike: false,
      increase: 0,
      percentage: 0
    };
  }

  const increase = currentNegative - previousNegative;
  const percentage = (increase / previousNegative) * 100;

  return {
    isSpike: percentage >= 30,
    increase: increase,
    percentage: Math.round(percentage * 100) / 100
  };
}

module.exports = {
  detectSpike,
  detectNegativeSpike
};

