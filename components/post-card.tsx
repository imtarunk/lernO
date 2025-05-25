"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { CommentSection } from "./comment-section";
import { PostCardProps } from "@/app/types/type";

export function PostCard({ post, onLike, onComment, onShare }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
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

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like/unlike post");
      }

      // Update local state
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // Notify parent component
      onLike(post.id);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      // Revert local state if the API call fails
      setIsLiked(isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
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
        author: newComment.User,
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

      post._count.comments += 1;

      onComment(post.id);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              onClick={() => router.push(`/profile/${post.author.id}`)}
              className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200"
            >
              <AvatarImage src={post.author.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {post.author.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {post.author.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <p className="mb-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
          {post.content}
        </p>

        {post.image && (
          <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 rounded-full px-4 ${
                isLiked
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span className="font-medium">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full px-4"
            >
              <MessageCircle size={16} />
              <span className="font-medium">{post._count.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full px-4"
            >
              <Share size={16} />
              <span className="font-medium">Share</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <CommentSection
              postId={post.id}
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
