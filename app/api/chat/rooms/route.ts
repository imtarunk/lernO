import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session:", session); // Debug log

    if (!session?.user?.id) {
      console.log("No session or user ID found"); // Debug log
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching chat rooms for user:", session.user.id); // Debug log

    const chatRooms = await prisma.chatRoom.findMany({
      where: {
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
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            sender: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    console.log("Found chat rooms:", chatRooms.length); // Debug log

    // Transform the data to include last message
    const transformedRooms = chatRooms.map((room) => ({
      ...room,
      lastMessage: room.messages[0]
        ? {
            content: room.messages[0].encryptedContent,
            createdAt: room.messages[0].createdAt,
            sender: room.messages[0].sender,
          }
        : null,
      messages: undefined, // Remove messages array from response
    }));

    return NextResponse.json(transformedRooms);
  } catch (error) {
    // Enhanced error logging
    console.error("Detailed error in GET /api/chat/rooms:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        error: "Failed to fetch chat rooms",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { participantIds, isGroup, name } = await request.json();

    // Create chat room
    const chatRoom = await prisma.chatRoom.create({
      data: {
        name,
        isGroup,
        participants: {
          connect: [
            { id: session.user.id },
            ...participantIds.map((id: string) => ({ id })),
          ],
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
    });

    return NextResponse.json(chatRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    );
  }
}
