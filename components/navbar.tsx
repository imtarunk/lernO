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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import axios from "axios";

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

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
    courses: [],
  });

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      const res = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setSearchResults(res.data);
    } else {
      setSearchResults({ users: [], posts: [], courses: [] });
    }
  };

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
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                onFocus={() => setSearchOpen(true)}
                readOnly
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-lg w-full p-0 bg-white rounded-2xl shadow-2xl">
          <div className="p-6">
            <Input
              autoFocus
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="mt-4 max-h-80 overflow-y-auto space-y-4">
              {searchQuery.length > 1 && (
                <>
                  {/* Users */}
                  {searchResults.users.length > 0 && (
                    <div>
                      <div className="font-bold text-xs text-gray-400 mb-1">
                        Users
                      </div>
                      {searchResults.users.map((user: any) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <img
                            src={user.image || "/avatar.png"}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Posts */}
                  {searchResults.posts.length > 0 && (
                    <div>
                      <div className="font-bold text-xs text-gray-400 mb-1 mt-2">
                        Posts
                      </div>
                      {searchResults.posts.map((post: any) => (
                        <div
                          key={post.id}
                          className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <div className="font-semibold">{post.type}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {Array.isArray(post.content) &&
                              post.content[0]?.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Courses */}
                  {searchResults.courses.length > 0 && (
                    <div>
                      <div className="font-bold text-xs text-gray-400 mb-1 mt-2">
                        Courses
                      </div>
                      {searchResults.courses.map((course: any) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <img
                            src={course.image || ""}
                            className="w-8 h-8 rounded"
                          />
                          <div>
                            <div className="font-semibold">{course.title}</div>
                            <div className="text-xs text-gray-500">
                              by {course.User?.name}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* No results */}
                  {searchResults.users.length === 0 &&
                    searchResults.posts.length === 0 &&
                    searchResults.courses.length === 0 && (
                      <div className="text-gray-400 text-center py-8">
                        No results found.
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
