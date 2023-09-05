import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile()

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    if (!params.channelId) {
      return new NextResponse('Channel ID missing', { status: 400 })
    }

    const serverId = req.nextUrl.searchParams.get('serverId')

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: 'general'
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CHANNELS_ID_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
