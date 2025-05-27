import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const followings = await prisma.user.findMany({
      where: {
        followers: {
          some: {
            followerId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        points: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    return NextResponse.json(followings);
  } catch (error) {
    console.error("Error fetching followings:", error);
    return NextResponse.json(
      { error: "Failed to fetch followings" },
      { status: 500 }
    );
  }
}
