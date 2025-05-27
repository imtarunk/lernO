"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, X, Hash, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePostModalProps {
  type: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    content: { text: string; tags: string[]; link?: string },
    image?: string
  ) => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
}: CreatePostModalProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const extractTagsAndLinks = (text: string) => {
    // Extract hashtags
    const hashtagRegex = /#[\w-]+/g;
    const tags = text.match(hashtagRegex) || [];

    // Extract URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(urlRegex) || [];

    // Remove tags and links from the text
    let cleanText = text;
    tags.forEach((tag) => {
      cleanText = cleanText.replace(tag, "");
    });
    links.forEach((link) => {
      cleanText = cleanText.replace(link, "");
    });

    return {
      text: cleanText.trim(),
      tags: tags.map((tag) => tag.slice(1)), // Remove # from tags
      link: links[0], // Take the first link if any
    };
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { text, tags, link } = extractTagsAndLinks(content);
      await onSubmit({ text, tags, link }, image || undefined);
      setContent("");
      setImage(null);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind? Use #hashtags and paste links..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                <Hash size={14} />
                <span>Add hashtags</span>
                <LinkIcon size={14} className="ml-2" />
                <span>Paste links</span>
              </div>
            </div>
          </div>

          {image && (
            <div className="relative">
              <img
                src={image}
                alt="Preview"
                className="max-h-[300px] w-full object-cover rounded-lg"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <label htmlFor="image-upload">
                <Button variant="ghost" size="sm" asChild>
                  <span className="cursor-pointer">
                    <ImageIcon size={20} />
                  </span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Posting..." : "Post Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
