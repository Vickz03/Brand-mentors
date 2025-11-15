import { motion } from 'framer-motion'
import { FiExternalLink, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

const MentionsList = ({ mentions }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FiTrendingUp className="w-4 h-4 text-green-600" />
      case 'negative':
        return <FiTrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <FiMinus className="w-4 h-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'negative':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Latest Mentions</h2>
      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
        {mentions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No mentions yet
          </p>
        ) : (
          mentions.map((mention, index) => (
            <motion.div
              key={mention._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getSentimentIcon(mention.sentiment)}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(mention.sentiment)}`}>
                    {mention.sentiment}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {mention.source}
                  </span>
                </div>
                {mention.url && (
                  <a
                    href={mention.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <h3 className="font-semibold mb-1">{mention.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {mention.content}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{mention.author}</span>
                <span>{new Date(mention.publishedAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default MentionsList

