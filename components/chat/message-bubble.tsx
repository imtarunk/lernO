"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    createdAt: Date
    sender: {
      id: string
      name: string
      image?: string
    }
  }
  isOwn: boolean
  showAvatar?: boolean
}

export function MessageBubble({ message, isOwn, showAvatar = true }: MessageBubbleProps) {
  return (
    <div className={cn("flex items-end space-x-2 mb-4", isOwn && "flex-row-reverse space-x-reverse")}>
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.image || ""} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col", isOwn && "items-end")}>
        {!isOwn && showAvatar && <span className="text-xs text-gray-500 mb-1 ml-2">{message.sender.name}</span>}

        <div
          className={cn(
            "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
            isOwn ? "bg-blue-600 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md",
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>

        <span className={cn("text-xs text-gray-500 mt-1", isOwn ? "mr-2" : "ml-2")}>
          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
        </span>
      </div>

      {showAvatar && isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.image || ""} />
          <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
