import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        coverImage: true,
        points: true,
        skills: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const body = await req.json();
  const { name, image, bio } = body;
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      image,
      ...(bio !== undefined ? { bio } : {}),
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
  return NextResponse.json(user);
}
