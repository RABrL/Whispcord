'use client'

import { useState } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import axios from 'axios'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/use-modal-store'
import { useOrigin } from '@/hooks/use-origin'

export const InviteModal = () => {
  const origin = useOrigin()
  const { isOpen, type, onClose, data, onOpen } = useModal()

  const { server } = data
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const isModalOpen = isOpen && type === 'invite'

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 1000)
  }

  const onNewLink = async () => {
    try {
      setIsLoading(true)
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`)
      onOpen('invite', { server: res.data })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              readOnly
            />
            <Button size="icon" onClick={onCopy} disabled={isLoading}>
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            disabled={isLoading}
            onClick={onNewLink}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            Generate a new link
            <RefreshCw className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
