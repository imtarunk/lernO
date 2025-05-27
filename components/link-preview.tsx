"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
  siteName?: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/link-preview?url=${encodeURIComponent(url)}`
        );
        if (response.ok) {
          const data = await response.json();
          setPreviewData(data);
        }
      } catch (error) {
        console.error("Error fetching link preview:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (url) {
      fetchPreview();
    }
  }, [url]);

  // Handle YouTube embeds
  if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
    const videoId = url.includes("youtube.com/watch")
      ? new URL(url).searchParams.get("v")
      : url.split("youtu.be/")[1];

    if (videoId) {
      return (
        <div className="mt-2 rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        </div>
      );
    }
  }

  // Handle Twitter/X embeds
  if (url.includes("twitter.com/") || url.includes("x.com/")) {
    return (
      <div className="mt-2">
        <blockquote className="twitter-tweet">
          <a href={url}></a>
        </blockquote>
        <script async src="https://platform.twitter.com/widgets.js"></script>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-2 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  return (
    <Card className="mt-2 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex">
            {previewData.image && (
              <div className="w-1/3">
                <img
                  src={previewData.image}
                  alt={previewData.title || "Link preview"}
                  className="w-full h-full object-cover rounded-l-lg"
                />
              </div>
            )}
            <div className={`p-4 ${previewData.image ? "w-2/3" : "w-full"}`}>
              <div className="flex items-center gap-2 mb-1">
                {previewData.favicon && (
                  <img src={previewData.favicon} alt="" className="w-4 h-4" />
                )}
                <span className="text-sm text-gray-500">
                  {previewData.siteName || new URL(url).hostname}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                {previewData.title}
              </h3>
              {previewData.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {previewData.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                <ExternalLink size={14} />
                <span>{new URL(url).hostname}</span>
              </div>
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
}
