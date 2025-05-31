import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, courseId } = await req.json();

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId are required" },
        { status: 400 }
      );
    }

    // Create user course with isInProgress set to true
    const userCourse = await prisma.userCourse.create({
      data: {
        userId,
        courseId,
        isInProgress: true,
      },
    });

    // Create initial course progress
    const courseProgress = await prisma.courseProgress.create({
      data: {
        userId,
        courseId: userCourse.id,
        progress: 0,
      },
    });

    return NextResponse.json({ userCourse, courseProgress });
  } catch (error) {
    console.error("Error creating user course:", error);
    return NextResponse.json(
      { error: "Failed to create user course" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const where = {
      userId,
      ...(courseId && { courseId }),
    };

    const userCourses = await prisma.userCourse.findMany({
      where,
      include: {
        CourseProgress: true,
      },
    });

    return NextResponse.json(userCourses);
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch user courses" },
      { status: 500 }
    );
  }
}
