"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

const NotificationButton = ({
  demoNotifications,
}: {
  demoNotifications: { id: number; icon: React.ReactNode; message: string }[];
}) => {
  return (
    <div className="relative">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="relative">
              <Bell size={20} />
              {demoNotifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                  {demoNotifications.length}
                </span>
              )}
            </NavigationMenuTrigger>

            <NavigationMenuContent className="w-80 max-h-72 overflow-y-auto p-3 bg-white shadow-xl rounded-xl border border-gray-200 space-y-2">
              {demoNotifications.length === 0 ? (
                <div className="text-sm text-gray-500 px-4 py-2">
                  No new notifications.
                </div>
              ) : (
                demoNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-emerald-50 transition"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      {notif.icon}
                      {notif.message}
                    </div>
                    <Button
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-100 hover:text-green-700 h-7 px-3 text-xs"
                    >
                      Claim
                    </Button>
                  </div>
                ))
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NotificationButton;
