// components/Navbar.jsx
import { ChevronDown, Smartphone } from "lucide-react";
import { Russo_One } from "next/font/google";
import { AlbyButton } from "../../components/ui/albayButton";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

const menuItems = [
  { label: "Explore" },
  { label: "Earn" },
  { label: "About", dropdown: false },
  { label: "More" },
];

export default function Navbar() {
  return (
    <nav
      className={`${russoOne.className} w-full bg-black text-white py-4 px-6 flex justify-between items-center border-b border-gray-800 fixed z-50`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Galxe" className="w-6 h-6" />
        <span className="text-xl font-semibold">Galxe</span>
      </div>

      {/* Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-1 cursor-pointer hover:text-gray-300"
          >
            <span>{item.label}</span>
            {item.dropdown !== false && (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Right Buttons */}
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 rounded-md border border-gray-600 text-sm hover:border-gray-400">
          Network
        </button>
        <div className="bg-gray-700 rounded-full p-1">
          <Smartphone size={16} />
        </div>
        <AlbyButton />
      </div>
    </nav>
  );
}
