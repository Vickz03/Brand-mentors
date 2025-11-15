import { motion } from 'framer-motion'
import { FiCpu, FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi'

const AISummary = ({ summary, topKeywords }) => {
  if (!summary) {
    return null
  }

  const getTrendIcon = () => {
    switch (summary.trendDirection) {
      case 'upward':
        return <FiTrendingUp className="w-5 h-5 text-green-600" />
      case 'downward':
        return <FiTrendingDown className="w-5 h-5 text-red-600" />
      default:
        return <FiTrendingUp className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg text-white"
    >
      <div className="flex items-center space-x-2 mb-4">
        <FiCpu className="w-6 h-6" />
        <h2 className="text-xl font-semibold">AI Summary</h2>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-blue-100 mb-1">Sentiment Analysis</p>
          <p className="text-2xl font-bold">
            {summary.positivePercentage}% Positive
          </p>
          <p className="text-sm text-blue-100 mt-1">
            {summary.sentimentBreakdown.positive} positive, {summary.sentimentBreakdown.negative} negative, {summary.sentimentBreakdown.neutral} neutral
          </p>
        </div>

        <div>
          <p className="text-blue-100 mb-1">Trend Direction</p>
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <p className="text-lg font-semibold capitalize">
              {summary.trendDirection} Trend
            </p>
          </div>
        </div>

        {topKeywords && topKeywords.length > 0 && (
          <div>
            <p className="text-blue-100 mb-2">Top Keywords</p>
            <div className="flex flex-wrap gap-2">
              {topKeywords.slice(0, 5).map((kw, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm"
                >
                  {kw.word || kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {(summary.hasSpike || summary.hasNegativeSpike) && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-500/20 rounded-lg border border-yellow-400/50">
            <FiAlertCircle className="w-5 h-5 text-yellow-300" />
            <p className="text-sm">
              {summary.hasSpike && 'Mention spike detected! '}
              {summary.hasNegativeSpike && 'Negative sentiment spike detected!'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AISummary

