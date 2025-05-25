"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { CommentSection } from "./comment-section";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    image?: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      image?: string;
    };
    _count: {
      likes: number;
      comments: number;
    };
    isLiked?: boolean;
    comments?: Array<{
      id: string;
      content: string;
      createdAt: Date;
      author: {
        id: string;
        name: string;
        image?: string;
      };
      replies?: Array<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
          id: string;
          name: string;
          image?: string;
        };
      }>;
    }>;
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

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
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar onClick={() => router.push(`/profile/${post.author.id}`)}>
              <AvatarImage src={post.author.image || ""} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-4">{post.content}</p>

        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post image"
            className="w-full rounded-lg mb-4 max-h-96 object-cover"
          />
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              <span>{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500"
            >
              <MessageCircle size={16} />
              <span>{post._count.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 text-gray-500"
            >
              <Share size={16} />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t">
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
