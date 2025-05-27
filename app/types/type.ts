export interface PostCardProps {
  post: {
    id: string;
    type: string;
    content: any;
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
      replies?: Array<{
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
      }>;
    }>;
  };
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
}

interface PostContent {
  text?: string;
  tags?: string[];
  link?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  points?: number;
  bidAmount?: number;
  requirements?: string[];
}

export interface Post {
  id: string;
  type: string;
  content: PostContent[];
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
}
