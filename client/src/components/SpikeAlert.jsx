import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX } from 'react-icons/fi'
import { useState } from 'react'

const SpikeAlert = ({ spikes, brandName }) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || (!spikes?.mentions?.isSpike && !spikes?.negative?.isSpike)) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <FiAlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Spike Alert for {brandName}
              </h3>
              <div className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                {spikes?.mentions?.isSpike && (
                  <p>
                    ⚠️ Mentions increased by {spikes.mentions.percentage}% ({spikes.mentions.increase} mentions)
                  </p>
                )}
                {spikes?.negative?.isSpike && (
                  <p>
                    🔴 Negative mentions increased by {spikes.negative.percentage}% ({spikes.negative.increase} mentions)
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SpikeAlert

