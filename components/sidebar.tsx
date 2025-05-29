"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Home, MessageCircle, Settings } from "lucide-react";
import { useUserContext } from "@/components/user-context";
import { useState } from "react";
import Logo from "./logo";

const navItems = [
  { label: "Home", icon: <Home className="w-6 h-6" />, href: "/home" },
  { label: "Chat", icon: <MessageCircle className="w-6 h-6" />, href: "/chat" },
  {
    label: "Settings",
    icon: <Settings className="w-6 h-6" />,
    href: "/settings",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const { profile } = useUserContext();
  const [active, setActive] = useState("/home");

  return (
    <aside className="fixed top-0 left-0 h-screen w-20 bg-white border-none shadow-xl rounded-3xl m-2 flex flex-col items-center py-6 z-50">
      {/* Logo */}
      <div className="mb-10">
        {/* <img
          src="/logo.png"
          alt="Logo"
          className="w-12 h-12 rounded-full shadow"
        /> */}
        <Logo />
      </div>
      {/* Nav Icons */}
      <nav className="flex flex-col items-center gap-6 flex-1">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative group flex flex-col items-center"
          >
            <button
              onClick={() => {
                setActive(item.href);
                router.push(item.href);
              }}
              className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                active === item.href
                  ? "bg-white shadow-md"
                  : "hover:bg-gray-100"
              }`}
              title={item.label}
            >
              <span
                className={`text-gray-500 ${
                  active === item.href ? "text-blue-500" : ""
                }`}
              >
                {item.icon}
              </span>
            </button>
            {/* Tooltip */}
            <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
              {item.label}
            </div>
          </div>
        ))}
      </nav>
      {/* Bottom avatar */}
      <div className="flex flex-col items-center gap-6 mt-auto mb-2">
        <div className="relative group flex flex-col items-center">
          <button
            onClick={() => router.push(`/profile/${profile?.id}`)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100"
            title="Profile"
          >
            <Avatar
              className="h-10 w-10 ring-2 ring-white"
              onClick={() => router.push(`/profile/${profile?.id}`)}
            >
              <AvatarImage
                src={profile?.image || undefined}
                alt="Your Profile"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {profile?.name ? profile.name[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </button>
          {/* Tooltip */}
          <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            Profile
          </div>
        </div>
      </div>
    </aside>
  );
}
