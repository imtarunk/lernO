import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find users the current user is following
  const followings = await prisma.user.findMany({
    where: {
      followers: {
        some: {
          followerId: session.user.id,
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
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(followings);
}
