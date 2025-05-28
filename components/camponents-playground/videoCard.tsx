import React from "react";

export default function QuestCard() {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl shadow-lg bg-black border border-yellow-500">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        src="/card.mp4" // ⬅️ Replace with your video file path
      />

      {/* Overlay for dark blur effect */}
      <div className="absolute inset-0 bg-black/70 z-10 " />

      {/* Content */}
      <div className="relative z-20 p-6 text-center text-white flex flex-col items-center">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <img src="/dabba.png" alt="dabba" className="w-6 h-6 rounded-full" />
          <span className="bg-black/60 px-2 py-1 text-sm rounded-md font-medium">
            Dabba Network
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-xl md:text-2xl font-medium mb-2">
          Claim Your Share of
        </h2>
        <p className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-3 drop-shadow">
          5,000,000 DBT
        </p>

        {/* Sub Text */}
        <p className="text-sm text-gray-300 mb-4">
          Complete quests. Earn XP. Join the TGE airdrop.
        </p>

        {/* CTA */}
        <button className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full transition-all">
          Start Your Quest Now
        </button>
      </div>
    </div>
  );
}
