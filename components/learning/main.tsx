"use client";

import { useState, useEffect } from "react";

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

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  readTime: string;
}

interface MainProps {
  currentLesson: Lesson | null;
  course: Course | null;
  articles: Article[];
  onLessonClick: (lesson: Lesson) => void;
}

const Main = ({
  currentLesson,
  course,
  articles,
  onLessonClick,
}: MainProps) => {
  const [showFullAbout, setShowFullAbout] = useState(false);

  useEffect(() => {
    console.log("Main component received lesson:", currentLesson);
  }, [currentLesson]);

  function extractYouTubeVideoID(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  }

  return (
    <div>
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
        {course?.title || "Untitled Course"}
      </h1>

      {/* Video Player */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video mb-6">
        {currentLesson?.link ? (
          <iframe
            key={currentLesson.title}
            src={`https://www.youtube.com/embed/${extractYouTubeVideoID(
              currentLesson.link
            )}`}
            title={currentLesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              Select a lesson to start learning
            </p>
          </div>
        )}
      </div>

      {/* Mentor Info */}
      <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
        <img
          src={course?.image || "/default-avatar.png"}
          alt="Mentor"
          className="w-14 h-14 rounded-full border-2 border-blue-400 object-cover"
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
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
          About This Course
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
          Unlock your creative potential with our{" "}
          <strong>Beginner-Level Illustrator Course</strong>! Are you ready to
          embark on a journey into the exciting world of digital art and design?
          Our Mastering Illustration course is meticulously crafted for
          beginners eager to master Adobe Illustrator essentials.
          {!showFullAbout ? (
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
          ) : (
            <>
              <span className="text-gray-700 dark:text-gray-300 text-base">
                <br />
                <br />
                This comprehensive course covers everything from fundamental
                tools and techniques to advanced illustration principles. You'll
                learn to create captivating designs, manipulate shapes, work
                with typography, and prepare your artwork for various outputs.
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

      {/* This Course Is Perfect For */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
          This Course Is Perfect For:
        </h2>
        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 text-base space-y-2">
          <li>
            <strong>Aspiring Illustrators:</strong> Start your career & get paid
            for your skills.
          </li>
          <li>
            <strong>Absolute Beginners:</strong> Tailored for newbies with no
            prior experience.
          </li>
          <li>
            <strong>Portfolio Builders:</strong> Add professional-grade
            Illustration work to your portfolio.
          </li>
          <li>
            <strong>Creative Enthusiasts:</strong> Express creativity digitally
            in the world of design.
          </li>
        </ul>
      </div>

      <hr className="my-8 border-gray-200 dark:border-gray-700" />

      {/* Supplementary Articles */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Supplementary Articles & Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles?.map((article) => (
            <div
              key={article.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-lg bg-white dark:bg-gray-700"
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
  );
};

export default Main;
