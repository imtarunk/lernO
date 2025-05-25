"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import ChatSidebar from "@/components/chat/chat-sidebar";
import ChatWindow from "@/components/chat/chat-window";
import { initializeSocket, disconnectSocket } from "@/lib/socket";
import { MessageCircle, Loader2 } from "lucide-react";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
  const [selectedChatRoom, setSelectedChatRoom] = useState<any | null>(null);
  const [isChatRoomLoading, setIsChatRoomLoading] = useState(false);
  const [chatRoomError, setChatRoomError] = useState<string | null>(null);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // Initialize socket
  useEffect(() => {
    if (session?.user?.id) {
      const socket = initializeSocket(session.user.id);
      socket.emit("user_connected", session.user.id);
      return () => disconnectSocket();
    }
  }, [session]);

  // Set selected chat ID from URL params
  useEffect(() => {
    const roomId = searchParams.get("room");
    setSelectedChatId(roomId || undefined);
    if (!roomId) setSelectedChatRoom(null);
  }, [searchParams]);

  // Fetch chat room details when selectedChatId changes
  useEffect(() => {
    if (selectedChatId) fetchChatRoom(selectedChatId);
  }, [selectedChatId]);

  const fetchChatRoom = async (chatId: string) => {
    setIsChatRoomLoading(true);
    setChatRoomError(null);
    try {
      await new Promise((res) => setTimeout(res, 300));
      const response = await fetch(`/api/chat/rooms/${chatId}`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.details || data.error || "Failed to fetch chat room details"
        );
      setSelectedChatRoom(data);
    } catch (error) {
      console.error("Error fetching chat room:", error);
      setChatRoomError(
        error instanceof Error ? error.message : "Failed to load chat room"
      );
      setSelectedChatRoom(null);
    } finally {
      setIsChatRoomLoading(false);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    router.push(`/chat?room=${chatId}`);
  };

  const handleNewChat = () => {
    setSelectedChatId(undefined);
    router.push(`/chat`);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl animate-fade-in">
          <Loader2 className="w-14 h-14 text-blue-600 animate-spin-slow mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Loading Chat...
          </h2>
          <p className="text-gray-600 mt-2">Preparing your conversations.</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="h-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4 border-r border-blue-100 overflow-hidden">
          <ChatSidebar
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            selectedChatId={selectedChatId}
          />
        </div>

        {/* Chat Window */}
        <div className="col-span-12 lg:col-span-8 bg-gray-50 flex flex-col">
          {isChatRoomLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-lg">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                <p className="text-lg font-medium text-gray-700">
                  Loading chat room...
                </p>
              </div>
            </div>
          ) : chatRoomError ? (
            <div className="flex-1 flex items-center justify-center text-center p-4">
              <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-md">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-70" />
                <h3 className="text-xl font-semibold mb-2">
                  Error Loading Chat
                </h3>
                <p className="text-sm">{chatRoomError}</p>
                <button
                  onClick={() =>
                    selectedChatId && fetchChatRoom(selectedChatId)
                  }
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : selectedChatRoom ? (
            <ChatWindow
              chatRoomId={selectedChatId!}
              chatRoom={selectedChatRoom}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center p-8 bg-white rounded-xl shadow-md animate-fade-in">
                <MessageCircle className="w-16 h-16 text-blue-400 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to your chats!
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Select a conversation from the sidebar or click the{" "}
                  <span className="font-semibold text-blue-600">"+"</span> to
                  start a new chat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
