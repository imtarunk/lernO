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
  ZapIcon,
  Zap,
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

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${post.id}/like`);

      if (response.status !== 200) {
        throw new Error("Failed to like / unlike post");
      }

      const data = response.data;

      setIsLiked(data.isLiked);
      console.log("data.likeUsers.length", data.likeUsers.length);
      setLikeCount(data.likeUsers.length);
      console.log("likeCount", likeCount);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
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
    <Card
      className={`mb-4 overflow-hidden hover:shadow-md transition-shadow duration-200${
        post.type === "task" ? " border-2 border-red-500" : ""
      }`}
    >
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
          <PostCardEditButton />
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
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
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
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-1">
                {post.content[0].title || (
                  <span className="italic text-gray-400">
                    No title provided
                  </span>
                )}
              </h3>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words mb-2">
                {post.content[0].description || (
                  <span className="italic text-gray-400">
                    No description provided
                  </span>
                )}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Points:</span>{" "}
                  {post.content[0].points ?? (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Bid Amount:</span> $
                  {post.content[0].bidAmount ?? (
                    <span className="italic text-gray-400">N/A</span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                Expires:{" "}
                {post.content[0].expiry ? (
                  new Date(post.content[0].expiry).toLocaleString()
                ) : (
                  <span className="italic text-gray-400">N/A</span>
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-semibold mb-1">Requirements:</h4>
                {post.content[0].requirements &&
                post.content[0].requirements.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {post.content[0].requirements.map(
                      (req: string, index: number) => (
                        <li key={index}>{req}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <span className="italic text-gray-400">
                    No requirements provided
                  </span>
                )}
              </div>
            </div>
          )}
        {/* Render image if present */}
        {post.image && (
          <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post image"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className=" items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 w-full flex flex-row">
          <div className="flex items-center space-x-4 justify-between w-full flex-row">
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center space-x-2 rounded-full px-4 transition ${
                  isLiked
                    ? "text-yellow-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                    : "text-gray-500 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
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

            {post.type === "task" && (
              <BidButton satAmount={post.content[0].bidAmount} />
            )}
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
