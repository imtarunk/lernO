import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `cover-${session.user.id}-${timestamp}-${Math.random()
      .toString(36)
      .substring(7)}.${file.type.split("/")[1]}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const coversDir = path.join(uploadsDir, "covers");

    try {
      await mkdir(uploadsDir, { recursive: true });
      await mkdir(coversDir, { recursive: true });
    } catch (error) {
      console.error("Error creating directories:", error);
    }

    // Save file
    const filePath = path.join(coversDir, filename);
    await writeFile(filePath, buffer);

    // Update user's cover image in database
    const imageUrl = `/uploads/covers/${filename}`;
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        coverImage: imageUrl,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error uploading cover image:", error);
    return NextResponse.json(
      { error: "Failed to upload cover image" },
      { status: 500 }
    );
  }
}
