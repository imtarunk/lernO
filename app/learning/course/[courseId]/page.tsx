"use client";

import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaPauseCircle,
  FaLock,
  FaSun,
  FaMoon,
  FaTimes,
} from "react-icons/fa";
import { redirect, useParams } from "next/navigation";
import { courses } from "@/courses/courses";
import Main from "@/components/learning/main";
import { useSession } from "next-auth/react";

interface Lesson {
  id?: string;
  title: string;
  duration: string;
  status: "completed" | "current" | "locked";
  type: string;
  link: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  level: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  isFeatured: boolean;
  isFree: boolean;
  lessons: Lesson[];
}

const articles = [
  {
    id: "1",
    title: "The Fundamentals of Typography in Illustration",
    author: "Simon Simonangkir",
    readTime: "10 min read",
    content:
      "Typography is more than just choosing fonts; it's about conveying a message and enhancing the visual appeal of your illustrations...",
    imageUrl:
      "https://images.unsplash.com/photo-1510936111841-65e21f40675f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Basic Color Theory for Digital Artists",
    author: "Emma Stone",
    readTime: "8 min read",
    content:
      "Understanding color theory is crucial for creating harmonious and impactful illustrations. Learn about primary, secondary, and tertiary colors...",
    imageUrl:
      "https://images.unsplash.com/photo-1550974805-d072f8d388f8?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CoursePage() {
  const session = useSession();
  const params = useParams();
  const courseId = Array.isArray(params?.courseId)
    ? params.courseId[0]
    : params?.courseId;

  const course = courses.find((course) => course.id === courseId) as
    | Course
    | undefined;
  const lessons = course?.lessons || [];

  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [selectedLockedLesson, setSelectedLockedLesson] =
    useState<Lesson | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  if (!session.data?.user) {
    redirect("/login");
  }

  useEffect(() => {
    if (lessons.length > 0 && !currentLesson) {
      setCurrentLesson(lessons[0]);
    }
  }, [lessons, currentLesson]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.status === "locked") {
      setSelectedLockedLesson(lesson);
      setShowLockedModal(true);
    } else {
      setCurrentLesson(lesson);
    }
  };

  const handleUnlockLesson = () => {
    if (selectedLockedLesson) {
      const updatedLesson = {
        ...selectedLockedLesson,
        status: "current" as const,
      };
      setCurrentLesson(updatedLesson);
      setShowLockedModal(false);
      setSelectedLockedLesson(null);
    }
  };

  return (
    <div className="bg-[#f8f9fb] dark:bg-gray-900 min-h-screen p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* Locked Lesson Modal */}
      {showLockedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Unlock This Lesson
              </h3>
              <button
                onClick={() => setShowLockedModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This lesson is currently locked. Would you like to unlock it to
              continue your learning journey?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLockedModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlockLesson}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Unlock Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
      >
        {isDarkMode ? <FaSun /> : <FaMoon />}
      </button>

      {/* Main Content */}
      <div className="flex-1 lg:max-w-4xl">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            My Courses
          </span>{" "}
          &gt;{" "}
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
            {course?.title}
          </span>{" "}
          &gt;{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Course Overview
          </span>
        </nav>
        <Main
          currentLesson={currentLesson}
          course={course || null}
          articles={articles}
          onLessonClick={handleLessonClick}
        />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6 sticky top-4 h-fit max-h-[calc(100vh-32px)] overflow-y-auto custom-scrollbar">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700 dark:text-white text-lg">
              Your Study Progress
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-400 font-bold">
              20%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: "20%" }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Great Job! 🎉 You're well on your way to becoming a certified{" "}
            {course?.title}. Finish strong!
          </p>
        </div>

        {/* Lessons */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700 dark:text-white text-lg">
              Course Content
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {lessons.filter((lesson) => lesson.status === "completed").length}
              /{lessons.length} completed
            </span>
          </div>
          <ul className="space-y-3">
            {lessons.map((lesson, idx) => (
              <li
                key={lesson.id || idx}
                onClick={() => handleLessonClick(lesson)}
                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    currentLesson?.title === lesson.title
                      ? "bg-blue-50 border-2 border-blue-400 text-blue-800 shadow-md dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200"
                      : lesson.status === "completed"
                      ? "bg-green-50 border-2 border-green-400 text-green-800 opacity-90 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                      : lesson.status === "locked"
                      ? "bg-gray-100 border-2 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {currentLesson?.title === lesson.title && (
                    <FaPauseCircle className="text-blue-500 dark:text-blue-400 text-xl" />
                  )}
                  {lesson.status === "completed" && (
                    <FaCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
                  )}
                  {lesson.status === "locked" && (
                    <FaLock className="text-gray-400 dark:text-gray-500 text-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-semibold text-base ${
                      lesson.status === "locked"
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-800 dark:text-white"
                    }`}
                  >
                    {idx + 1}. {lesson.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {lesson.duration} &bull;{" "}
                    {lesson.type === "video" ? "Video Lesson" : "Article"}
                  </div>
                </div>
                {currentLesson?.title === lesson.title && (
                  <span className="ml-auto text-blue-500 dark:text-blue-400 text-lg">
                    ▶
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
