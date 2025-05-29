// components/GiveawayCard.jsx
import React from "react";

const GiveawayCard = ({
  imageSrc,
  title,
  description,
  alignment = "left",
}: {
  imageSrc: string;
  title: string;
  description: string;
  alignment: "left" | "right";
}) => {
  // Determine text alignment based on prop
  const textAlignmentClass = alignment === "left" ? "text-left" : "text-right";
  // For the right-aligned card, we want the text content to be pushed to the right.
  // We'll adjust the flex alignment for the content wrapper.
  const contentFlexAlignment =
    alignment === "left" ? "items-start" : "items-end";
  // These padding and width classes are now less relevant due to the changes below,
  // but keeping them as a reminder of past considerations.
  // const contentPaddingClass = alignment === "left" ? "pr-1/2" : "pl-1/2";
  // const contentWidthClass = alignment === "left" ? "mr-auto" : "ml-auto";

  return (
    <div
      className={`relative w-full // Occupy full available width from parent
                 h-[300px] md:h-[350px] lg:h-[400px] // Adjusted height to be "little"
                 bg-[#0a0a0c] rounded-lg overflow-hidden shadow-2xl border border-[#2c2c30] group`}
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt="Gaming Character Background"
        className="w-full h-full object-cover object-center absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
      />

      {/* Gradient Overlay for Readability and Aesthetic */}
      <div
        className={`absolute inset-0 z-10 ${
          alignment === "left"
            ? "bg-gradient-to-r from-black/70 via-black/40 to-transparent"
            : "bg-gradient-to-l from-black/70 via-black/40 to-transparent"
        }`}
      ></div>

      {/* Content Area */}
      <div
        className={`relative z-20 p-8 md:p-10 lg:p-12 // Adjusted padding for new size
                    flex flex-col h-full ${contentFlexAlignment}`} // Use dynamic content alignment
      >
        {/*
          We remove max-w-xs from this inner div and allow content to take more space.
          The max-width should be managed by the overall layout of the two cards side-by-side,
          not by this inner div, unless you want the text to always be extremely narrow.
          If you want text to always be confined, re-add max-w-xs.
        */}
        <div
          className={`// Removed max-w-xs here to allow wider text area
                         ${textAlignmentClass} // Apply text alignment
                         ${
                           alignment === "left" ? "mr-auto" : "ml-auto"
                         } // Push text to correct side if you need a max-width later
                        `}
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl // Adjusted font size for new dimensions
                         font-extrabold text-white mb-3 // Use extrabold for impact, slightly less mb
                         bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg"
          >
            {title}
          </h2>
          <p
            className={`text-sm md:text-base lg:text-lg // Adjusted font size
                       text-gray-300 leading-relaxed`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GiveawayCard;
