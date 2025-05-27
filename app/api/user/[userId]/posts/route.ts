import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
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
      likes: {
        where: {
          userId: userId,
        },
      },
      comments: {
        where: {
          parentId: null,
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
  });

  // Transform the posts to include isLiked status
  const transformedPosts = posts.map((post) => ({
    ...post,
    isLiked: post.likes && post.likes.length > 0,
    likes: undefined, // Remove the likes array since we only need the count
  }));

  return NextResponse.json(transformedPosts);
}
