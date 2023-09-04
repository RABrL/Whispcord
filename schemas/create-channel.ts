import { ChannelType } from '@prisma/client'
import { z } from 'zod'

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Server name is required' })
    .refine((name) => name !== 'general', {
      message: "Channel name cannot be 'general'"
    }),
  type: z.nativeEnum(ChannelType)
})

export type channelSchemaTypes = z.infer<typeof channelSchema>
