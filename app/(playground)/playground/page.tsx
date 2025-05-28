"use client";
import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion"; // Import useScroll and useTransform
import "tailwindcss/tailwind.css";
import SlidCard from "@/components/camponents-playground/slidCard";

export default function Home() {
  const { scrollYProgress } = useScroll(); // Track scroll progress

  // Define scroll-based animations for elements
  const scaleHero = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const slideInFromLeft = {
    initial: { opacity: 0, x: -100 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
    viewport: { once: true, amount: 0.5 }, // Adjust amount for trigger point
  };

  const slideInFromRight = {
    initial: { opacity: 0, x: 100 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
    viewport: { once: true, amount: 0.5 },
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.7, ease: "easeOut" },
    viewport: { once: true, amount: 0.6 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animation for children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    // Potentially add more complex scroll-triggered animations or Lottie animations here
  }, []);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        className="h-screen flex flex-col items-center justify-center relative p-4"
        style={{ scale: scaleHero, opacity: opacityHero }} // Apply scroll-based transformations
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-extrabold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg"
        >
          WELCOME TO PLAYGROUND
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="relative group w-full md:w-[65%] mt-8 overflow-hidden rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
          whileHover={{ translateY: -10 }} // Subtle lift on hover
        >
          <SlidCard />
          {/* Add an animated overlay for hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </motion.div>
      </motion.section>

      {/* Scroll Sections */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-extrabold mb-6 text-pink-400 leading-tight"
          >
            IMMERSIVE EXPERIENCE
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 leading-relaxed"
          >
            Dive into **ultra-realistic battlegrounds** and dominate your
            enemies with cutting-edge graphics and sound. Explore features and
            game modes designed for the ultimate competitive edge.
          </motion.p>
          <motion.button
            variants={itemVariants}
            className="mt-10 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(168, 85, 247, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-950 to-black">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-3xl text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-extrabold mb-6 text-purple-400 leading-tight"
          >
            EPIC MULTIPLAYER BATTLES
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 leading-relaxed"
          >
            Team up or go solo in **intense, real-time combat**. Experience
            diverse game modes, strategic depth, and action-packed matches that
            will keep you on the edge of your seat.
          </motion.p>
          <motion.button
            variants={itemVariants}
            className="mt-10 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(236, 72, 153, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Join the Fight
          </motion.button>
        </motion.div>
      </section>

      <section className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-16">
        <motion.h2
          className="text-5xl font-extrabold mb-12 text-center text-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-12 w-full max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <FeatureCard
            icon="🎯"
            title="Precision Aim"
            description="Master your shots with advanced aiming mechanics."
            variants={itemVariants}
          />
          <FeatureCard
            icon="🛡️"
            title="Strategic Deployments"
            description="Plan your moves and outsmart your opponents."
            variants={itemVariants}
          />
          <FeatureCard
            icon="💥"
            title="Dynamic Environments"
            description="Interactive maps that change with the battle."
            variants={itemVariants}
          />
        </motion.div>
      </section>

      <footer className="text-center py-12 bg-black border-t border-gray-800">
        <motion.p
          className="text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          © 2025 BattleZone. All rights reserved. Powered by{" "}
          <span className="text-purple-500 font-semibold">Framer Motion</span> &{" "}
          <span className="text-blue-500 font-semibold">Tailwind CSS</span>.
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
  variants: any;
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
