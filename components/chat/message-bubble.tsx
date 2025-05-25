"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  showAvatar?: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
}: MessageBubbleProps) {
  const bubbleClasses = cn(
    "px-4 py-2 rounded-2xl break-words relative shadow-sm transition-all duration-200 ease-in-out",
    isOwn
      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg hover:shadow-md"
      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-lg border border-gray-100 dark:border-gray-700 hover:shadow-md"
  );

  const containerClasses = cn(
    "flex items-end space-x-2 group",
    isOwn && "flex-row-reverse space-x-reverse"
  );

  const contentWrapperClasses = cn(
    "flex flex-col max-w-[75%]",
    isOwn ? "items-end" : "items-start"
  );

  const getAvatarFallbackUrl = (name: string) => {
    return `https://placehold.co/36x36/60a5fa/ffffff?text=${name[0]}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={containerClasses}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-200 group-hover:scale-105">
          <AvatarImage
            src={
              message.sender.image || getAvatarFallbackUrl(message.sender.name)
            }
            alt={message.sender.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = getAvatarFallbackUrl(message.sender.name);
            }}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={contentWrapperClasses}>
        {!isOwn && showAvatar && (
          <span className="text-xs text-gray-600 dark:text-gray-400 mb-1 ml-2 font-medium">
            {message.sender.name}
          </span>
        )}

        <div className={bubbleClasses}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>

        <span
          className={cn(
            "text-xs text-gray-500 dark:text-gray-400 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            isOwn ? "mr-2" : "ml-2"
          )}
        >
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      {showAvatar && isOwn && (
        <Avatar className="h-9 w-9 flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm transition-transform duration-200 group-hover:scale-105">
          <AvatarImage
            src={
              message.sender.image || getAvatarFallbackUrl(message.sender.name)
            }
            alt={message.sender.name}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = getAvatarFallbackUrl(message.sender.name);
            }}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
