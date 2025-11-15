import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useTheme } from '../context/ThemeContext'
import { FiSun, FiMoon, FiBell, FiDatabase } from 'react-icons/fi'

const Settings = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === 'dark' ? (
                  <FiMoon className="w-6 h-6 text-blue-600" />
                ) : (
                  <FiSun className="w-6 h-6 text-blue-600" />
                )}
                <div>
                  <h2 className="text-xl font-semibold">Theme</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Switch between light and dark mode
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.button>
            </div>
          </motion.div>

          {/* Notifications Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center space-x-4 mb-4">
              <FiBell className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage your notification preferences
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                <span>Spike alerts</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
                <span>New mentions</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-5 h-5 text-blue-600" />
                <span>Weekly summary</span>
              </label>
            </div>
          </motion.div>

          {/* Data Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <FiDatabase className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold">Data Management</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage your data and export options
                </p>
              </div>
            </div>
          </motion.div>

          {/* API Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800"
          >
            <h2 className="text-xl font-semibold mb-2">API Configuration</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              To enable live data fetching, configure your API keys in the server .env file:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>NEWS_API_KEY - For news mentions</li>
              <li>REDDIT_CLIENT_ID & REDDIT_CLIENT_SECRET - For Reddit mentions</li>
              <li>YOUTUBE_API_KEY - For YouTube mentions</li>
            </ul>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              The app will use dummy data if API keys are not configured.
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

export default Settings

