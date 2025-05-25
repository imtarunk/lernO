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
  Paperclip,
  Smile,
} from "lucide-react"; // Added User and Users for avatar fallbacks
import { getSocket } from "@/lib/socket";
import { encryptMessage, decryptMessage } from "@/lib/encryption";
import { motion, AnimatePresence } from "framer-motion";

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
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
            <AvatarImage src={getChatAvatar()} alt={getChatDisplayName()} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getChatDisplayName()[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {getChatDisplayName()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isUserOnline() ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.sender.id === session?.user?.id}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      <AnimatePresence>
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400"
          >
            {getTypingUserNames()} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || isSending}
            className="rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
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
