"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  points?: number;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserContextType {
  profile: User | null;
  setProfile: (user: User | null) => void;
  followings: User[];
  setFollowings: (users: User[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<User | null>(null);
  const [followings, setFollowings] = useState<User[]>([]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/user/profile`);
          if (res.ok) {
            const data = await res.json();
            setProfile(data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [session]);

  // Fetch followings
  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const res = await fetch("/api/user/followings");
        if (res.ok) {
          const data: User[] = await res.json();
          setFollowings(data);
        }
      } catch (error) {
        console.error("Error fetching followings:", error);
      }
    };
    fetchFollowings();
  }, []);

  return (
    <UserContext.Provider
      value={{ profile, setProfile, followings, setFollowings }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error("useUserContext must be used within a UserProvider");
  return ctx;
}
