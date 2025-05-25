"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils"; // cn utility for conditional class merging

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    createdAt: Date;
    sender: {
      id: string;
      name: string;
      image?: string;
    };
  };
  isOwn: boolean;
  showAvatar?: boolean; // Controls whether the avatar is shown
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
}: MessageBubbleProps) {
  // Determine the background color and text color based on whether the message is sent by the current user
  const bubbleClasses = cn(
    "px-4 py-2 rounded-2xl break-words relative shadow-md transition-all duration-200 ease-in-out",
    isOwn
      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg" // Own messages: blue gradient, rounded bottom-right
      : "bg-white text-gray-800 rounded-bl-lg border border-gray-100" // Other messages: white, rounded bottom-left
  );

  // Determine the alignment of the message bubble within its container
  const containerClasses = cn(
    "flex items-end space-x-2", // Default for other's messages: avatar on left, content on right
    isOwn && "flex-row-reverse space-x-reverse" // Own messages: avatar on right, content on left
  );

  // Determine the alignment of the message content (text and timestamp)
  const contentWrapperClasses = cn(
    "flex flex-col max-w-[75%]", // Adjust max-width for better responsiveness
    isOwn ? "items-end" : "items-start" // Align content to the right for own, left for others
  );

  // Fallback image URL for avatars
  const getAvatarFallbackUrl = (name: string) => {
    return `https://placehold.co/36x36/60a5fa/ffffff?text=${name[0]}`;
  };

  return (
    <div className={containerClasses}>
      {/* Avatar for other users' messages (left side) */}
      {showAvatar && !isOwn && (
        <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-white shadow-sm">
          <AvatarImage
            src={
              message.sender.image || getAvatarFallbackUrl(message.sender.name)
            }
            alt={message.sender.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = getAvatarFallbackUrl(message.sender.name);
            }}
          />
          <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-400 text-white font-semibold text-sm">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={contentWrapperClasses}>
        {/* Sender name for other users' messages */}
        {!isOwn && showAvatar && (
          <span className="text-xs text-gray-600 mb-1 ml-2 font-medium">
            {message.sender.name}
          </span>
        )}

        {/* Message Content Bubble */}
        <div className={bubbleClasses}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-xs text-gray-500 mt-1.5 opacity-90 transition-opacity duration-200", // Always visible, slightly transparent
            isOwn ? "mr-2" : "ml-2" // Adjust margin based on sender
          )}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      {/* Avatar for own messages (right side) */}
      {showAvatar && isOwn && (
        <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-white shadow-sm">
          <AvatarImage
            src={
              message.sender.image || getAvatarFallbackUrl(message.sender.name)
            }
            alt={message.sender.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = getAvatarFallbackUrl(message.sender.name);
            }}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-500 text-white font-semibold text-sm">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
