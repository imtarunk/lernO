"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageBubble } from "./message-bubble"
import { Send, MoreVertical, Phone, Video } from "lucide-react"
import { getSocket } from "@/lib/socket"
import { encryptMessage, decryptMessage } from "@/lib/encryption"

interface Message {
  id: string
  content: string
  createdAt: Date
  sender: {
    id: string
    name: string
    image?: string
  }
}

interface ChatWindowProps {
  chatRoomId: string
  chatRoom: {
    id: string
    name?: string
    isGroup: boolean
    participants: Array<{
      id: string
      name: string
      image?: string
      isOnline: boolean
    }>
  }
}

export function ChatWindow({ chatRoomId, chatRoom }: ChatWindowProps) {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    fetchMessages()

    const socket = getSocket()
    if (socket) {
      socket.emit("join_chat", chatRoomId)

      socket.on("receive_message", (data) => {
        const decryptedContent = decryptMessage(data.encryptedContent)
        setMessages((prev) => [
          ...prev,
          {
            ...data,
            content: decryptedContent,
          },
        ])
      })

      socket.on("user_typing", (data) => {
        if (data.isTyping) {
          setTypingUsers((prev) => [...prev.filter((id) => id !== data.userId), data.userId])
        } else {
          setTypingUsers((prev) => prev.filter((id) => id !== data.userId))
        }
      })

      return () => {
        socket.off("receive_message")
        socket.off("user_typing")
      }
    }
  }, [chatRoomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages/${chatRoomId}`)
      const data = await response.json()

      // Decrypt messages
      const decryptedMessages = data.map((msg: any) => ({
        ...msg,
        content: decryptMessage(msg.encryptedContent),
      }))

      setMessages(decryptedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const socket = getSocket()

    try {
      const encryptedContent = encryptMessage(newMessage)

      const messageData = {
        chatRoomId,
        encryptedContent,
        content: newMessage, // For real-time display
        senderId: session?.user?.id,
        receiverId: chatRoom.participants.find((p) => p.id !== session?.user?.id)?.id,
      }

      // Send to server
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      })

      if (response.ok) {
        const savedMessage = await response.json()

        // Emit to socket for real-time updates
        if (socket) {
          socket.emit("send_message", {
            ...savedMessage,
            content: newMessage, // Send decrypted for real-time
          })
        }

        // Add to local state
        setMessages((prev) => [
          ...prev,
          {
            ...savedMessage,
            content: newMessage,
          },
        ])

        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = () => {
    const socket = getSocket()
    if (!socket) return

    if (!isTyping) {
      setIsTyping(true)
      socket.emit("typing_start", { chatRoomId })
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit("typing_stop", { chatRoomId })
    }, 1000)
  }

  const getChatDisplayName = () => {
    if (chatRoom.isGroup) return chatRoom.name || "Group Chat"
    const otherParticipant = chatRoom.participants.find((p) => p.id !== session?.user?.id)
    return otherParticipant?.name || "Unknown User"
  }

  const getChatAvatar = () => {
    if (chatRoom.isGroup) return "/placeholder.svg"
    const otherParticipant = chatRoom.participants.find((p) => p.id !== session?.user?.id)
    return otherParticipant?.image || "/placeholder.svg"
  }

  const isUserOnline = () => {
    if (chatRoom.isGroup) return false
    const otherParticipant = chatRoom.participants.find((p) => p.id !== session?.user?.id)
    return otherParticipant?.isOnline || false
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={getChatAvatar() || "/placeholder.svg"} />
              <AvatarFallback>{getChatDisplayName()[0]}</AvatarFallback>
            </Avatar>
            {isUserOnline() && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{getChatDisplayName()}</h3>
            <p className="text-sm text-gray-500">{isUserOnline() ? "Online" : "Offline"}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone size={20} />
          </Button>
          <Button variant="ghost" size="sm">
            <Video size={20} />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical size={20} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isOwn = message.sender.id === session?.user?.id
            const showAvatar = index === 0 || messages[index - 1].sender.id !== message.sender.id

            return <MessageBubble key={message.id} message={message} isOwn={isOwn} showAvatar={showAvatar} />
          })}

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
              <span className="text-sm text-gray-500">Someone is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            placeholder="Write your message..."
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" disabled={!newMessage.trim() || isSending} className="bg-green-600 hover:bg-green-700">
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
