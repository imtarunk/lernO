"use client";

import type React from "react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface UserState {
  id: string;
  name: string;
  email: string;
  image: string;
  points: number;
}

interface AppContextType {
  user: UserState | null;
  setUser: (user: UserState | null) => void;
  createPostModalOpen: boolean;
  setCreatePostModalOpen: (open: boolean) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState | null>(null);
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        createPostModalOpen,
        setCreatePostModalOpen,
        activeChatId,
        setActiveChatId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>{children}</AppProvider>
    </SessionProvider>
  );
}
