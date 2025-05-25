import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get users that the current user is not following
    const suggestedUsers = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } }, // Exclude current user
          {
            followers: {
              none: {
                followerId: session.user.id, // Exclude users already followed
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        points: true,
      },
      take: 5, // Limit to 5 suggestions
      orderBy: {
        createdAt: "desc", // Show newest users first
      },
    });

    // Ensure we return an array
    return NextResponse.json(suggestedUsers || []);
  } catch (error) {
    console.error("Error fetching suggested users:", error);
    return NextResponse.json([], { status: 500 }); // Return empty array on error
  }
}
