import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Lazy initialize socket - don't block rendering
    let newSocket
    
    const initSocket = () => {
      try {
        newSocket = io('http://localhost:5000', {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 3,
          timeout: 5000, // Reduced timeout to not block
          autoConnect: true,
          forceNew: false
        })

        newSocket.on('connect', () => {
          console.log('✅ Connected to server')
        })

        newSocket.on('disconnect', () => {
          console.log('❌ Disconnected from server')
        })

        newSocket.on('connect_error', (error) => {
          console.warn('Socket connection error (backend may not be running):', error.message)
          // Don't block rendering if socket fails
        })

        newSocket.on('new-mentions', (data) => {
          console.log('New mentions:', data)
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'new-mentions',
            ...data
          }])
        })

        newSocket.on('spike-alert', (data) => {
          console.log('Spike alert:', data)
          setNotifications(prev => [...prev, {
            id: Date.now(),
            type: 'spike-alert',
            ...data
          }])
        })

        setSocket(newSocket)
      } catch (error) {
        console.warn('Socket initialization error (backend may not be running):', error.message)
        // Don't block rendering if socket fails
      }
    }

    // Initialize socket after a small delay to not block initial render
    const timeoutId = setTimeout(initSocket, 100)

    return () => {
      clearTimeout(timeoutId)
      if (newSocket) {
        newSocket.close()
      }
    }
  }, [])

  const subscribeToBrand = (brandName) => {
    if (socket) {
      socket.emit('subscribe-brand', brandName)
    }
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <SocketContext.Provider value={{ socket, notifications, subscribeToBrand, removeNotification }}>
      {children}
    </SocketContext.Provider>
  )
}
