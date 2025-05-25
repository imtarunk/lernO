"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, MessageCircle, User, Users } from "lucide-react"; // Added User and Users for group/individual chat icons
import { formatDistanceToNow } from "date-fns";

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
    createdAt: string; // Ensure createdAt is part of lastMessage for date-fns
  };
}

interface ChatSidebarProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  // Changed to default export for easier use
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
    <div className="w-80 bg-gradient-to-br from-blue-50 to-white border-r border-blue-100 flex flex-col h-full shadow-lg rounded-r-lg">
      {/* Header Section */}
      <div className="p-5 border-b border-blue-200 bg-white/80 backdrop-blur-sm rounded-tr-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-gray-800 flex items-center">
            <MessageCircle className="mr-2 text-blue-600" size={24} />
            Messages
          </h2>
          <Button
            onClick={onNewChat}
            size="icon" // Changed to icon size for a cleaner look
            variant="ghost"
            className="rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
            title="Start New Chat"
          >
            <Plus size={22} />
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full bg-blue-50 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm"
          />
        </div>
      </div>

      {/* Chat List Section */}
      <ScrollArea className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-3 space-y-2">
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              <MessageCircle
                size={56}
                className="mx-auto mb-4 opacity-40 animate-bounce text-blue-400"
              />
              <p className="font-semibold text-lg">Loading conversations...</p>
              <p className="text-sm">Please wait a moment.</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <MessageCircle size={56} className="mx-auto mb-4 opacity-50" />
              <p className="font-semibold text-lg">Error loading chats!</p>
              <p className="text-sm">{error}</p>
              <Button
                onClick={fetchChatRooms}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-all duration-200"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <MessageCircle size={56} className="mx-auto mb-4 opacity-40" />
              <p className="font-semibold text-lg">No conversations found</p>
              <p className="text-sm">Start a new one or adjust your search.</p>
              <Button
                onClick={onNewChat}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-all duration-200"
                size="sm"
              >
                Start a Chat
              </Button>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.01] shadow-sm
                  ${
                    selectedChatId === chat.id
                      ? "bg-blue-100 border border-blue-300 shadow-md ring-2 ring-blue-300 ring-opacity-50"
                      : "bg-white hover:bg-gray-50 border border-gray-100"
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                    {" "}
                    {/* Larger avatar */}
                    {chat.isGroup ? (
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold text-xl">
                        <Users size={24} /> {/* Group icon */}
                      </AvatarFallback>
                    ) : (
                      <>
                        <AvatarImage
                          src={
                            getChatAvatar(chat) ||
                            `https://placehold.co/56x56/a78bfa/ffffff?text=${
                              getChatDisplayName(chat)[0]
                            }`
                          }
                          alt={getChatDisplayName(chat)}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            target.src = `https://placehold.co/56x56/a78bfa/ffffff?text=${
                              getChatDisplayName(chat)[0]
                            }`;
                          }}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xl">
                          {getChatDisplayName(chat)[0]}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  {!chat.isGroup && isParticipantOnline(chat) && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-md" />
                  )}
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-lg text-gray-800 truncate">
                      {getChatDisplayName(chat)}
                    </h3>
                    {chat.lastMessage && chat.lastMessage.createdAt && (
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2 font-medium">
                        {formatDistanceToNow(
                          new Date(chat.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {getLastMessagePreview(chat)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      {/* Custom Scrollbar Style (optional, can be moved to global CSS) */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #a7d3f8; /* Lighter blue */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #60a5fa; /* Darker blue on hover */
        }
      `}</style>
    </div>
  );
}
