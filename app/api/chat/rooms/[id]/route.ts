import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const chatRoom = await prisma.chatRoom.findFirst({
      where: {
        id: params.id,
        participants: {
          some: {
            id: session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            image: true,
            isOnline: true,
          },
        },
      },
    })

    if (!chatRoom) {
      return NextResponse.json({ error: "Chat room not found" }, { status: 404 })
    }

    return NextResponse.json(chatRoom)
  } catch (error) {
    console.error("Error fetching chat room:", error)
    return NextResponse.json({ error: "Failed to fetch chat room" }, { status: 500 })
  }
}
