"use client"

import { atom } from "recoil"

export interface UserState {
  id: string
  name: string
  email: string
  image: string
  points: number
}

export const userState = atom<UserState | null>({
  key: "userState",
  default: null,
})

export const createPostModalState = atom({
  key: "createPostModalState",
  default: false,
})

export const activeChatState = atom<string | null>({
  key: "activeChatState",
  default: null,
})
