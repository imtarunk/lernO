import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const title =
      $('meta[property="og:title"]').attr("content") || $("title").text();
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");
    const image = $('meta[property="og:image"]').attr("content");
    const siteName = $('meta[property="og:site_name"]').attr("content");
    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    // Handle relative URLs
    const baseUrl = new URL(url);
    const absoluteFavicon = favicon
      ? new URL(favicon, baseUrl.origin).toString()
      : `${baseUrl.origin}/favicon.ico`;

    return NextResponse.json({
      title,
      description,
      image,
      siteName,
      favicon: absoluteFavicon,
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch link preview" },
      { status: 500 }
    );
  }
}
