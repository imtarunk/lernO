"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type FollowingUser = User;

interface FollowingCardProps {
  userId: string;
}

const FollowingCard = ({ userId }: FollowingCardProps) => {
  const router = useRouter();
  const [followings, setFollowings] = useState<FollowingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/user/${userId}/followings`);
        if (response.ok) {
          const data = await response.json();
          setFollowings(data);
        }
      } catch (error) {
        console.error("Error fetching followings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFollowings();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">People Following</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            See all
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-2 rounded-lg animate-pulse"
            >
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (followings.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">People Following</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            See all
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No followings yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">People Following</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
        >
          See all
        </Button>
      </div>
      <div className="space-y-4">
        {followings.slice(0, 5).map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => router.push(`/profile/${user.id}`)}
          >
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {user.name}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {user.isOnline
                  ? "Online"
                  : user.lastSeen
                  ? `Last seen ${formatDistanceToNow(new Date(user.lastSeen), {
                      addSuffix: true,
                    })}`
                  : user.email?.split("@")[0]}
              </div>
            </div>
            <div className="text-sm text-gray-500">{user.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowingCard;
