"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
import { Navbar } from "@/components/navbar"
import { initializeSocket, disconnectSocket } from "@/lib/socket"
import { MessageCircle } from "lucide-react"

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedChatId, setSelectedChatId] = useState<string>()
  const [selectedChatRoom, setSelectedChatRoom] = useState<any>()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      // Initialize socket connection
      const socket = initializeSocket(session.user.id)
      socket.emit("user_connected", session.user.id)

      return () => {
        disconnectSocket()
      }
    }
  }, [session])

  useEffect(() => {
    if (selectedChatId) {
      fetchChatRoom(selectedChatId)
    }
  }, [selectedChatId])

  const fetchChatRoom = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/rooms/${chatId}`)
      const data = await response.json()
      setSelectedChatRoom(data)
    } catch (error) {
      console.error("Error fetching chat room:", error)
    }
  }

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId)
  }

  const handleNewChat = () => {
    // TODO: Implement new chat creation
    console.log("Create new chat")
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex h-[calc(100vh-64px)]">
        <ChatSidebar selectedChatId={selectedChatId} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />

        {selectedChatId && selectedChatRoom ? (
          <ChatWindow chatRoomId={selectedChatId} chatRoom={selectedChatRoom} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center text-gray-500">
              <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
