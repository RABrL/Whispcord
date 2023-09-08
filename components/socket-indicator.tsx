'use client'

import { useSocket } from '@/components/providers/socket-provider'
import { Badge } from '@/components/ui/badge'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className="bg-yellow-600 text-white border-none h-4 w-4 p-0 md:px-2.5 md:py-0.5 md:w-full md:h-full"
      >
        <span className="hidden md:flex">Fallback: Polling every 1s</span>
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="bg-emerald-600 text-white border-none h-4 w-4 p-0 md:px-2.5 md:py-0.5 md:w-full md:h-full"
    >
      <span className="hidden md:block">Live: Real-time updates</span>
    </Badge>
  )
}
