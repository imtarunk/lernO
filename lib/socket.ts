"use client"

import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

export const initializeSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      query: { userId },
      transports: ["websocket"],
    })
  }
  return socket
}

export const getSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
