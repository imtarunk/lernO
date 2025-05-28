import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    logo: "/geodnet.png",
    title: "Complete the quest to earn",
    amount: "90.000 $G Coin",
    button: "JOIN OUR QUEST NOW",
    bg: "from-[#6e00ff] to-[#240046]", // This bg gradient won't be used for video slides
    brand: "Geodnet",
    video: "/card2.mp4",
  },
  {
    id: 2,
    logo: "/dabba.png",
    title: "Claim Your Share of",
    amount: "5,000,000 DBT",
    button: "Start Your Quest Now",
    bg: "from-[#000000] to-[#1e1e1e]", // This bg gradient won't be used for video slides
    brand: "Dabba",
    video: "/card3.mp4",
  },
  {
    id: 3, // Changed ID to be unique
    logo: "/dabba.png",
    title: "Claim Your Share of",
    amount: "5,000,000 DBT",
    button: "Start Your Quest Now",
    bg: "from-[#000000] to-[#1e1e1e]", // This bg gradient won't be used for video slides
    brand: "Dabba",
    video: "/card4.mp4",
  },
  {
    id: 1,
    logo: "/geodnet.png",
    title: "Complete the quest to earn",
    amount: "90.000 $G Coin",
    button: "JOIN OUR QUEST NOW",
    bg: "from-[#6e00ff] to-[#240046]", // This bg gradient won't be used for video slides
    brand: "Geodnet",
    video: "/card.mp4",
  },
];

export default function SlidCard() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<any>(null); // Keep type as any if not using a specific timer type, or use a specific type if you know it (e.g., NodeJS.Timeout)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prevCurrent) => (prevCurrent + 1) % slides.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => {
      resetTimeout();
    };
  }, [current]);

  const prevSlide = () => {
    setCurrent(
      (prevCurrent) => (prevCurrent - 1 + slides.length) % slides.length
    );
    resetTimeout();
    // Re-start timeout after manual navigation
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  const nextSlide = () => {
    setCurrent((prevCurrent) => (prevCurrent + 1) % slides.length);
    resetTimeout();
    // Re-start timeout after manual navigation
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
  };

  return (
    <section className="w-full text-white py-8 px-4">
      <h1 className="text-3xl md:text-5xl font-semibold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        Your Web3 Super App
      </h1>

      <div className="flex justify-center gap-4 items-start md:flex-row flex-col max-w-6xl mx-auto pt-10">
        {/* Slider */}
        <div className="relative group w-full md:w-[65%] h-[250px] md:h-[300px] overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className={`relative w-full flex-shrink-0 h-full`} // Use relative for positioning video
              >
                {/* Video as background */}
                <video
                  src={slide.video}
                  autoPlay
                  muted
                  loop
                  playsInline // Important for mobile autoplay
                  className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl" // Position absolutely, cover entire div, z-index 0
                />
                {/* Overlay for readability and gradient effect */}
                <div className="absolute inset-0 bg-black/50 z-10 rounded-2xl"></div>{" "}
                {/* Add a semi-transparent overlay */}
                <div
                  className={`absolute inset-0 z-20 p-6 flex flex-col justify-between rounded-2xl`}
                  // The `slide.bg` can be used here if you want a subtle gradient *on top* of the video
                  // For now, we'll keep it simple to ensure video is visible
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={slide.logo}
                      alt={`${slide.brand} logo`}
                      className="w-8 h-8 md:w-10 md:h-10 object-contain" // Increased size slightly
                    />
                    <span className="bg-black/60 px-3 py-1.5 text-sm rounded-lg font-medium">
                      {slide.brand}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mt-4">
                      {slide.title}
                    </h2>
                    <p className="text-3xl md:text-4xl font-extrabold my-2 bg-gradient-to-r from-teal-300 to-blue-400 bg-clip-text text-transparent">
                      {slide.amount}
                    </p>{" "}
                    {/* Added text gradient */}
                    <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-base transition-colors duration-300 shadow-md">
                      {slide.button}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2.5 rounded-full shadow-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Previous slide"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2.5 rounded-full shadow-lg z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Next slide"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        {/* My Assets */}
        <div className="bg-gradient-to-br from-[#1e1e2f] to-[#2c0044] w-full md:w-[30%] p-6 rounded-2xl h-fit md:h-[300px] flex flex-col justify-between">
          <h3 className="text-xl font-medium mb-4 text-purple-300">
            My Assets
          </h3>
          <div className="space-y-4 flex-grow">
            {" "}
            {/* flex-grow to push button to bottom */}
            <div>
              <p className="font-semibold text-lg">Level</p>
              <p className="text-sm text-gray-300">
                Gain level and unlock exclusive rewards.
              </p>
            </div>
            <div>
              <p className="font-semibold text-lg">Galxe Gold</p>
              <p className="text-sm text-gray-300">
                Earn Galxe Gold and win rewards up to 0.5 WETH
              </p>
            </div>
          </div>
          <button className="mt-6 text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 self-start font-medium">
            Rewards Hub &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
