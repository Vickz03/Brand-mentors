import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SocketProvider } from './context/SocketContext'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Brands from './pages/Brands'
import Settings from './pages/Settings'
import Login from './pages/Login'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SocketProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard/:brandId?" element={<Dashboard />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </Router>
        </SocketProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

