'use client'

import { z } from 'zod'
import axios from 'axios'
import qs from 'query-string'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Input } from '@/components/ui/input'
import { useModal } from '@/hooks/use-modal-store'
import { EmojiPicker } from '@/components/emoji-picker'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Member } from '@prisma/client'

interface ChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
  member: Member
  queryKey: string
}

const useAddMessage = (url: string, queryKey: string, member: Member) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: { content: string }) => axios.post(url, values),
    onMutate: async (values) => {
      queryClient.cancelQueries({ queryKey: [queryKey] })

      const previousMessages = queryClient.getQueryData([queryKey])

      const createdAt = new Date(Date.now())

      const newMessage = {
        ...values,
        id: crypto.randomUUID(),
        member,
        deleted: false,
        createdAt,
        updatedAt: createdAt
      }

      if (previousMessages) {
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [newMessage]
                }
              ]
            }
          }

          const newData = [...oldData.pages]

          newData[0] = {
            ...newData[0],
            items: [newMessage, ...newData[0].items]
          }

          return {
            ...oldData,
            pages: newData
          }
        })
      }

      return { previousMessages }
    },
    onError: (error, cariables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData([queryKey], context.previousMessages)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] })
    }
  })
}

const formSchema = z.object({
  content: z.string().min(1)
})

type formType = z.infer<typeof formSchema>

export const ChatInput = ({
  apiUrl,
  query,
  name,
  type,
  member,
  queryKey
}: ChatInputProps) => {
  const onOpen = useModal((state) => state.onOpen)
  const router = useRouter()
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const url = qs.stringifyUrl({
    url: apiUrl,
    query
  })

  const addMessageMutation = useAddMessage(url, queryKey, member)
  const onSubmit = async (values: formType) => {
    try {
      addMessageMutation.mutate(values)

      form.reset()
      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen('messageFile', { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                    <span className="sr-only">Add file</span>
                  </button>
                  <Input
                    disabled={isLoading}
                    autoComplete="off"
                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === 'conversation' ? name : `#${name}`
                    }`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
