"use client";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

// app/(main)/chat/layout.tsx
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full overflow-hidden pt-16">{children}</body>
    </html>
  );
}
