import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'
import { currentProfile } from '@/lib/current-profile'

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile()
    const { name, type } = await req.json()
    const serverId = req.nextUrl.searchParams.get('serverId')

    if (!profile) return new NextResponse('Unathorized', { status: 401 })

    if (!serverId) return new NextResponse('Server ID missing', { status: 400 })

    if (!name) return new NextResponse('Name is missing', { status: 400 })

    if (!type) return new NextResponse('Type is missing', { status: 400 })

    if (name === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.log('[CHANNELS_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
