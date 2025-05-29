import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const courses = await prisma.course.findMany({
    where: { userId },
    include: { User: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}
