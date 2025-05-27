import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  const userId = session.user.id;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post)
    return NextResponse.json({ error: "Post not found" }, { status: 404 });

  const isLiked = post.likes.includes(userId);

  const updatedLikes = isLiked
    ? post.likes.filter((id) => id !== userId) // Unlike
    : [...post.likes, userId]; // Like

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { likes: updatedLikes },
  });

  return NextResponse.json({
    isLiked: !isLiked,
    likeUsers: updatedPost,
  });
}
