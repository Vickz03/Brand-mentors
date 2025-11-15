import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { useSocket } from '../context/SocketContext'
import { dashboardAPI, brandsAPI } from '../utils/api'
import StatCard from '../components/StatCard'
import SentimentChart from '../components/SentimentChart'
import TrendChart from '../components/TrendChart'
import CategoryChart from '../components/CategoryChart'
import MentionsList from '../components/MentionsList'
import AISummary from '../components/AISummary'
import SpikeAlert from '../components/SpikeAlert'
import AnimatedCounter from '../components/AnimatedCounter'
import { FiRefreshCw, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const Dashboard = () => {
  const { brandId } = useParams()
  const navigate = useNavigate()
  const { subscribeToBrand, notifications } = useSocket()
  const [dashboardData, setDashboardData] = useState(null)
  const [brands, setBrands] = useState([])
  const [selectedBrandId, setSelectedBrandId] = useState(brandId)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    if (selectedBrandId && dashboardData?.brand) {
      subscribeToBrand(dashboardData.brand.name)
    }
  }, [dashboardData, selectedBrandId])

  useEffect(() => {
    if (selectedBrandId) {
      fetchDashboardData(selectedBrandId)
    } else if (brands.length > 0) {
      setSelectedBrandId(brands[0]._id)
    }
  }, [selectedBrandId, brands])

  const fetchBrands = async () => {
    try {
      const response = await brandsAPI.getAll()
      setBrands(response.data)
      if (response.data.length > 0 && !selectedBrandId) {
        setSelectedBrandId(response.data[0]._id)
        navigate(`/dashboard/${response.data[0]._id}`, { replace: true })
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
    }
  }

  const fetchDashboardData = async (id) => {
    try {
      setLoading(true)
      const response = await dashboardAPI.getData(id)
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (!selectedBrandId) return
    setRefreshing(true)
    try {
      await brandsAPI.scrape(selectedBrandId)
      await fetchDashboardData(selectedBrandId)
    } catch (error) {
      console.error('Error refreshing:', error)
    } finally {
      setRefreshing(false)
    }
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </PageTransition>
    )
  }

  if (!dashboardData) {
    return (
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No brand selected. Please select a brand to view dashboard.</p>
        </div>
      </PageTransition>
    )
  }

  const { brand, stats, categoryStats, trendData, spikes, topKeywords, summary, latestMentions } = dashboardData

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{brand?.displayName || 'Dashboard'}</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time brand mention tracking and analytics</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {brands.length > 0 && (
              <select
                value={selectedBrandId || ''}
                onChange={(e) => {
                  setSelectedBrandId(e.target.value)
                  navigate(`/dashboard/${e.target.value}`)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              >
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{b.displayName}</option>
                ))}
              </select>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Spike Alerts */}
        {(spikes?.mentions?.isSpike || spikes?.negative?.isSpike) && (
          <SpikeAlert spikes={spikes} brandName={brand?.displayName} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Mentions"
            value={<AnimatedCounter value={stats?.total || 0} />}
            icon={FiTrendingUp}
            color="blue"
          />
          <StatCard
            title="Positive"
            value={<AnimatedCounter value={stats?.positive || 0} />}
            icon={FiTrendingUp}
            color="green"
          />
          <StatCard
            title="Negative"
            value={<AnimatedCounter value={stats?.negative || 0} />}
            icon={FiTrendingDown}
            color="red"
          />
          <StatCard
            title="Neutral"
            value={<AnimatedCounter value={stats?.neutral || 0} />}
            icon={FiTrendingUp}
            color="gray"
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Sentiment Distribution</h2>
            <SentimentChart
              positive={stats?.positive || 0}
              negative={stats?.negative || 0}
              neutral={stats?.neutral || 0}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
            <CategoryChart data={categoryStats || []} />
          </motion.div>
        </div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Mentions Over Time</h2>
          <TrendChart data={trendData || []} />
        </motion.div>

        {/* AI Summary and Latest Mentions */}
        <div className="grid lg:grid-cols-2 gap-6">
          <AISummary summary={summary} topKeywords={topKeywords} />
          <MentionsList mentions={latestMentions || []} />
        </div>
      </div>
    </PageTransition>
  )
}

export default Dashboard

