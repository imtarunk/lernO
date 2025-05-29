import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";

interface PostCardEditButtonProps {
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  isPostLiked: boolean;
  likes: number;
  onLike: (postId: string, isLiked: boolean) => Promise<void>;
  onComment: (content: string, parentId?: string) => Promise<void>;
  onShare: () => void;
}

const PostCardEditButton = ({
  postId,
  postAuthorId,
  currentUserId,
  isPostLiked,
  likes,
  onLike,
  onComment,
  onShare,
}: PostCardEditButtonProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostCardEditButton;
