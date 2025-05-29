"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Zap, // Use Zap for consistency with the component
  Bookmark, // For saving posts/tasks
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { CommentSection } from "./comment-section";
import { PostCardProps } from "@/app/types/type";
import { LinkPreview } from "@/components/link-preview";
import { useSession } from "next-auth/react";
import axios from "axios";
import BidButton from "./ui/bidButton";
import PostCardEditButton from "./postCardEditButton";
import clsx from "clsx"; // For cleaner conditional classes
import { motion } from "framer-motion"; // For animations

export function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  isPostLiked,
  likes,
}: PostCardProps) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [isLiked, setIsLiked] = useState(isPostLiked);
  const [likeCount, setLikeCount] = useState(likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(
    (post.comments || []).map((comment) => ({
      ...comment,
      author: comment.author,
      replies: (comment.replies || []).map((reply) => ({
        ...reply,
        author: reply.author,
      })),
    }))
  );
  const router = useRouter();

  // Optimistic UI update for likes
  const handleLike = async () => {
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;

    // Optimistically update UI
    setIsLiked(!previousIsLiked);
    setLikeCount(
      previousIsLiked ? previousLikeCount - 1 : previousLikeCount + 1
    );

    try {
      const response = await axios.post(`/api/posts/${post.id}/like`);

      if (response.status !== 200) {
        throw new Error("Failed to like / unlike post");
      }

      const data = response.data;
      // Re-sync with actual data if needed, or if optimistic update was slightly off
      // setIsLiked(data.isLiked);
      // setLikeCount(data.likeUsers.length);

      // Call the parent handler if it exists
      onLike?.(post.id, data.isLiked);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      // Revert UI on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, parentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();

      const transformedComment = {
        ...newComment,
        author: newComment.User, // Assuming backend sends User object
      };

      if (parentId) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), transformedComment],
                }
              : comment
          )
        );
      } else {
        setComments((prevComments) => [transformedComment, ...prevComments]);
      }

      // Notify parent about comment addition (don't mutate post._count.comments directly)
      onComment?.(post.id); // Or pass the new comment if needed
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Card
      className={clsx(
        "mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border" // Base card styles
      )}
    >
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Avatar
                onClick={() => router.push(`/profile/${post.author.id}`)}
                className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
              >
                <AvatarImage
                  src={post.author.image || "/placeholder-avatar.jpg"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {post.author.name ? post.author.name[0].toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {post.author.name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {/* Pass necessary props to PostCardEditButton */}
          <PostCardEditButton
            postId={post.id}
            postAuthorId={post.author.id}
            currentUserId={userId}
            isPostLiked={isPostLiked}
            likes={likes}
            onLike={handleLike}
            onComment={handleAddComment}
            onShare={() => onShare?.(post.id)}
          />
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {/* Render content based on post type */}
        {(post.type === "post" || post.type === "text") &&
          Array.isArray(post.content) &&
          post.content[0] && (
            <div className="mb-4">
              {post.content[0].text && (
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words mb-2">
                  {post.content[0].text}
                </p>
              )}
              {post.content[0].tags && post.content[0].tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.content[0].tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.content[0].link && (
                <LinkPreview url={post.content[0].link} />
              )}
            </div>
          )}

        {post.type === "task" &&
          Array.isArray(post.content) &&
          post.content[0] && (
            <div className="mb-6">
              {/* Task Header Card */}
              <div className="relative bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Task Type Badge */}
                <div className="absolute -top-3 left-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg">
                    <Zap size={16} className="fill-current" />{" "}
                    {/* Changed icon to Zap */}
                    Learning Task
                  </div>
                </div>

                {/* Task Title */}
                <div className="mt-4 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {post.content[0].title || (
                      <span className="italic text-gray-400 font-normal">
                        No title provided
                      </span>
                    )}
                  </h3>
                </div>

                {/* Task Description */}
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words">
                    {post.content[0].description || (
                      <span className="italic text-gray-400">
                        No description provided
                      </span>
                    )}
                  </p>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Points Card */}
                  <div className="flex-1 min-w-[140px] bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white fill-current" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Reward Points
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {post.content[0].points ?? (
                        <span className="text-lg italic text-gray-400 font-normal">
                          N/A
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Bid Amount Card */}
                  <div className="flex-1 min-w-[140px] bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Bid Amount
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {post.content[0].bidAmount ? (
                        <span className="text-green-600 dark:text-green-400">
                          ${post.content[0].bidAmount}
                        </span>
                      ) : (
                        <span className="text-lg italic text-gray-400 font-normal">
                          N/A
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Expiry Card */}
                  <div className="flex-1 min-w-[200px] bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Deadline
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {post.content[0].expiry ? (
                        <>
                          <span className="block">
                            {new Date(
                              post.content[0].expiry
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(
                              post.content[0].expiry
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="italic text-gray-400">N/A</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="bg-white dark:bg-gray-700 rounded-xl p-5 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-md flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-current" />{" "}
                      {/* Changed icon to Zap */}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      Requirements
                    </h4>
                  </div>

                  {post.content[0].requirements &&
                  post.content[0].requirements.length > 0 ? (
                    <div className="space-y-2">
                      {post.content[0].requirements.map(
                        (req: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg"
                          >
                            <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <span className="text-white text-xs font-bold">
                                {index + 1}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                              {req}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      <span className="italic text-gray-400">
                        No requirements provided
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    Accept Task
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Bookmark size={20} /> {/* Changed to Bookmark icon */}
                    Save
                  </motion.button>
                </div>
              </div>
            </div>
          )}

        {/* Render image if present */}
        {post.image && (
          <motion.div
            className="relative aspect-video mb-4 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </motion.div>
        )}

        <div className="items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 w-full flex flex-row">
          <div className="flex items-center space-x-4 justify-between w-full flex-row">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={clsx(
                  "flex items-center space-x-2 rounded-full px-4 transition",
                  {
                    "text-yellow-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20":
                      isLiked,
                    "text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800":
                      !isLiked,
                  }
                )}
              >
                <Zap
                  size={16}
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
                <span className="font-medium">{likeCount || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full px-4"
              >
                <MessageCircle size={16} />
                <span className="font-medium">
                  {post._count.comments > 0 ? post._count.comments : "Comment"}
                </span>{" "}
                {/* Display "Comment" if no comments */}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(post.id)} // Use optional chaining for onShare
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full px-4"
              >
                <Share size={16} />
                <span className="font-medium">Share</span>
              </Button>
            </div>

            {post.type === "task" &&
              post.content[0]?.bidAmount !== undefined && (
                <BidButton satAmount={post.content[0].bidAmount} />
              )}
          </div>
        </div>

        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
          >
            <CommentSection
              postId={post.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
