"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User, useUserContext } from "@/components/user-context";
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

const associatedPeople = [
  {
    id: 1,
    name: "Ahamd Ekstrom Bothman",
    role: "Future Program Designer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    company: "Google",
  },
  {
    id: 2,
    name: "Sheldon Langosh",
    role: "Dynamic Directives Architect",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    company: "Facebook",
  },
  {
    id: 3,
    name: "Jeremy Crist",
    role: "Lead Configuration Architect",
    avatar:
      "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face",
    company: "GitHub",
  },
  {
    id: 4,
    name: "Wilbur Kohler",
    role: "Future Applications Consultant",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
    company: "Microsoft",
  },
];

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: session } = useSession();
  const { profile, setProfile } = useUserContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/user/${userId}`);
      if (res.ok) {
        const data: User = await res.json();
        setProfile(data);
      }
    };
    const fetchPosts = async () => {
      const res = await fetch(`/api/user/${userId}/posts`);
      if (res.ok) {
        const data: Post[] = await res.json();
        setPosts(data);
      }
    };
    const checkFollowStatus = async () => {
      if (session?.user?.id && userId) {
        const res = await fetch(`/api/user/${userId}/follow-status`);
        if (res.ok) {
          const { isFollowing } = await res.json();
          setIsFollowing(isFollowing);
        }
      }
    };
    fetchProfile();
    fetchPosts();
    checkFollowStatus();
  }, [userId, session?.user?.id]);

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
      // Create a chat room with the user
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  const isOwnProfile = session?.user?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Header with gradient background */}
              <div className="h-48 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-300 relative">
                <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="px-8 pb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 relative z-10">
                  <Avatar
                    className="h-32 w-32 border-4 border-white shadow-xl cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => (isOwnProfile ? setEditOpen(true) : null)}
                  >
                    <AvatarImage
                      src={
                        profile.image ||
                        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face"
                      }
                      alt={profile.name || "User"}
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {profile.name ? profile.name[0] : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                          {profile.name}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>Los Angeles, United States</span>
                        </div>
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
                        <span>
                          @{profile.email?.split("@")[0] || "username"}
                        </span>
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
                          {profile.points ?? 0}
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
                          {profile.createdAt
                            ? new Date(profile.createdAt).toLocaleDateString(
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  See all
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium cursor-pointer transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
                  {posts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={profile.image || undefined}
                            alt={profile.name || "User"}
                          />
                          <AvatarFallback>
                            {profile.name ? profile.name[0] : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">
                              {profile.name}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-800 leading-relaxed mb-3">
                            {post.content?.[0]?.text}
                          </p>
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post content"
                              className="rounded-lg max-h-60 w-full object-cover"
                            />
                          )}
                          <div className="flex items-center gap-4 mt-4 text-gray-500">
                            <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">Comment</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm">Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {posts.length > 3 && (
                    <div className="text-center pt-4">
                      <Button variant="outline">View all posts</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* People Associated */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">
                  People Associated
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  See all
                </Button>
              </div>
              <div className="space-y-4">
                {associatedPeople.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.avatar} alt={person.name} />
                        <AvatarFallback>{person.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {person.company === "Google"
                              ? "G"
                              : person.company === "Facebook"
                              ? "F"
                              : person.company === "GitHub"
                              ? "G"
                              : "M"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {person.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {person.role}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Employment History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-6">
                Employment History
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Lead Product Designer
                    </div>
                    <div className="text-sm text-gray-600">Google</div>
                    <div className="text-xs text-gray-500 mt-1">
                      2021 - Present
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Senior UX Designer
                    </div>
                    <div className="text-sm text-gray-600">Facebook</div>
                    <div className="text-xs text-gray-500 mt-1">
                      2019 - 2021
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
