"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { MessageCircle, Reply, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author?: {
    id: string;
    name: string;
    image?: string;
  };
  User?: {
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
        <Avatar className="h-8 w-8 ring-2 ring-gray-100 dark:ring-gray-800">
          <AvatarImage src={(comment.author || comment.User)?.image || ""} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {(comment.author || comment.User)?.name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {(comment.author || comment.User)?.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
          <div className="mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-full px-3"
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
                className="min-h-[60px] text-sm resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                  className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send size={14} className="mr-1" />
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
        <Avatar className="h-8 w-8 ring-2 ring-gray-100 dark:ring-gray-800">
          <AvatarImage src={session?.user?.image || ""} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {session?.user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] text-sm resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Send size={14} className="mr-1" />
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
