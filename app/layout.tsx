import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
// import { Navbar } from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import Sidebar from "@/components/sidebar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShapeUp - Social Learning Platform",
  description: "Connect, learn, and grow together",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="h-full light" style={{ colorScheme: "light" }}>
      <body className={`${inter.className} min-h-full bg-gray-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {/* <Navbar /> */}
            <main>{children}</main>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
