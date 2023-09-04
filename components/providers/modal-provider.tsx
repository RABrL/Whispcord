'use client'

import { useEffect, useState } from 'react'

import { CreateServerModal } from '@/components/modals/create-server-modal'
import { InviteModal } from '@/components/modals/invite-modal.tsx'
import { EditServerModal } from '@/components/modals/edit-server-modal'
import { ManageMembersModal } from '@/components/modals/manage-member-modal'
import { CreateChannelModal } from '@/components/modals/create-channel-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
    </>
  )
}
