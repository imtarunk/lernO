export interface PostCardProps {
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

export interface Post {
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
}
