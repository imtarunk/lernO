"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Users, Trophy } from "lucide-react";

interface User {
  id: string;
  name: string;
  image?: string;
  points: number;
}

export function UserSuggestions() {
  const { data: session } = useSession();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  const fetchSuggestedUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/users/suggestions");
      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }
      const data = await response.json();
      // Ensure data is an array
      setSuggestedUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching suggested users:", error);
      setError("Failed to load suggestions");
      setSuggestedUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}/follow`, {
        method: "POST",
      });

      if (response.ok) {
        // Remove the followed user from suggestions
        setSuggestedUsers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (suggestedUsers.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="w-full overflow-y-auto max-h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          Suggested Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => router.push(`/profile/${user.id}`)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Trophy size={14} className="text-yellow-500" />
                      <span>{user.points} points</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow(user.id);
                  }}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                >
                  <UserPlus size={16} />
                  Follow
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
