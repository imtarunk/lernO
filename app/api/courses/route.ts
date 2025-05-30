import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { userId, courseId } = await req.json();
  const courses = await prisma.userCourse.findMany({
    where: {
      userId: userId,
      courseId: courseId,
    },
    include: {},
  });
  return NextResponse.json(courses);
}
