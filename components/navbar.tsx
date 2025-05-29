"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  User,
  BookOpen,
  Moon,
  Search,
  Menu,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import NotificationButton from "./notification/notificationButton";

import { Award, CircleDollarSign, Crown } from "lucide-react";
import { ModeToggle } from "./theam-togglebutton";

const demoNotifications = [
  {
    id: 1,
    icon: <Award className="text-green-600" size={18} />,
    message: "Quiz Master Badge",
  },
  {
    id: 2,
    icon: <CircleDollarSign className="text-green-600" size={18} />,
    message: "100 Bonus Points",
  },
  {
    id: 3,
    icon: <Crown className="text-green-600" size={18} />,
    message: "Premium Access (1 week)",
  },
];

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section with logo and search */}
          <div className="flex items-center gap-4 flex-1">
            <Link
              href="/home"
              className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              CLAY
            </Link>

            <div className="hidden md:block relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full hover:bg-gray-100"
            >
              <Menu size={24} />
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={() => router.push("/home")}
            >
              <Home size={20} />
              <span>Home</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={() => router.push("/playground")}
            >
              <Gamepad2 size={20} />
              <span>Playground</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              onClick={() => router.push("/learning")}
            >
              <BookOpen size={20} />
              <span>Learning</span>
            </Button>
          </div>

          {/* Right section with actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
            >
              <ModeToggle />
            </Button>
            <NotificationButton demoNotifications={demoNotifications} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {session?.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                  className="cursor-pointer"
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <Home size={20} />
                <span>Home</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <User size={20} />
                <span>Profile</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <BookOpen size={20} />
                <span>Learning</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
