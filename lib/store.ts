import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type Post = {
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
  comments?: any[];
  likes?: string[];
  likedUserIds?: string[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  isCompleted: boolean;
  isInProgress: boolean;
  isLiked: number;
  User: User;
};

type CourseProgress = {
  id: string;
  courseId: string;
  progress: number;
};

interface AppState {
  // Users
  users: User[];
  currentUser: User | null;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;

  // Posts
  posts: Post[];
  setPosts: (posts: Post[] | ((prev: Post[]) => Post[])) => void;
  addPost: (post: Post) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  deletePost: (postId: string) => void;

  // Courses
  courses: Course[];
  courseProgress: CourseProgress[];
  setCourses: (courses: Course[]) => void;
  setCourseProgress: (progress: CourseProgress[]) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;

  // Search
  searchResults: {
    users: User[];
    posts: Post[];
    courses: Course[];
  };
  setSearchResults: (results: {
    users: User[];
    posts: Post[];
    courses: Course[];
  }) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Users
      users: [],
      currentUser: null,
      setUsers: (users) => set({ users }),
      setCurrentUser: (user) => set({ currentUser: user }),

      // Posts
      posts: [],
      setPosts: (posts) =>
        set((state) => ({
          posts: typeof posts === "function" ? posts(state.posts) : posts,
        })),
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      updatePost: (postId, updates) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updates } : post
          ),
        })),
      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),

      // Courses
      courses: [],
      courseProgress: [],
      setCourses: (courses) => set({ courses }),
      setCourseProgress: (progress) => set({ courseProgress: progress }),
      updateCourseProgress: (courseId, progress) =>
        set((state) => ({
          courseProgress: state.courseProgress.map((cp) =>
            cp.courseId === courseId ? { ...cp, progress } : cp
          ),
        })),

      // Search
      searchResults: { users: [], posts: [], courses: [] },
      setSearchResults: (results) => set({ searchResults: results }),

      // UI State
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        courseProgress: state.courseProgress,
      }),
    }
  )
);
