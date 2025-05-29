import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStore } from "@/lib/store";

// Mock data types
type CourseWithUser = {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  isCompleted: boolean;
  isInProgress: boolean;
  isLiked: number;
  User: { name: string };
};

type CourseProgress = {
  id: string;
  courseId: string;
  progress: number;
};

function ProgressRing({ percent }: { percent: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width="44" height="44" className="block">
      <circle
        cx="22"
        cy="22"
        r={r}
        stroke="#e5e7eb"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        stroke="#111"
        strokeWidth="4"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="13"
        fontWeight="bold"
        fill="#111"
      >
        {percent}%
      </text>
    </svg>
  );
}

export default function LearningDashboard() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get state and actions from store
  const {
    courses,
    courseProgress,
    setCourses,
    setCourseProgress,
    searchResults,
    setSearchResults,
    isLoading,
    setIsLoading,
  } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const userData = await axios.get(`/api/user/${user.id}`);
        setCourses(userData.data.Course);
        setCourseProgress(userData.data.CourseProgress);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    const fetchAllCourses = async () => {
      try {
        const allCourses = await axios.get(`/api/courses`);
        setCourses(allCourses.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchAllCourses();
  }, [user, setCourses, setCourseProgress, setIsLoading]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const res = await axios.get(
          `/api/courses?search=${encodeURIComponent(query)}`
        );
        setSearchResults(res.data || { users: [], posts: [], courses: [] });
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults({ users: [], posts: [], courses: [] });
      }
    } else {
      setSearchResults({ users: [], posts: [], courses: [] });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fafbfc] flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8 flex flex-col gap-8">
        {/* Top bar */}
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Input
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-full bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer"
                onFocus={() => setSearchOpen(true)}
                readOnly
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {user?.name?.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Greeting + Stats */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
          {/* Greeting Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex items-center min-h-[120px] relative overflow-hidden flex-1 lg:w-2/3">
            <div className="flex-1 z-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Hello {user?.name}!
              </h1>
              <p className="text-gray-600 text-lg">
                It&apos;s good to see you again.
              </p>
            </div>
            <img
              src="/boy.png"
              alt="Waving character"
              // Adjusted image positioning and sizing to replicate the desired look
              className="absolute right-5 bottom-0 h-full object-cover"
              style={{ height: "115%", width: "auto", maxHeight: "none" }}
            />
          </div>

          {/* Stats Cards */}
          <div className="flex-1 flex flex-col sm:flex-row lg:flex-col gap-6">
            <div className="bg-white rounded-2xl shadow flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="text-3xl font-extrabold text-black">
                {courses.filter((course) => course.isCompleted).length > 0 ? (
                  courses.filter((course) => course.isCompleted).length
                ) : (
                  <span className="text-sm font-extrabold text-black">
                    You have no courses completed
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700">Courses completed</div>
            </div>
            <div className="bg-white rounded-2xl shadow flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="text-3xl font-extrabold text-black">
                {courses.filter((course) => course.isInProgress).length > 0 ? (
                  courses.filter((course) => course.isInProgress).length
                ) : (
                  <span className="text-sm font-extrabold text-black">
                    You have no courses in progress
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700">Courses in progress</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* Left: Current Course & Courses List */}
          <div className="flex flex-col gap-6">
            {/* Current Course */}
            <Card className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white rounded-2xl shadow gap-4 sm:gap-6">
              {courses.length > 0 ? (
                <>
                  <div className="flex items-center gap-4">
                    <img
                      src={courses[0].image || ""}
                      alt={courses[0].title}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="space-y-0.5 text-center sm:text-left">
                      <div className="font-bold text-base">
                        {courses[0].title}
                      </div>
                      <div className="text-xs text-gray-500">
                        by {courses[0].User.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <ProgressRing
                      percent={
                        courseProgress.find(
                          (progress) => progress.courseId === courses[0].id
                        )?.progress || 0
                      }
                    />
                    <Button className="bg-black text-white text-sm rounded-md px-6 py-2 shadow">
                      Continue
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full text-center text-gray-400 py-8">
                  Loading course...
                </div>
              )}
            </Card>

            {/* Courses List with Tabs */}
            <Card className="bg-white rounded-2xl shadow p-6">
              <div className="font-bold text-lg mb-2">Courses</div>
              <Tabs defaultValue="all">
                <TabsList className="mb-4 bg-transparent p-0 gap-6 overflow-x-auto whitespace-nowrap justify-start">
                  <TabsTrigger
                    value="all"
                    className="font-bold text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:decoration-2 data-[state=active]:decoration-black"
                  >
                    All Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="new"
                    className="font-bold text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:decoration-2 data-[state=active]:decoration-black"
                  >
                    The Newest
                  </TabsTrigger>
                  <TabsTrigger
                    value="top"
                    className="font-bold text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:decoration-2 data-[state=active]:decoration-black"
                  >
                    Top Rated
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="font-bold text-black data-[state=active]:underline data-[state=active]:underline-offset-4 data-[state=active]:decoration-2 data-[state=active]:decoration-black"
                  >
                    Most Popular
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <div className="flex flex-col gap-3">
                    {courses.map((course, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 gap-3 sm:gap-0"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={course.image || ""}
                            alt={course.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-sm text-black">
                              {course.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              by {course.User.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap justify-end sm:justify-start">
                          <div className="text-xs text-gray-700 flex items-center gap-1">
                            <span>{course.duration}</span>
                          </div>
                          <div className="text-xs text-gray-700 flex items-center gap-1">
                            <span>★</span> {course.isLiked}
                          </div>
                          <Button className="bg-black text-white px-5 py-1.5 rounded-md text-xs font-semibold shadow">
                            View course
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="new">
                  <div className="flex flex-col gap-3">
                    {courses.slice(0, 3).map((course, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 gap-3 sm:gap-0"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={course.image || ""}
                            alt={course.title}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-sm text-black">
                              {course.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              by {course.User.name}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap justify-end sm:justify-start">
                          <div className="text-xs text-gray-700 flex items-center gap-1">
                            <span>{course.duration}</span>
                          </div>
                          <div className="text-xs text-gray-700 flex items-center gap-1">
                            <span>★</span> {course.isLiked}
                          </div>
                          <Button className="bg-black text-white px-5 py-1.5 rounded-md text-xs font-semibold shadow">
                            View course
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="top">
                  <div className="flex flex-col gap-3">
                    {[...courses]
                      .sort((a, b) => b.isLiked - a.isLiked)
                      .map((course, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 gap-3 sm:gap-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={course.image || ""}
                              alt={course.title}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-bold text-sm text-black">
                                {course.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                by {course.User.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap justify-end sm:justify-start">
                            <div className="text-xs text-gray-700 flex items-center gap-1">
                              <span>{course.duration}</span>
                            </div>
                            <div className="text-xs text-gray-700 flex items-center gap-1">
                              <span>★</span> {course.isLiked}
                            </div>
                            <Button className="bg-black text-white px-5 py-1.5 rounded-md text-xs font-semibold shadow">
                              View course
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="popular">
                  <div className="flex flex-col gap-3">
                    {courses
                      .slice()
                      .reverse()
                      .map((course, i) => (
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 gap-3 sm:gap-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={course.image || ""}
                              alt={course.title}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-bold text-sm text-black">
                                {course.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                by {course.User.name}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-wrap justify-end sm:justify-start">
                            <div className="text-xs text-gray-700 flex items-center gap-1">
                              <span>{course.duration}</span>
                            </div>
                            <div className="text-xs text-gray-700 flex items-center gap-1">
                              <span>★</span> {course.isLiked}
                            </div>
                            <Button className="bg-black text-white px-5 py-1.5 rounded-md text-xs font-semibold shadow">
                              View course
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right: Statistics & Promo */}
          <div className="flex flex-col gap-6">
            {/* Statistics */}
            <Card className="p-6 bg-white rounded-2xl shadow mb-2">
              <div className="font-bold mb-2 text-lg">Your statistics</div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-black font-semibold">
                  Learning Hours
                </div>
                <select className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              {/* Mock line chart */}
              <div className="h-32 flex items-end gap-2 w-full">
                <svg
                  width="100%"
                  height="100"
                  viewBox="0 0 280 100"
                  className="w-full h-24"
                >
                  <polyline
                    fill="none"
                    stroke="#111"
                    strokeWidth="2"
                    points="0,90 40,60 80,40 120,70 160,20 200,40 240,60"
                  />
                  {[90, 60, 40, 70, 20, 40, 60].map((y, i) => (
                    <circle key={i} cx={i * 40} cy={y} r="5" fill="#111" />
                  ))}
                  {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
                    (d, i) => (
                      <text
                        key={d}
                        x={i * 40}
                        y={98}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#888"
                      >
                        {d}
                      </text>
                    )
                  )}
                  {[0, 1.5, 2.5, 1, 4, 3, 2].map((h, i) => (
                    <text
                      key={i}
                      x={i * 40}
                      y={[90, 60, 40, 70, 20, 40, 60][i] - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#111"
                      fontWeight="bold"
                    >
                      {h > 0 ? `${h}h` : ""}
                    </text>
                  ))}
                </svg>
              </div>
            </Card>

            {/* Promo Card */}
            <Card className="p-6 bg-white rounded-2xl shadow flex flex-col items-center text-center">
              <div className="font-bold mb-2 text-lg">Learn even more!</div>
              <div className="text-gray-500 text-sm mb-4">
                Unlock premium features only for $9.99 per month.
              </div>
              <Button className="bg-black text-white px-6 py-2 rounded-md mb-2 font-semibold shadow">
                Go Premium
              </Button>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mt-2">
                <span className="text-2xl">🧠</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Only render the Dialog modal after mount to avoid hydration mismatch */}
      {mounted && (
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogContent className="max-w-lg w-full p-0 bg-white rounded-2xl shadow-2xl">
            <div className="p-6">
              <DialogTitle className="sr-only">Search Courses</DialogTitle>
              <Input
                autoFocus
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="mt-4 max-h-80 overflow-y-auto">
                {!searchResults?.users?.length &&
                  !searchResults?.posts?.length &&
                  !searchResults?.courses?.length &&
                  searchQuery.length > 1 && (
                    <div className="text-gray-400 text-center py-8">
                      No results found.
                    </div>
                  )}
                {searchResults?.courses?.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    onClick={() => setSearchOpen(false)}
                  >
                    <img
                      src={course.image || ""}
                      alt={course.title}
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <div className="font-semibold">{course.title}</div>
                      <div className="text-xs text-gray-500">
                        by {course.User?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
