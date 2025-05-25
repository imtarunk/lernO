"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, MessageCircle, User, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ChatRoom {
  id: string;
  name?: string;
  isGroup: boolean;
  participants: Array<{
    id: string;
    name: string;
    image?: string;
    isOnline: boolean;
  }>;
  lastMessage?: {
    content: string;
    sender: {
      name: string;
    };
    createdAt: string;
  };
}

interface ChatSidebarProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  selectedChatId,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getChatDisplayName = (chat: ChatRoom) => {
    if (chat.isGroup) return chat.name || "Group Chat";
    const otherParticipant = chat.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.name || "Unknown User";
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.isGroup) return "/placeholder.svg"; // Placeholder for group avatar
    const otherParticipant = chat.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.image || "/placeholder.svg";
  };

  const getLastMessagePreview = (chat: ChatRoom) => {
    if (!chat.lastMessage) return "No messages yet";
    const senderName = chat.lastMessage.sender?.name || "Someone";
    const content = chat.lastMessage.content;
    const preview =
      content.length > 40 ? content.substring(0, 40) + "..." : content;
    return `${senderName}: ${preview}`; // Prepend sender name for better context
  };

  const isParticipantOnline = (chat: ChatRoom) => {
    if (chat.isGroup) return false; // Online status typically not shown for groups
    const otherParticipant = chat.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.isOnline || false;
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await fetch("/api/chat/rooms");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch chat rooms"
        );
      }

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        // Add mock data for lastMessage.createdAt if it's missing for demonstration
        const processedData = data.map((chat) => ({
          ...chat,
          lastMessage: chat.lastMessage
            ? {
                ...chat.lastMessage,
                createdAt:
                  chat.lastMessage.createdAt || new Date().toISOString(), // Fallback for createdAt
              }
            : undefined,
        }));
        setChatRooms(processedData);
      } else {
        setChatRooms([]);
        setError("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load chat rooms"
      );
      setChatRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChats = useMemo(() => {
    return chatRooms.filter((chat) => {
      const displayName = getChatDisplayName(chat);
      return displayName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [chatRooms, searchQuery, session?.user?.id]);

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full ">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <MessageCircle className="mr-2 text-blue-500" size={20} />
            Messages
          </h2>
          <Button
            onClick={onNewChat}
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Plus size={20} />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Chat List Section */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1 ">
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                <MessageCircle
                  size={40}
                  className="mx-auto mb-3 animate-bounce text-blue-500"
                />
                <p className="font-medium">Loading conversations...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-red-500"
              >
                <MessageCircle size={40} className="mx-auto mb-3" />
                <p className="font-medium">Error loading chats!</p>
                <p className="text-sm mt-1">{error}</p>
                <Button
                  onClick={fetchChatRooms}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  size="sm"
                >
                  Try Again
                </Button>
              </motion.div>
            ) : filteredChats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-gray-500 dark:text-gray-400"
              >
                <MessageCircle size={40} className="mx-auto mb-3" />
                <p className="font-medium">No conversations found</p>
                <p className="text-sm mt-1">
                  Start a new one or adjust your search.
                </p>
                <Button
                  onClick={onNewChat}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                  size="sm"
                >
                  Start a Chat
                </Button>
              </motion.div>
            ) : (
              filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onClick={() => onChatSelect(chat.id)}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200
                    ${
                      selectedChatId === chat.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800">
                      {chat.isGroup ? (
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <Users size={20} />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage
                            src={getChatAvatar(chat)}
                            alt={getChatDisplayName(chat)}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getChatDisplayName(chat)[0]}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    {!chat.isGroup && isParticipantOnline(chat) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {getChatDisplayName(chat)}
                      </p>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(
                            new Date(chat.lastMessage.createdAt),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-full">
                      {getLastMessagePreview(chat)}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
