"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserContext } from "@/components/user-context";
import { Post } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProfileEditModal from "@/components/profile-edit-modal";
import {
  MapPin,
  Calendar,
  Mail,
  Share2,
  MessageCircle,
  MoreHorizontal,
  Briefcase,
  Clock,
  Award,
  Users,
  Eye,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { PostCard } from "@/components/post-card";
import { PostCardProps } from "@/app/types/type";
import FollowingCard from "@/components/followingCard";
import { CoverImageUpload } from "@/components/cover-image-upload";
import { SkillsDrawer } from "@/components/skills-drawer";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import Loader from "@/components/ui/loader";

// Mock data for skills and associated people
const skills = [
  "Product Design",
  "UX Design",
  "Google Analytics",
  "SEO Content",
  "Customer Service",
  "UI Design",
  "Design Strategy",
  "Web Development",
  "Integrated Design",
  "Front End",
];

interface PostContent {
  text?: string;
  tags?: string[];
  link?: string;
}

interface ProfileUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  coverImage: string | null;
  points: number;
  skills: string[];
  isOnline: boolean;
  lastSeen: Date | null;
  createdAt?: Date;
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: session } = useSession();
  const { setProfile } = useUserContext();
  const [posts, setPosts] = useState<PostCardProps["post"][]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch(`/api/user/${userId}/posts`);
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.email) {
          setProfile({
            ...data,
            email: data.email,
          });
        }
      }
    };
    fetchProfile();
    fetchPosts();
    setIsLoading(false);
  }, [userId, setProfile]);

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const handleMessage = async () => {
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantIds: [userId],
          isGroup: false,
        }),
      });

      if (response.ok) {
        const chatRoom = await response.json();
        router.push(`/chat?room=${chatRoom.id}`);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  const handleCoverImageUpdate = (imageUrl: string) => {
    if (user) {
      setUser({ ...user, coverImage: imageUrl });
    }
  };

  const handleSkillsUpdate = async (skills: string[]) => {
    try {
      const response = await fetch(`/api/user/${userId}/skills`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        throw new Error("Failed to update skills");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLike = (postId: string) => {
    fetchPosts();
  };

  const handleComment = (postId: string) => {
    fetchPosts();
  };

  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    toast({
      title: "Success!",
      description: "Post link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header with gradient background */}
              {isOwnProfile ? (
                <CoverImageUpload
                  userId={userId}
                  currentCoverImage={user?.coverImage}
                  onCoverImageUpdate={handleCoverImageUpdate}
                />
              ) : (
                <div
                  className="h-48 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300 relative"
                  style={{
                    backgroundImage: user?.coverImage
                      ? `url(${user.coverImage})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}

              {/* Profile Info */}
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
                  <Avatar
                    className="h-32 w-32 border-4 border-white shadow-xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => (isOwnProfile ? setEditOpen(true) : null)}
                  >
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user?.name ? user.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                          {user?.name}
                        </h1>
                      </div>
                      <div className="flex gap-3 sm:ml-auto">
                        {!isOwnProfile && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={handleMessage}
                            >
                              <MessageCircle className="w-4 h-4" />
                              Message
                            </Button>
                            <Button
                              variant={isFollowing ? "outline" : "default"}
                              size="sm"
                              className={`gap-2 ${
                                isFollowing
                                  ? "text-red-600 hover:text-red-700"
                                  : "bg-blue-600 hover:bg-blue-700"
                              }`}
                              onClick={handleFollow}
                            >
                              {isFollowing ? (
                                <>
                                  <UserMinus className="w-4 h-4" />
                                  Unfollow
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4" />
                                  Follow
                                </>
                              )}
                            </Button>
                          </>
                        )}
                        {isOwnProfile && (
                          <Button
                            variant="outline"
                            onClick={() => setEditOpen(true)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Edit Profile
                          </Button>
                        )}
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                          <Share2 className="w-4 h-4" />
                          Share profile
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>@{user?.email?.split("@")[0] || "username"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        <span>Lead product designer at Google</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Full-time</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">
                          {user?.points ?? 0}
                        </span>
                        <span className="text-gray-600">Points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">{posts.length}</span>
                        <span className="text-gray-600">Posts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-gray-600">
                          Joined{" "}
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "en-US",
                                { month: "long", year: "numeric" }
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                {isOwnProfile && (
                  <SkillsDrawer
                    userId={userId}
                    currentSkills={user?.skills || []}
                    onSkillsUpdate={handleSkillsUpdate}
                  />
                )}
              </div>
              {user?.skills && user.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium cursor-pointer transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  {isOwnProfile ? (
                    <div className="space-y-4">
                      <p className="text-gray-500">No skills added yet</p>
                      <SkillsDrawer
                        userId={userId}
                        currentSkills={user?.skills || []}
                        onSkillsUpdate={handleSkillsUpdate}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">No skills added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Posts
              </h2>
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No posts yet</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Share your first post to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onComment={handleComment}
                      onShare={handleShare}
                      isPostLiked={post.isLiked || false}
                      likes={post._count.likes}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <FollowingCard userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
