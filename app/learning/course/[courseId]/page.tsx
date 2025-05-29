"use client";

import React, { useState } from "react";
import {
  FaCheckCircle,
  FaPauseCircle,
  FaPlayCircle,
  FaLock,
} from "react-icons/fa";

const lessons = [
  {
    title: "Introduction",
    duration: "20 min",
    status: "completed",
    type: "video",
  },
  {
    title: "Mastering Tools",
    duration: "1 hour 20 min",
    status: "current",
    type: "video",
  },
  {
    title: "Mastering Adobe Illustrator",
    duration: "2 hour 10 min",
    status: "locked",
    type: "video",
  },
  {
    title: "Create Simple Shape",
    duration: "40 min",
    status: "locked",
    type: "video",
  },
  {
    title: "Typography Basics",
    duration: "40 min",
    status: "locked",
    type: "article",
  },
  {
    title: "Mastering Pen Tool",
    duration: "1 hour 40 min",
    status: "locked",
    type: "video",
  },
  {
    title: "Understanding Color Theory",
    duration: "15 min read",
    status: "locked",
    type: "article",
  },
  {
    title: "Mastering Pro Create",
    duration: "2 hour",
    status: "locked",
    type: "video",
  },
];

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
  const [showFullAbout, setShowFullAbout] = useState(false);

  return (
    <div className="bg-[#f8f9fb] min-h-screen p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8 max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="flex-1 lg:max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-3">
          <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">
            My Courses
          </span>{" "}
          &gt;{" "}
          <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">
            Mastering Illustration
          </span>{" "}
          &gt;{" "}
          <span className="font-semibold text-gray-700">Course Overview</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
          Mastering Illustration: From Basics to Pro
        </h1>

        {/* Video Player */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video mb-6">
          <video
            controls
            poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover"
          >
            {/* Replace with your actual video source */}
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* You can add custom controls overlay if needed, but native controls are often sufficient */}
        </div>

        {/* Mentor Info */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Mentor"
            className="w-14 h-14 rounded-full border-2 border-blue-400"
          />
          <div>
            <div className="font-bold text-lg text-gray-800">
              Simon Simonangkir
            </div>
            <div className="text-sm text-gray-600">
              Lead Illustrator at Google • 15+ years experience
            </div>
          </div>
          <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm">
            Contact Mentor
          </button>
        </div>

        {/* About This Course */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            About This Course
          </h2>
          <p className="text-gray-700 leading-relaxed text-base">
            Unlock your creative potential with our **Beginner-Level Illustrator
            Course**! Are you ready to embark on a journey into the exciting
            world of digital art and design? Our Mastering Illustration course
            is meticulously crafted for beginners eager to master the essentials
            of Adobe Illustrator, the industry-standard vector graphics
            software.
            {!showFullAbout && (
              <>
                <span className="text-gray-600 text-sm">
                  {" "}
                  From crafting stunning graphics to bringing your artistic
                  visions to life...
                </span>
                <button
                  onClick={() => setShowFullAbout(true)}
                  className="text-blue-600 text-sm font-semibold mt-2 block hover:underline"
                >
                  Show more
                </button>
              </>
            )}
            {showFullAbout && (
              <>
                <span className="text-gray-700 text-base">
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
                  className="text-blue-600 text-sm font-semibold mt-2 block hover:underline"
                >
                  Show less
                </button>
              </>
            )}
          </p>
        </div>

        {/* This Course Suits For */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            This Course Is Perfect For:
          </h2>
          <ul className="list-disc pl-6 text-gray-700 text-base space-y-2">
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
        <hr className="my-8 border-gray-200" />
        {/* --- */}

        {/* Supplementary Articles */}
        <div className="mb-6 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Supplementary Articles & Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {article.content}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
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
      <aside className="w-full md:w-80 lg:w-96 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6 sticky top-4 md:top-6 lg:top-8 h-fit max-h-[calc(100vh-32px)] md:max-h-[calc(100vh-48px)] lg:max-h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700 text-lg">
              Your Study Progress
            </span>
            <span className="text-sm text-blue-600 font-bold">20%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: "20%" }}
            ></div>{" "}
            {/* Dynamic width for progress */}
          </div>
          <div className="text-sm text-gray-500 leading-relaxed">
            Great Job! 🎉 You're well on your way to becoming a certified
            Mastering Illustrator. Your dedication to learning is impressive!
            Finish strong!
          </div>
        </div>

        {/* Course Content / Completion */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700 text-lg">
              Course Content
            </span>
            <span className="text-sm text-gray-500">1/8 completed</span>
          </div>
          <ul className="space-y-3">
            {lessons.map((lesson, idx) => (
              <li
                key={lesson.title}
                className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200
                  ${
                    lesson.status === "current"
                      ? "bg-blue-50 border-2 border-blue-400 text-blue-800 shadow-md"
                      : lesson.status === "completed"
                      ? "bg-green-50 border-2 border-green-400 text-green-800 opacity-90"
                      : "bg-gray-100 border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {lesson.status === "completed" ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : lesson.status === "current" ? (
                    <FaPauseCircle className="text-blue-500 text-xl" />
                  ) : (
                    <FaLock className="text-gray-400 text-xl" />
                  )}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-semibold text-base ${
                      lesson.status === "locked" ? "text-gray-500" : ""
                    }`}
                  >
                    {idx + 1}. {lesson.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lesson.duration} &bull;{" "}
                    {lesson.type === "video" ? "Video Lesson" : "Article"}
                  </div>
                </div>
                {lesson.status === "current" && (
                  <span className="ml-auto text-blue-500 text-lg">▶</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
