"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, MessageCircle } from "lucide-react";
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
  };
}

interface ChatSidebarProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({
  selectedChatId,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/chat/rooms");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch chat rooms"
        );
      }

      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setChatRooms(data);
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

  const filteredChats = chatRooms.filter((chat) =>
    chat.participants.some((participant) =>
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getChatDisplayName = (chat: ChatRoom) => {
    if (chat.isGroup) return chat.name || "Group Chat";
    const otherParticipant = chat.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.name || "Unknown User";
  };

  const getChatAvatar = (chat: ChatRoom) => {
    if (chat.isGroup) return "/placeholder.svg";
    const otherParticipant = chat.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.image || "/placeholder.svg";
  };

  const getLastMessagePreview = (chat: ChatRoom) => {
    if (!chat.lastMessage) return "No messages yet";
    return chat.lastMessage.content.length > 50
      ? chat.lastMessage.content.substring(0, 50) + "..."
      : chat.lastMessage.content;
  };

  const isParticipantOnline = (chat: ChatRoom) => {
    if (chat.isGroup) return false;
    const otherParticipant = chat.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.isOnline || false;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Chat</h2>
          <Button onClick={onNewChat} size="sm" variant="ghost">
            <Plus size={20} />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle
                size={48}
                className="mx-auto mb-4 opacity-50 animate-pulse"
              />
              <p>Loading conversations...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>{error}</p>
              <Button
                onClick={fetchChatRooms}
                className="mt-2"
                size="sm"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <Button onClick={onNewChat} className="mt-2" size="sm">
                Start a chat
              </Button>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChatId === chat.id
                    ? "bg-blue-50 border border-blue-200"
                    : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={getChatAvatar(chat) || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {getChatDisplayName(chat)[0]}
                    </AvatarFallback>
                  </Avatar>
                  {!chat.isGroup && isParticipantOnline(chat) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {getChatDisplayName(chat)}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(
                          new Date(chat.lastMessage.createdAt),
                          { addSuffix: true }
                        )}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {getLastMessagePreview(chat)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
