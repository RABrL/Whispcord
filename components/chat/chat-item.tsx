import { Member, MemberRole, Profile } from '@prisma/client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import z from 'zod'
import qs from 'query-string'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { UserAvatar } from '@/components/user-avatar'
import { ActionTooltip } from '@/components/action-tooltip'
import { roleIconMap } from '@/lib/icons'
import { Edit, FileIcon, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Form, FormField, FormControl, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ChatItemProps {
  id: string
  content: string
  member: Member & {
    profile: Profile
  }
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const formSchema = z.object({
  content: z.string().min(1)
})

type formType = z.infer<typeof formSchema>

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  })

  useEffect(() => {
    form.reset({
      content: content
    })
  }, [content])

  const fileType = fileUrl?.split('.').pop()

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = isAdmin || MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMesssage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  const onSubmit = async (values: formType) => {
    console.log(values)
  }

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar user={member.profile} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold mr-2 text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                PDF file
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited message"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size='sm' variant='primary'>
                  Save
                </Button>
              </form>
              <span className='text-[10px] mt-1 text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMesssage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
