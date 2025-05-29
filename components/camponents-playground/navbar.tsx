"use client";

// components/Navbar.jsx

import { ChevronDown, Link, Smartphone } from "lucide-react";
import { Russo_One } from "next/font/google";
import { AlbyButton } from "../../components/ui/albayButton";
import { ExitIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import React from "react";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

const menuItems = [
  {
    label: "Explore",
    items: [
      { title: "Featured", href: "/explore/featured" },
      { title: "New Arrivals", href: "/explore/new" },
      { title: "Popular", href: "/explore/popular" },
    ],
  },
  {
    label: "Earn",
    items: [
      { title: "Rewards", href: "/earn/rewards" },
      { title: "Referrals", href: "/earn/referrals" },
      { title: "Staking", href: "/earn/staking" },
    ],
  },
  {
    label: "About",
    items: [
      { title: "Team", href: "/about/team" },
      { title: "Mission", href: "/about/mission" },
      { title: "Contact", href: "/about/contact" },
    ],
  },
  {
    label: "More",
    items: [
      { title: "Blog", href: "/blog" },
      { title: "Support", href: "/support" },
      { title: "FAQ", href: "/faq" },
    ],
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navbar() {
  const router = useRouter();
  return (
    <nav
      className={`${russoOne.className} w-full bg-black text-white py-4 px-6 flex justify-between items-center border-b border-gray-800 fixed z-50`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        {/* <img src="/logo.svg" alt="Galxe" className="w-6 h-6" /> */}
        <span className="text-xl font-semibold">CLAY</span>
      </div>

      {/* Menu */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList className="bg-black ">
          {menuItems.map((item, index) => (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger className="bg-black text-white hover:bg-black hover:text-gray-300 data-[state=open]:bg-black data-[state=open]:text-white">
                {item.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-black border border-gray-800">
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {item.items.map((subItem, subIndex) => (
                    <ListItem
                      key={subIndex}
                      title={subItem.title}
                      href={subItem.href}
                      className="text-white hover:bg-gray-800 hover:text-white"
                    >
                      {subItem.title} description goes here
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Buttons */}
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 rounded-md border border-gray-600 text-sm hover:border-gray-400">
          Network
        </button>
        <div className="bg-black rounded-full p-3 cursor-pointer">
          <ExitIcon className="text-white" onClick={() => router.push("/")} />
        </div>
        <AlbyButton />
      </div>
    </nav>
  );
}
