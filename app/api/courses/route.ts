import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const courses = await prisma.course.findMany({
    include: {
      User: true, // include author info
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(courses);
}
