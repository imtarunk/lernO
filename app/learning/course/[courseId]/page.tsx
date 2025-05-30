"use client";
import path from "path";
import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaPauseCircle,
  FaLock,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useParams } from "next/navigation";
import { courses } from "@/courses/courses";

const articles = [
  {
    id: 1,
    title: "The Fundamentals of Typography in Illustration",
    author: "Simon Simonangkir",
    readTime: "10 min read",
    content:
      "Typography is more than just choosing fonts; it's about conveying a message and enhancing the visual appeal of your illustrations...",
    imageUrl:
      "https://images.unsplash.com/photo-1510936111841-65e21f40675f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
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
  const { courseId } = useParams();
  const course = courses.find((course) => course.id === courseId);
  const lessons = course?.lessons;
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  // convert youtube url to embed url
  function extractYouTubeVideoID(url: string) {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  // Apply or remove 'dark' class on the HTML element based on isDarkMode state
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
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="bg-[#f8f9fb] dark:bg-gray-900 min-h-screen p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-7xl mx-auto transition-colors duration-300">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-110"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <FaSun className="text-xl" />
        ) : (
          <FaMoon className="text-xl" />
        )}
      </button>

      {/* Main Content */}
      <div className="flex-1 lg:max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200">
            My Courses
          </span>{" "}
          &gt;{" "}
          <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200">
            {course?.title}
          </span>{" "}
          &gt;{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Course Overview
          </span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          {course?.title}
        </h1>

        {/* Video Player */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video mb-6">
          <iframe
            src={`https://www.youtube.com/embed/${extractYouTubeVideoID(
              course?.lessons[0].link ||
                "https://www.youtube.com/watch?v=Zheks4f_afI"
            )}`}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          ></iframe>
        </div>

        {/* Mentor Info */}
        <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm transition-colors duration-300">
          <img
            src={course?.image}
            alt="Mentor"
            className="w-14 h-14 rounded-full border-2 border-blue-400"
          />
          <div>
            <div className="font-bold text-lg text-gray-800 dark:text-white">
              Simon Simonangkir
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Lead Illustrator at Google • 15+ years experience
            </div>
          </div>
          <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm">
            Contact Mentor
          </button>
        </div>

        {/* About This Course */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            About This Course
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
            Unlock your creative potential with our **Beginner-Level Illustrator
            Course**! Are you ready to embark on a journey into the exciting
            world of digital art and design? Our Mastering Illustration course
            is meticulously crafted for beginners eager to master the essentials
            of Adobe Illustrator, the industry-standard vector graphics
            software.
            {!showFullAbout && (
              <>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {" "}
                  From crafting stunning graphics to bringing your artistic
                  visions to life...
                </span>
                <button
                  onClick={() => setShowFullAbout(true)}
                  className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-2 block hover:underline"
                >
                  Show more
                </button>
              </>
            )}
            {showFullAbout && (
              <>
                <span className="text-gray-700 dark:text-gray-300 text-base">
                  <br />
                  <br />
                  This comprehensive course covers everything from fundamental
                  tools and techniques to advanced illustration principles.
                  You'll learn to create captivating designs, manipulate shapes,
                  work with typography, and prepare your artwork for various
                  outputs. By the end of this course, you'll have a strong
                  portfolio and the confidence to tackle any illustration
                  project.
                </span>
                <button
                  onClick={() => setShowFullAbout(false)}
                  className="text-blue-600 dark:text-blue-400 text-sm font-semibold mt-2 block hover:underline"
                >
                  Show less
                </button>
              </>
            )}
          </p>
        </div>

        {/* This Course Suits For */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
            This Course Is Perfect For:
          </h2>
          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-base space-y-2">
            <li>
              **Aspiring Illustrators:** Anyone who wants to start their career
              & get paid for their illustration design skills.
            </li>
            <li>
              **Absolute Beginners:** This course is tailored for newbies &
              amateurs in the field of illustration with no prior experience.
            </li>
            <li>
              **Portfolio Builders:** For anyone that needs to add
              professional-grade 'Illustration' to their portfolio to attract
              clients.
            </li>
            <li>
              **Creative Enthusiasts:** Aimed at people new to the world of
              illustration design who want to express their creativity
              digitally.
            </li>
          </ul>
        </div>

        {/* --- */}
        <hr className="my-8 border-gray-200 dark:border-gray-700" />
        {/* --- */}

        {/* Supplementary Articles */}
        <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Supplementary Articles & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-700"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-lg leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {article.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>By {article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
                    Read Article
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6 sticky top-4 md:top-6 lg:top-8 h-fit max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-48px)] lg:max-h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar transition-colors duration-300">
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
          <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Great Job! 🎉 You're well on your way to becoming a certified{" "}
            {course?.title}. Your dedication to learning is impressive! Finish
            strong!
          </div>
        </div>

        {/* Course Content / Completion */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700 dark:text-white text-lg">
              Course Content
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {
                lessons?.filter((lesson) => lesson.status === "completed")
                  .length
              }
              /{lessons?.length} completed
            </span>
          </div>
          <ul className="space-y-3">
            {lessons?.map((lesson, idx) => (
              <li
                key={lesson.title}
                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    lesson.status === "current"
                      ? "bg-blue-50 border-2 border-blue-400 text-blue-800 shadow-md dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200"
                      : lesson.status === "completed"
                      ? "bg-green-50 border-2 border-green-400 text-green-800 opacity-90 dark:bg-green-900 dark:border-green-700 dark:text-green-200"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {lesson.status === "current" && (
                    <FaPauseCircle className="text-blue-500 dark:text-blue-400 text-xl" />
                  )}
                  {lesson.status === "completed" && (
                    <FaCheckCircle className="text-green-500 dark:text-green-400 text-xl" />
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
                {lesson.status === "current" && (
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
