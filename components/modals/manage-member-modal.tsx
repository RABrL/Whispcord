'use client'

import { ShieldAlert, ShieldCheck } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ServerWithMembersWithProfiles } from '@/types'
import { UserAvatar } from '@/components/user-avatar'

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const ManageMembersModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal()

  const isModalOpen = isOpen && type === 'manageMembers'
  const { server } = data as { server: ServerWithMembersWithProfiles }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 mb-6">
              <UserAvatar user={member.profile} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold flex items-center gap-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </span>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
