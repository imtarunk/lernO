import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: userId
          ? {
              where: {
                userId: userId,
              },
            }
          : false,
        comments: {
          where: {
            parentId: null, // Only get top-level comments
          },
          include: {
            User: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              include: {
                User: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the posts to include isLiked status
    const transformedPosts = posts.map((post) => ({
      ...post,
      isLiked: post.likes && post.likes.length > 0,
      likes: undefined, // Remove the likes array since we only need the count
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

    const { type, content, image } = await request.json();

    console.log("type:", type);
    console.log("content:", content);
    console.log("image:", image);

    if (
      !content ||
      (Array.isArray(content) && content.some((item) => item === undefined))
    ) {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    let normalizedContent = content;
    if (!Array.isArray(content)) {
      normalizedContent = [content];
    }

    const post = await prisma.post.create({
      data: {
        type,
        content: normalizedContent,
        image,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
