import { createNextRouteHandler } from 'uploadthing/next'
import { utapi } from 'uploadthing/server'
import { NextResponse } from 'next/server'

import { ourFileRouter } from './core'

// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter
})

export async function DELETE(req: Request) {
  try {
    const { file } = await req.json()
    await utapi.deleteFiles(file)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.log('[DELETE-FILE]: ', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
