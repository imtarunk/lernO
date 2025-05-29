// components/IdeasBanner.jsx
import React from "react";
import { motion } from "framer-motion";
import { AnimatedTooltip } from "../ui/animated-tooltip";
// Assuming you have an SVG component for the logo or use an image
// import YourLogo from './YourLogo'; // Path to your logo component/image

const IdeasBanner = () => {
  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  const textGradient =
    "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent";

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
      className="relative w-full max-w-7xl mx-auto h-[350px] md:h-[450px] lg:h-[550px]
                 bg-cover bg-center rounded-3xl overflow-hidden shadow-xl
                 flex items-center justify-between p-6 md:p-10 lg:p-16 mb-20" // Added mb-20 for spacing
      style={{
        // This image should include the background texture and purple abstract shapes
        backgroundImage: "url('/ideas-banner-bg.webp')", // Replace with your actual background image
        backgroundColor: "#1a0d33", // Deep purple/dark background
        boxShadow:
          "0 0 50px rgba(78, 14, 168, 0.4), 0 0 100px rgba(78, 14, 168, 0.2) inset", // Subtle glow
      }}
    >
      {/* Main Content (Left Side) */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-2xl">
        <motion.h1
          variants={itemVariants}
          className={`text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight ${textGradient} mb-8 drop-shadow-lg`}
        >
          WE'LL BRING <br /> YOUR IDEAS <br /> TO LIFE!
        </motion.h1>

        {/* Avatars Section */}
        <motion.div
          variants={itemVariants}
          className="flex items-center space-x-3 mt-8"
        >
          <div className="flex -space-x-3">
            <AnimatedTooltip items={demoArr} />
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold border-2 border-white">
              30+
            </div>
          </div>
          <span className="text-gray-200 text-lg font-semibold">
            Top creative talent
          </span>
        </motion.div>
      </div>

      {/* Right Panel */}
      <motion.div
        variants={itemVariants}
        className="relative z-10 bg-purple-900/50 backdrop-blur-sm
                   p-8 md:p-10 rounded-3xl text-right // Panel styling
                   w-[200px] md:w-[250px] lg:w-[300px] // Panel width
                   h-full flex flex-col justify-between items-end // Content alignment
                   border border-purple-700 shadow-xl"
        style={{
          boxShadow:
            "0 0 25px rgba(128, 0, 128, 0.5), 0 0 50px rgba(128, 0, 128, 0.3) inset", // Panel glow
        }}
      >
        {/* Logo */}
        <div className="mb-auto">
          {" "}
          {/* Pushes logo to top */}
          {/* Replace with your actual logo component or image */}
          {/* <YourLogo className="w-12 h-12 text-white" /> */}
          <svg
            className="w-12 h-12 text-white opacity-80"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93h4c0 2.21 1.79 4 4 4s4-1.79 4-4h4c0 4.08-3.05 7.44-7 7.93V12z" />
          </svg>
        </div>

        {/* List of Services */}
        <ul className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed space-y-2">
          <motion.li variants={itemVariants}>Art</motion.li>
          <motion.li variants={itemVariants}>Function</motion.li>
          <motion.li variants={itemVariants}>Motion</motion.li>
          <motion.li variants={itemVariants}>Strategy</motion.li>
        </ul>
      </motion.div>

      {/* Down Arrow Icon */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white opacity-70"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default IdeasBanner;

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string; // Path to the image, e.g., '/images/avatar1.jpg'
}

const demoArr: TeamMember[] = [
  {
    id: 1,
    name: "Alice Johnson",
    designation: "Lead Designer",
    image: "/avatars/avatar-alice.jpg", // Make sure this path exists in your public folder
  },
  {
    id: 2,
    name: "Bob Smith",
    designation: "Frontend Developer",
    image: "/avatars/avatar-bob.jpg",
  },
  {
    id: 3,
    name: "Charlie Brown",
    designation: "Project Manager",
    image: "/avatars/avatar-charlie.jpg",
  },
  {
    id: 4,
    name: "Diana Prince",
    designation: "Backend Engineer",
    image: "/avatars/avatar-diana.jpg",
  },
  {
    id: 5,
    name: "Eve Adams",
    designation: "UX Researcher",
    image: "/avatars/avatar-eve.jpg",
  },
  // You can add more members here
];
