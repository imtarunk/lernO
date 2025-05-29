// components/camponents-playground/gameCard.jsx
import { motion } from "framer-motion";

export default function GameCard({
  title,
  description,
  image,
  price,
}: {
  title: string;
  description: string;
  image: string;
  price: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="max-w-sm rounded-2xl overflow-hidden bg-[#0c0f18] shadow-lg transition-all duration-300
                 flex flex-col min-h-[450px] md:min-h-[500px] lg:min-h-[550px] cursor-pointer" // Added min-height for the entire card
    >
      <img
        src={image} // Place your image in public folder with this name or update the path
        alt={title} // Use title for alt text for better accessibility
        className="w-full object-cover h-64 md:h-72 lg:h-80 // Increased image height
                   hover:scale-105 transition-all duration-300 rounded-2xl" // Apply rounded top to image
      />

      <div className="p-5 flex flex-col flex-grow">
        {" "}
        {/* Added flex-grow to content area */}
        <h2 className="text-white text-2xl font-bold tracking-wide mb-2">
          {title}
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
          {" "}
          {/* Added flex-grow to description */}
          {description}
        </p>
        <span className="text-red-500 font-semibold text-lg mt-auto">
          {" "}
          {/* mt-auto to push price to bottom */}
          {price}
        </span>
      </div>
    </motion.div>
  );
}
