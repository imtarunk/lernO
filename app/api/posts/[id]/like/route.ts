import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await context.params;
    console.log("Attempting to like post:", postId);

    // Verify the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      console.log("Post not found:", postId);
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    console.log("Found post:", { id: post.id, author: post.author.name });

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.log("Creating new user:", session.user);
      user = await prisma.user.create({
        data: {
          id: session.user.id,
          name: session.user.name || "Anonymous",
          email: session.user.email || "",
          image: session.user.image || "",
        },
      });
      console.log("Created user:", user);
    }

    console.log("Using user:", { id: user.id, name: user.name });

    const userId = user.id;

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      console.log("Removing existing like");
      // Unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      console.log("Creating new like");
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
