"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Assuming MessageBubble component is styled to fit the new aesthetic
import { MessageBubble } from "./message-bubble";
import {
  Send,
  MoreVertical,
  Phone,
  Video,
  User,
  Users,
  MessageCircle,
} from "lucide-react"; // Added User and Users for avatar fallbacks
import { getSocket } from "@/lib/socket";
import { encryptMessage, decryptMessage } from "@/lib/encryption";

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
}

interface ChatWindowProps {
  chatRoomId: string;
  chatRoom: {
    id: string;
    name?: string;
    isGroup: boolean;
    participants: Array<{
      id: string;
      name: string;
      image?: string;
      isOnline: boolean;
    }>;
  };
}

export default function ChatWindow({ chatRoomId, chatRoom }: ChatWindowProps) {
  // Changed to default export
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchMessages();

    const socket = getSocket();
    if (socket) {
      socket.emit("join_chat", chatRoomId);

      socket.on("receive_message", (data) => {
        // Ensure data.encryptedContent exists before decrypting
        const decryptedContent = data.encryptedContent
          ? decryptMessage(data.encryptedContent)
          : data.content;
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            content: decryptedContent,
            createdAt: new Date(data.createdAt || Date.now()), // Ensure createdAt is a Date object
          },
        ]);
      });

      socket.on("user_typing", (data) => {
        // Filter out current user's own typing status from displaying
        if (data.userId === session?.user?.id) return;

        if (data.isTyping) {
          setTypingUsers((prev) => [
            ...prev.filter((id) => id !== data.userId),
            data.userId,
          ]);
        } else {
          setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
        }
      });

      return () => {
        socket.off("receive_message");
        socket.off("user_typing");
        socket.emit("leave_chat", chatRoomId); // Clean up on unmount
      };
    }
  }, [chatRoomId, session?.user?.id]); // Added session.user.id to dependencies

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]); // Scroll to bottom when messages or typing status changes

  const fetchMessages = async () => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await fetch(`/api/chat/messages/${chatRoomId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.error || "Failed to fetch messages"
        );
      }

      // Decrypt messages and ensure createdAt is a Date object
      const decryptedMessages = data.map((msg: any) => ({
        ...msg,
        content: msg.encryptedContent
          ? decryptMessage(msg.encryptedContent)
          : msg.content,
        createdAt: new Date(msg.createdAt || Date.now()),
      }));

      setMessages(decryptedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Optionally set an error state to display to the user
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const socket = getSocket();

    try {
      const encryptedContent = encryptMessage(newMessage);

      const messageData = {
        chatRoomId,
        encryptedContent,
        // content: newMessage, // No need to send decrypted content to server
        senderId: session?.user?.id,
        receiverId: chatRoom.participants.find(
          (p) => p.id !== session?.user?.id
        )?.id,
        createdAt: new Date().toISOString(), // Add creation timestamp
      };

      // Send to server
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        // Emit to socket for real-time updates
        if (socket) {
          socket.emit("send_message", {
            ...savedMessage,
            content: newMessage, // Send decrypted content for real-time display
            createdAt: new Date(savedMessage.createdAt || Date.now()),
          });
        }

        // Add to local state (ensure content is decrypted for local display)
        setMessages((prev) => [
          ...prev,
          {
            ...savedMessage,
            content: newMessage,
            createdAt: new Date(savedMessage.createdAt || Date.now()),
          },
        ]);

        setNewMessage("");
        // Immediately stop typing indicator for self after sending message
        if (isTyping) {
          setIsTyping(false);
          socket?.emit("typing_stop", { chatRoomId });
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to send message:", errorData);
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show an error message to the user
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    if (!socket || !session?.user?.id) return; // Ensure user ID is available

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing_start", { chatRoomId, userId: session.user.id });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 1 second of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing_stop", { chatRoomId, userId: session.user.id });
    }, 1000);
  };

  const getChatDisplayName = () => {
    if (chatRoom.isGroup) return chatRoom.name || "Group Chat";
    const otherParticipant = chatRoom.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.name || "Unknown User";
  };

  const getChatAvatar = () => {
    if (chatRoom.isGroup) return "/placeholder.svg"; // Fallback for group avatar
    const otherParticipant = chatRoom.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.image || "/placeholder.svg";
  };

  const isUserOnline = () => {
    if (chatRoom.isGroup) return false; // Online status typically not shown for groups
    const otherParticipant = chatRoom.participants.find(
      (p) => p.id !== session?.user?.id
    );
    return otherParticipant?.isOnline || false;
  };

  // Get names of typing users (excluding current user)
  const getTypingUserNames = () => {
    const names = typingUsers
      .filter((userId) => userId !== session?.user?.id) // Exclude self
      .map((userId) => {
        const participant = chatRoom.participants.find((p) => p.id === userId);
        return participant?.name || "Someone";
      });

    if (names.length === 0) return "";
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return `${names.length} people are typing...`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 rounded-l-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between rounded-tl-lg shadow-md">
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              {chatRoom.isGroup ? (
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold text-lg">
                  <Users size={20} />
                </AvatarFallback>
              ) : (
                <>
                  <AvatarImage
                    src={
                      getChatAvatar() ||
                      `https://placehold.co/48x48/60a5fa/ffffff?text=${
                        getChatDisplayName()[0]
                      }`
                    }
                    alt={getChatDisplayName()}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/48x48/60a5fa/ffffff?text=${
                        getChatDisplayName()[0]
                      }`;
                    }}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg">
                    {getChatDisplayName()[0]}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            {!chatRoom.isGroup && isUserOnline() && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl">{getChatDisplayName()}</h3>
            <p className="text-sm opacity-90">
              {chatRoom.isGroup
                ? "Group Chat"
                : isUserOnline()
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-500/30 rounded-full transition-colors duration-200"
            title="Voice Call"
          >
            <Phone size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-500/30 rounded-full transition-colors duration-200"
            title="Video Call"
          >
            <Video size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-500/30 rounded-full transition-colors duration-200"
            title="More Options"
          >
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-gray-100 custom-scrollbar">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <MessageBubblePlaceholder /> {/* Placeholder for no messages */}
              <p className="mt-4 text-lg font-semibold">No messages yet!</p>
              <p className="text-sm">Start the conversation by typing below.</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwn = message.sender.id === session?.user?.id;
              const showAvatar =
                index === 0 ||
                messages[index - 1].sender.id !== message.sender.id ||
                isOwn !== (messages[index - 1].sender.id === session?.user?.id); // Show avatar if sender changes or if it's the first message from a new sender block

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                />
              );
            })
          )}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-600 animate-fade-in-up">
              <div className="flex space-x-1">
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse-dot" />
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse-dot delay-100" />
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse-dot delay-200" />
              </div>
              <span className="text-sm font-medium">
                {getTypingUserNames()}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200 rounded-bl-lg shadow-inner"
      >
        <div className="flex items-center space-x-3 max-w-3xl mx-auto">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message here..."
            className="flex-1 py-2.5 px-4 rounded-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 w-11 flex items-center justify-center shadow-md transition-all duration-200 transform hover:scale-105"
            title="Send Message"
          >
            <Send size={20} />
          </Button>
        </div>
      </form>

      {/* Custom Scrollbar and Animation Styles */}
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

        @keyframes pulse-dot {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.2s infinite ease-in-out;
        }
        .animate-pulse-dot.delay-100 {
          animation-delay: 0.1s;
        }
        .animate-pulse-dot.delay-200 {
          animation-delay: 0.2s;
        }

        @keyframes fadeInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInFromBottom 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// Simple placeholder component for no messages
const MessageBubblePlaceholder: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="relative w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 opacity-70 animate-bounce-slow">
      <MessageCircle size={48} />
      <div className="absolute top-0 right-0 w-6 h-6 bg-blue-400 rounded-full animate-ping-slow" />
    </div>
  </div>
);
