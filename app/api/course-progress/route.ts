import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { userId, courseId, progress } = await req.json();

    if (!userId || !courseId || progress === undefined) {
      return NextResponse.json(
        { error: "userId, courseId, and progress are required" },
        { status: 400 }
      );
    }

    // Find the user course first
    const userCourse = await prisma.userCourse.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!userCourse) {
      return NextResponse.json(
        { error: "User course not found" },
        { status: 404 }
      );
    }

    // Update course progress
    const updatedProgress = await prisma.courseProgress.update({
      where: {
        courseId_userId: {
          courseId: userCourse.id,
          userId,
        },
      },
      data: {
        progress,
      },
    });

    // If progress is 100%, mark course as completed
    if (progress === 100) {
      await prisma.userCourse.update({
        where: {
          id: userCourse.id,
        },
        data: {
          isCompleted: true,
          isInProgress: false,
        },
      });
    }

    return NextResponse.json(updatedProgress);
  } catch (error) {
    console.error("Error updating course progress:", error);
    return NextResponse.json(
      { error: "Failed to update course progress" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "userId and courseId are required" },
        { status: 400 }
      );
    }

    // Find the user course first
    const userCourse = await prisma.userCourse.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (!userCourse) {
      return NextResponse.json(
        { error: "User course not found" },
        { status: 404 }
      );
    }

    const progress = await prisma.courseProgress.findFirst({
      where: {
        courseId: userCourse.id,
        userId,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch course progress" },
      { status: 500 }
    );
  }
}
