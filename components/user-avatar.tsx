import { Profile } from '@prisma/client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'

interface UserAvatarProps {
  user: Profile
  className?: string
}
export const UserAvatar = ({ user, className }: UserAvatarProps) => {
  const initials = getInitials(user.name)
  return (
    <Avatar className={cn('h-7 w-7 md:h-10 md:w-10', className)}>
      <AvatarImage src={user.imageUrl} alt={user.name} />
      <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
