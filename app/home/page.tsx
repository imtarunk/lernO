"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { PostCard } from "@/components/post-card";
import { CreatePostModal } from "@/components/create-post-modal";
import { LearningRewards } from "@/components/learning-rewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool, BookOpen, Zap, Target } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const { createPostModalOpen, setCreatePostModalOpen } = useAppContext();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch posts
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleCreatePost = async (content: string, image?: string) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image }),
      });

      if (response.ok) {
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log("Share post:", postId);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Create Post Button */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <Button
                  onClick={() => setCreatePostModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <PenTool size={16} className="mr-2" />
                  Post Update
                </Button>
              </CardContent>
            </Card>

            {/* Feed Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Feed</h1>
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Target size={48} className="mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">
                    No more updates for now
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Share your learning journey and inspire others!
                  </p>
                  <Button
                    onClick={() => setCreatePostModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <PenTool size={16} className="mr-2" />
                    Post Now
                  </Button>
                </div>
              )}
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <BookOpen size={16} className="mr-2" />
                Start Learning Module
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700">
                <Zap size={16} className="mr-2" />
                Quick Challenge
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <LearningRewards />

            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                  <Target size={16} />
                  <span className="font-medium">
                    Keep your learning streak going!
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={createPostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
