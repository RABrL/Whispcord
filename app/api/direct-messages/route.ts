import { NextRequest, NextResponse } from 'next/server'

import { currentProfile } from '@/lib/current-profile'
import { DirectMessage } from '@prisma/client'
import { db } from '@/lib/db'

const MESSAGE_BATCH = 10

export async function GET(req: NextRequest) {
  try {
    const profile = await currentProfile()
    const cursor = req.nextUrl.searchParams.get('cursor')
    const conversationId = req.nextUrl.searchParams.get('conversationId')

    if (!profile) return new NextResponse('Unauthorized', { status: 401 })

    if (!conversationId) {
      return new NextResponse('Conversation ID missing', { status: 404 })
    }

    let messages: DirectMessage[] = []

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          conversationId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGE_BATCH,
        where: {
          conversationId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    let nextCursor = null

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    })
  } catch (error) {
    console.log('[DIRECT_MESSAGES_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
