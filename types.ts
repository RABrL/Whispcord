import { Server as NetServer, Socket } from 'node:net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { Member, Message, Profile, Server } from '@prisma/client'

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}
