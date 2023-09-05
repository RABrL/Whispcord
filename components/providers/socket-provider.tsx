'use client'

import { useContext, createContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'

type SocketContextype = {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextype>({
  socket: null,
  isConnected: false
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    const socketInstance = new (ClientIO as any)(
      // rome-ignore lint/style/noNonNullAssertion: <explanation>
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: '/api/socket/io',
        addTrailingSlash: false
      }
    )

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => socketInstance.disconnect()
  }, [])

  return (
    <SocketContext.Provider value={{ isConnected, socket }}>
      {children}
    </SocketContext.Provider>
  )
}
