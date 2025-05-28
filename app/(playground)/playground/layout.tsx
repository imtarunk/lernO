import Navbar from "@/components/camponents-playground/navbar";
import { ThemeProvider } from "@/components/theme-provider";

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
        {children}
      </ThemeProvider>
    </div>
  );
};

export default PlaygroundLayout;
