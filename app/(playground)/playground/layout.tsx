import Navbar from "@/components/camponents-playground/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Russo_One } from "next/font/google";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black min-h-screen">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Navbar />
        <body className={`${russoOne.className} bg-black`}>{children}</body>
      </ThemeProvider>
    </div>
  );
};

export default PlaygroundLayout;
