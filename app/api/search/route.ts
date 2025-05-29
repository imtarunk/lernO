import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q) return NextResponse.json({ users: [], posts: [], courses: [] });

  const [users, courses] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true, image: true },
      take: 10,
    }),
    prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      include: { User: true },
      take: 10,
    }),
  ]);

  // Fetch posts and filter in JS for content.text
  const postsRaw = await prisma.post.findMany({
    select: {
      id: true,
      type: true,
      content: true,
      image: true,
      authorId: true,
    },
    take: 50,
  });
  const posts = postsRaw.filter(
    (post) =>
      Array.isArray(post.content) &&
      post.content.some(
        (c: any) =>
          typeof c.text === "string" &&
          c.text.toLowerCase().includes(q.toLowerCase())
      )
  );

  return NextResponse.json({ users, posts, courses });
}
