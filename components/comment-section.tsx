"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { MessageCircle, Reply } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
}

export function CommentSection({
  postId,
  comments,
  onAddComment,
}: CommentSectionProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    await onAddComment(newComment);
    setNewComment("");
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    await onAddComment(replyContent, parentId);
    setReplyContent("");
    setReplyingTo(null);
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="space-y-4">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.image || ""} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-sm">
                {comment.author.name}
              </span>
              <span className="text-gray-500 text-xs">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
          </div>
          <div className="mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
            >
              <Reply size={14} className="mr-1" />
              Reply
            </Button>
          </div>
          {replyingTo === comment.id && (
            <div className="mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 space-y-4">
          {comment.replies.map((reply) => renderComment(reply))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] text-sm"
          />
          <div className="flex justify-end mt-2">
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Comment
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => renderComment(comment))}
      </div>
    </div>
  );
}
