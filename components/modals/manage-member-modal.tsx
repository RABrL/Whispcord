'use client'

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldIcon,
  ShieldQuestion
} from 'lucide-react'
import { useState } from 'react'
import qs from 'query-string'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { MemberRole } from '@prisma/client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserAvatar } from '@/components/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { ServerWithMembersWithProfiles } from '@/types'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const ManageMembersModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal()
  const router = useRouter()
  const [loadingId, setLoadingId] = useState('')

  const isModalOpen = isOpen && type === 'manageMembers'
  const { server } = data as { server: ServerWithMembersWithProfiles }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id
        }
      })
      const res = await axios.patch(url, { role })

      router.refresh()
      onOpen('manageMembers', { server: res.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      })

      const res = await axios.delete(url)

      router.refresh()
      onOpen('manageMembers', { server: res.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingId('')
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px]">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-2 mb-6">
              <UserAvatar user={member.profile} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold flex items-center gap-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </span>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger className='mr-1'>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={
                                  member.role !== 'GUEST'
                                    ? () => onRoleChange(member.id, 'GUEST')
                                    : () => {}
                                }
                              >
                                <ShieldIcon className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={
                                  member.role !== 'MODERATOR'
                                    ? () => onRoleChange(member.id, 'MODERATOR')
                                    : () => {}
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-rose-500"
                          onClick={() => onKick(member.id)}
                        >
                          <Gavel className="w-4 h-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
