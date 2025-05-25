"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, X } from "lucide-react"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (content: string, image?: string) => void
}

export function CreatePostModal({ isOpen, onClose, onSubmit }: CreatePostModalProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setIsSubmitting(true)
    await onSubmit(content, image || undefined)
    setContent("")
    setImage(null)
    setIsSubmitting(false)
    onClose()
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share your learning journey and inspire others!"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-none p-0 focus-visible:ring-0"
              />
            </div>
          </div>

          {image && (
            <div className="relative">
              <img
                src={image || "/placeholder.svg"}
                alt="Upload preview"
                className="w-full rounded-lg max-h-64 object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              >
                <X size={16} />
              </Button>
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
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
  )
}
