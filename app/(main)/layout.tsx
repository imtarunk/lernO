import type React from "react";
import { Navbar } from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
    </div>
  );
}
