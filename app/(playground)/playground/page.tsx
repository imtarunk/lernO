"use client";
import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "tailwindcss/tailwind.css";
import SlidCard from "@/components/camponents-playground/slidCard";
import { Russo_One } from "next/font/google";
import GameCard from "@/components/camponents-playground/gameCard"; // Ensure this component is robust
import SectionDivider from "@/components/camponents-playground/sectionDivider";
import GiveawayCard from "@/components/camponents-playground/card2"; // Assuming card2.jsx is your GiveawayCard component
import JoinUsNowBanner from "@/components/camponents-playground/joinUs";
import IdeasBanner from "@/components/camponents-playground/joinUs";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useStore } from "@/lib/store";
import { PostCard } from "@/components/post-card";
import Loader from "@/components/ui/loader";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

const gameCards = [
  {
    title: "Space Wars",
    description:
      "Engage in intergalactic battles, explore unknown galaxies, and command.",
    image: "/game1.jpeg",
    price: "FREE",
    color: "from-blue-500 to-indigo-700", // Added color for potential card styling
  },
  {
    title: "Galaxy Raiders",
    description:
      "Fight alien forces and conquer the edge of the universe in this space RTS.",
    image: "/game2.jpeg",
    price: "$9.99",
    color: "from-red-500 to-pink-700",
  },
  {
    title: "Starfall",
    description:
      "Embark on a quest to recover ancient artifacts in the ruins of star systems.",
    image: "/game3.jpeg",
    price: "$4.99",
    color: "from-green-500 to-teal-700",
  },
  {
    title: "Alien Siege",
    description:
      "Defend Earth from an alien invasion with high-tech weapons and strategy.",
    image: "/game4.jpeg",
    price: "FREE",
    color: "from-yellow-500 to-orange-700",
  },
];

export default function Home() {
  const { scrollYProgress } = useScroll();

  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Slightly faster stagger
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 }, // Increased initial y for a stronger slide up
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    }, // Spring animation
  };

  // const { posts, setPosts, isLoading, setIsLoading } = useStore();

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-lg text-gray-600">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <main
      className={`${russoOne.className} bg-black text-white overflow-x-hidden pt-20`}
    >
      {/* Hero Section */}
      <motion.section
        className="h-screen flex flex-col items-center justify-center relative p-4 bg-cover bg-center"
        // Consider a background image here for more visual impact
        // style={{ backgroundImage: "url('/hero-bg.jpg')", scale: scaleHero, opacity: opacityHero }}
        style={{ scale: scaleHero, opacity: opacityHero }}
      >
        <div className="absolute inset-0 bg-black/60 z-0"></div>{" "}
        {/* Dark overlay for text readability */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl z-10"
        >
          WELCOME TO PLAYGROUND
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-lg md:text-2xl text-gray-300 text-center mt-4 mb-8 max-w-2xl z-10"
        >
          Discover cutting-edge courses and earn sats in the next generation of
          Web3 education.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="relative group w-full md:w-[65%] mt-8 overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out z-10"
          whileHover={{ translateY: -10 }}
        >
          <SlidCard />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
        </motion.div>
      </motion.section>

      {/* Featured Games Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-br from-black to-gray-900">
        <motion.h2
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-5xl font-extrabold mb-12 text-pink-400 leading-tight text-center"
        >
          FEATURED GAMES
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl"
        >
          {gameCards.map((game) => (
            <motion.div key={game.title} variants={itemVariants}>
              <GameCard {...game} />
            </motion.div>
          ))}
        </motion.div>
        <motion.button
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-16 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 25px rgba(168, 85, 247, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          EXPLORE ALL GAMES
        </motion.button>
      </section>

      {/* Immersive Experience Section */}
      {/* <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-t from-black to-gray-950">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-4xl text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-extrabold mb-6 text-purple-400 leading-tight"
          >
            IMMERSIVE EXPERIENCES
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 leading-relaxed mb-8"
          >
            Dive into **ultra-realistic battlegrounds** and dominate your
            enemies with cutting-edge graphics and sound. Explore features and
            game modes designed for the ultimate competitive edge.
          </motion.p>
          <motion.button
            variants={itemVariants}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            LEARN MORE ABOUT GAMEPLAY
          </motion.button>
        </motion.div>
      </section> */}

      <SectionDivider text="GAME GIVEAWAYS" />

      {/* Giveaway Section (New/Corrected Placement) */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-950 to-black">
        <motion.h2
          className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          CLAIM YOUR FREE COURSES AND EARN SATS
        </motion.h2>

        <motion.div
          className="flex flex-col md:flex-row gap-8 w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left Card */}
          <motion.div variants={itemVariants} className="w-full">
            <GiveawayCard
              imageSrc="/game5.jpeg" // Ensure these images exist in public folder
              title="FREE GIVEAWAY"
              description="GET A NEW FREE GAME EVERY THURSDAY ON MOBILE AND PC APP AVAILABLE GLOBALLY ON ANDROID, AND ON IPHONE AND IPAD IN THE EU"
              alignment="left"
            />
          </motion.div>

          {/* Right Card */}
          <motion.div variants={itemVariants} className="w-full">
            <GiveawayCard
              imageSrc="/game6.jpeg" // Ensure these images exist in public folder
              title="FREE GIVEAWAY"
              description="GET A NEW FREE GAME EVERY THURSDAY ON MOBILE AND PC APP AVAILABLE GLOBALLY ON ANDROID, AND ON IPHONE AND IPAD IN THE EU"
              alignment="right"
            />
          </motion.div>
        </motion.div>
      </section>

      <SectionDivider text="KEY FEATURES" />

      {/* Original Key Features Section (now clean) */}
      <section className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-950 to-black">
        <motion.h2
          className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          CORE GAMEPLAY ADVANTAGES
        </motion.h2>
        <IdeasBanner />
      </section>

      <footer className="text-center py-12 bg-black border-t border-gray-800">
        <motion.p
          className="text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          © 2025 PLAYGROUND. All rights reserved. Built with{" "}
          <span className="text-purple-500 font-semibold">@codextarun.xyz</span>{" "}
          & <span className="text-blue-500 font-semibold">CLAY</span>.
        </motion.p>
      </footer>
    </main>
  );
}

// Reusable Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
  variants,
}: {
  icon: string;
  title: string;
  description: string;
  variants: any; // Consider defining a more specific type if using TypeScript extensively
}) => (
  <motion.div
    className="bg-gray-800 rounded-xl p-8 text-center shadow-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-2"
    variants={variants}
    whileHover={{
      scale: 1.03,
      boxShadow: "0px 10px 30px rgba(147, 51, 234, 0.3)",
    }}
  >
    <motion.div
      className="text-6xl mb-4"
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
      viewport={{ once: true }}
    >
      {icon}
    </motion.div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);
