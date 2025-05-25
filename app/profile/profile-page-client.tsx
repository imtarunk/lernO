"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Trophy,
  Target,
  Calendar,
  Star,
  PenTool,
  MessageSquare,
  Heart,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  points: number;
  level: number;
  joinDate: string;
  bio: string;
  achievements: Achievement[];
  stats: UserStats;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface UserStats {
  posts: number;
  comments: number;
  likes: number;
  learningStreak: number;
}

export function ProfilePageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Replace with actual API call
      const mockProfile: UserProfile = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        image: "/placeholder-avatar.jpg",
        points: 1250,
        level: 5,
        joinDate: "2024-01-01",
        bio: "Passionate about learning and sharing knowledge with others.",
        achievements: [
          {
            id: "1",
            title: "First Post",
            description: "Created your first post",
            icon: "🎉",
            unlockedAt: "2024-01-02",
          },
          {
            id: "2",
            title: "Learning Streak",
            description: "Maintained a 7-day learning streak",
            icon: "🔥",
            unlockedAt: "2024-01-10",
          },
        ],
        stats: {
          posts: 15,
          comments: 42,
          likes: 128,
          learningStreak: 7,
        },
      };
      setProfile(mockProfile);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.image} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-600 mb-2">{profile.bio}</p>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    Level {profile.level}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {profile.points} Points
                  </Badge>
                  <Badge variant="secondary" className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Joined {new Date(profile.joinDate).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Posts</p>
                  <p className="text-2xl font-bold">{profile.stats.posts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Comments</p>
                  <p className="text-2xl font-bold">{profile.stats.comments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Likes</p>
                  <p className="text-2xl font-bold">{profile.stats.likes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Learning Streak</p>
                  <p className="text-2xl font-bold">
                    {profile.stats.learningStreak} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: Add activity feed */}
                <p className="text-gray-500">No recent activity</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement) => (
                    <Card key={achievement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Unlocked{" "}
                              {new Date(
                                achievement.unlockedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning">
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {/* TODO: Add learning progress */}
                <p className="text-gray-500">No learning progress to show</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
