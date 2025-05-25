"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Home,
  User,
  MessageCircle,
  Users,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Circle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/components/user-context";

const menu = [
  { label: "Profile", icon: <User className="w-5 h-5" />, href: "/home" },
  {
    label: "Home",
    icon: <Home className="w-5 h-5" />,
    href: "/home",
  },
  { label: "Chat", icon: <MessageCircle className="w-5 h-5" />, href: "/chat" },
  //   { label: "Friends", icon: <Users className="w-5 h-5" />, href: "/friends" },
];

const statusItems = [
  { label: "Online", color: "bg-green-500", count: 12 },
  { label: "Away", color: "bg-yellow-500", count: 3 },
  { label: "Busy", color: "bg-red-500", count: 1 },
  { label: "Offline", color: "bg-gray-400", count: 8 },
];

export default function Sidebar() {
  const router = useRouter();
  const { profile, followings, setFollowings } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("/feed");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchFollowings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/user/followings");
        if (res.ok) {
          const data: any[] = await res.json();
          setFollowings(data);
        }
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchFollowings();
    // eslint-disable-next-line
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-80"
        } min-h-screen transition-all duration-300 ease-in-out flex flex-col ${
          isDark
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        } border-r fixed top-0 left-0 z-50 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative`}
      >
        {/* Mobile close button */}
        <button
          onClick={toggleMobile}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className={`absolute -right-3 top-8 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-md ${
            isDark
              ? "bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          } hidden lg:flex`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        <div className="flex-1 overflow-y-auto">
          {/* Main Navigation */}
          <div className="p-6 mt-16">
            {!isCollapsed && (
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                MAIN
              </div>
            )}
            <nav className="space-y-2">
              {menu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    setActiveMenuItem(item.href);
                    setIsMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative ${
                    activeMenuItem === item.href
                      ? isDark
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-900 text-white shadow-lg"
                      : isDark
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? item.label : ""}
                >
                  <span
                    className={`${
                      activeMenuItem === item.href ? "text-white" : ""
                    } transition-colors`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-sm">{item.label}</span>
                  )}
                  {activeMenuItem === item.href && !isCollapsed && (
                    <div className="absolute right-3 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Status Section */}
          {!isCollapsed && (
            <div className="px-6 pb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                STATUS
              </div>
              <div className="space-y-2">
                {statusItems.map((status) => (
                  <div
                    key={status.label}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${status.color} shadow-sm`}
                    ></div>
                    <span className="text-sm font-medium flex-1">
                      {status.label}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {status.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Followings */}
          <div className="px-6 pb-6">
            {!isCollapsed && (
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                FOLLOWINGS
              </div>
            )}
            <div className="space-y-2">
              {loading
                ? !isCollapsed && (
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-400">Loading...</span>
                    </div>
                  )
                : followings.length === 0
                ? !isCollapsed && (
                    <span className="text-sm text-gray-400 px-3">
                      No followings
                    </span>
                  )
                : followings.slice(0, isCollapsed ? 3 : 8).map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${
                        isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                      } ${isCollapsed ? "justify-center" : ""}`}
                      onClick={() => {
                        router.push(`/profile/${user.id}`);
                        setIsMobileOpen(false);
                      }}
                      title={isCollapsed ? user.name || "" : ""}
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-gray-200 dark:ring-gray-700">
                        <AvatarImage
                          src={user.image || undefined}
                          alt={user.name || "User"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                          {user.name ? user.name[0].toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">
                            {user.name}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Online
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`p-6 border-t ${
            isDark ? "border-gray-700" : "border-gray-200"
          } space-y-4`}
        >
          {/* Theme Toggle */}
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center rounded-lg p-1 ${
                isDark ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <button
                onClick={() => setIsDark(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  !isDark
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                <Sun className="w-4 h-4" />
                {!isCollapsed && <span>Light</span>}
              </button>
              <button
                onClick={() => setIsDark(true)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                  isDark
                    ? "bg-gray-700 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Moon className="w-4 h-4" />
                {!isCollapsed && <span>Dark</span>}
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div
            className={`flex items-center gap-3 p-4 rounded-xl ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-700">
              <AvatarImage
                src={profile?.image || undefined}
                alt="Your Profile"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {profile?.name ? profile.name[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {profile?.name || "User"}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Online
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
