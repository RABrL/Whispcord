import { Hash } from 'lucide-react'
import { Profile } from '@prisma/client'

import { SocketIndicator } from '@/components/socket-indicator'
import { MobileToggle } from '@/components/mobile-toggle'
import { UserAvatar } from '@/components/user-avatar'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  user?: Profile
}

export const ChatHeader = ({ serverId, name, type, user }: ChatHeaderProps) => {
  return (
    <div className="text-md font-smibold px-3 flex items-center h-12 vorder-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === 'conversation' && user && (
        <UserAvatar user={user} className="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className='ml-auto flex items-center'>
        <SocketIndicator />
      </div>
    </div>
  )
}
