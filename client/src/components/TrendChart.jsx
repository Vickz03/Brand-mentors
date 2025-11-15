import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const TrendChart = ({ data }) => {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mentions: item.mentions || 0,
    positive: item.positive || 0,
    negative: item.negative || 0
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="mentions" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Total Mentions"
        />
        <Line 
          type="monotone" 
          dataKey="positive" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Positive"
        />
        <Line 
          type="monotone" 
          dataKey="negative" 
          stroke="#ef4444" 
          strokeWidth={2}
          name="Negative"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default TrendChart

