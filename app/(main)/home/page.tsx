"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/providers";
import { PostCard } from "@/components/post-card";
import { CreatePostModal } from "@/components/create-post-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PenTool, BookOpen, Zap, Target, Rocket, Plus } from "lucide-react";
import RightSidebarCard from "@/components/rightSidebarCard";
import { Post } from "@/app/types/type";
import { useToast } from "@/hooks/use-toast";
import { CreateTaskModal } from "@/components/create-task-modal";
import axios from "axios";
import { useStore } from "@/lib/store";
import Loader from "@/components/ui/loader";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { posts, setPosts, isLoading, setIsLoading } = useStore();
  const { createPostModalOpen, setCreatePostModalOpen } = useAppContext();
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const { toast } = useToast();
  const [showOnlyTasks, setShowOnlyTasks] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchPosts();
  }, [setPosts, setIsLoading]);

  const handleCreatePost = async (
    content: { text: string; tags: string[]; link?: string },
    image?: string
  ) => {
    try {
      const postContent = [
        {
          text: content.text,
          tags: content.tags,
          link: content.link,
        },
      ];

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: image ? "image" : "text",
          content: postContent,
          image,
        }),
      });
      console.log("response", response);

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your post has been created successfully.",
          variant: "default",
        });
        fetchPosts(); // Refresh posts
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      fetchPosts(); // Refresh posts after like/unlike
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    try {
      // Fetch the updated post data
      const response = await fetch(`/api/posts/${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch updated post");
      }
      const updatedPost = await response.json();

      // Update the posts array with the new post data
      setPosts((currentPosts: Post[]) =>
        currentPosts.map(
          (post: Post): Post => (post.id === postId ? updatedPost : post)
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log("Share post:", postId);
  };

  // Filter posts based on the switch
  const filteredPosts = posts.filter((post) => {
    if (showOnlyTasks) return post.type === "task";
    return true; // show all
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Create Post Button */}
            <Card className="mb-6">
              <CardContent className="p-4 flex flex-row">
                <Button
                  onClick={() => setCreatePostModalOpen(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-r-none"
                >
                  <Plus size={16} className="mr-2" />
                  Create post
                </Button>
                <Button
                  onClick={() => setCreateTaskModalOpen(true)}
                  className="w-full bg-purple-500 hover:bg-purple-600 rounded-l-none"
                >
                  <Rocket size={16} className="mr-2" />
                  Launch task
                </Button>
              </CardContent>
            </Card>

            {/* Feed Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold mb-2">Feed</h1>
                {/* Switch for filtering */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <label
                    htmlFor="custom-switch"
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 select-none"
                  >
                    {showOnlyTasks ? "Showing only Tasks" : "Showing All"}
                  </label>

                  <div className="relative flex items-center text-[12px] font-sans text-gray-500">
                    <input
                      id="custom-switch"
                      type="checkbox"
                      className="peer hidden"
                      checked={showOnlyTasks}
                      onChange={() => setShowOnlyTasks((prev) => !prev)}
                    />
                    <label
                      htmlFor="custom-switch"
                      className="flex items-center cursor-pointer select-none"
                    >
                      <span className="mr-1">Toggle:</span>
                      <span className="relative flex items-center">
                        <span className="w-[25px] h-[15px] rounded-full bg-[#05012c] peer-checked:bg-[#ffb500] transition-colors duration-150 ease-out"></span>
                        <span className="absolute left-[1px] top-[1px] w-[13px] h-[13px] bg-white rounded-[13px] shadow-[0_3px_1px_rgba(37,34,71,0.05),0_2px_2px_rgba(37,34,71,0.1),0_3px_3px_rgba(37,34,71,0.05)] transition-transform duration-150 ease-out peer-checked:translate-x-[10px]"></span>
                      </span>
                    </label>
                    <span className="ml-2 font-bold relative w-[25px] h-[15px] overflow-hidden">
                      <span
                        className={`absolute top-0 left-0 transition-all duration-150 ${
                          showOnlyTasks
                            ? "opacity-0 -translate-y-full"
                            : "opacity-100 translate-y-0"
                        }`}
                      >
                        Off
                      </span>
                      <span
                        className={`absolute top-0 left-0 transition-all duration-150 ${
                          showOnlyTasks
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-full"
                        }`}
                      >
                        On
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {filteredPosts.length === 0 && (
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
              {filteredPosts.map((post: any) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  isPostLiked={post.isLiked}
                  likes={post.likedUserIds.length}
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

          {/* Right Sidebar */}
          <div className="overflow-auto">
            <RightSidebarCard />
          </div>
        </div>
      </div>

      <CreatePostModal
        type="post"
        isOpen={createPostModalOpen}
        onClose={() => setCreatePostModalOpen(false)}
        onSubmit={handleCreatePost}
      />
      <CreateTaskModal
        open={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onTaskCreated={fetchPosts}
      />
    </div>
  );
}
