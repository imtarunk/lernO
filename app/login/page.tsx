// components/LoginPage.jsx (or pages/login.jsx)
"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion"; // Import motion for animations
import Logo from "@/components/logo";

// --- Icon Components (for better readability) ---
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
  </svg>
);
// --- End Icon Components ---

export default function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null); // State for displaying login errors

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.push("/home");
      }
    };
    checkSession();
  }, [router]);

  const handleSocialSignIn = async (provider: string) => {
    setIsLoading(true);
    setAuthError(null); // Clear previous errors
    const result = await signIn(provider, {
      redirect: false,
      callbackUrl: "/home",
    });

    if (result?.error) {
      setAuthError(result.error);
      setIsLoading(false);
    } else if (result?.url) {
      router.push(result.url); // Manually redirect if `redirect: false` and successful
    }
  };

  const handleEmailPasswordSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null); // Clear previous errors

    // In a real app, you'd call an API here.
    // For this example, we'll simulate it.
    setTimeout(() => {
      console.log("Attempting email/password login:", { email, password });
      setAuthError(
        "Email/Password login not implemented in this example. Use social login."
      );
      setIsLoading(false);
    }, 1500); // Increased timeout for better loading visualization
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        {/* Floating Elements (with Framer Motion for subtle entry animations) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: -50, y: -50 }}
          animate={{ opacity: 0.2, scale: 1, x: 0, y: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl animate-pulse"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 50, y: -50 }}
          animate={{ opacity: 0.3, scale: 1, x: 0, y: 0 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-bounce"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: -50, y: 50 }}
          animate={{ opacity: 0.25, scale: 1, x: 0, y: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-32 left-16 w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl animate-pulse delay-1000"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 50, y: 50 }}
          animate={{ opacity: 0.2, scale: 1, x: 0, y: 0 }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.7,
          }}
          className="absolute bottom-20 right-20 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl animate-bounce delay-500"
        ></motion.div>
      </div>

      {/* Left Panel - Brand & Features */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex-1 flex flex-col justify-center px-12 lg:px-16 xl:px-20 py-10" // Added py-10 for vertical padding
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Logo />
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight">
                CLAY
              </h1>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/90 text-sm font-medium">
              Web3 Social Learning Platform
            </span>
          </div>

          <p className="text-xl text-white/80 font-light leading-relaxed max-w-md">
            Join the future of decentralized learning. Connect, learn, and earn
            in our blockchain-powered educational ecosystem.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🎓</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Learn & Earn</h3>
              <p className="text-white/70 text-sm">
                Get rewarded with tokens for completing courses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🤝</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Social Learning</h3>
              <p className="text-white/70 text-sm">
                Connect with peers and mentors globally
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🔗</span>
            </div>
            <div>
              <h3 className="text-white font-semibold">Blockchain Verified</h3>
              <p className="text-white/70 text-sm">
                Your achievements stored on blockchain forever
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex-1 flex items-center justify-center p-8 lg:p-12" // Increased padding for consistency
      >
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Subtle gradient overlay for card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

          <CardHeader className="text-center pb-8 pt-10 relative">
            <CardDescription className="text-gray-500 font-medium mb-2">
              Step 1 of 2
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Join CLAY
            </CardTitle>
            <p className="text-gray-600">Start your Web3 learning journey</p>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            {/* Social Login Buttons */}
            <div className="space-y-4 mb-8">
              <Button
                onClick={() => handleSocialSignIn("google")}
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group" // Added group for icon hover
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              <Button
                onClick={() => handleSocialSignIn("facebook")}
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
              >
                <FacebookIcon />
                Continue with Facebook
              </Button>

              <Button
                onClick={() => handleSocialSignIn("apple")}
                disabled={isLoading}
                className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group"
              >
                <AppleIcon />
                Continue with Apple
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative bg-white px-4">
                <span className="text-gray-500 text-sm font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Error Message Display */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
                  role="alert"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-12a1 1 0 112 0v4a1 1 0 11-2 0V6zm0 8a1 1 0 112 0 1 1 0 01-2 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {authError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Form */}
            <form onSubmit={handleEmailPasswordSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors px-4" // Added px-4 for consistency
                  placeholder="name@example.com" // Added placeholder
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-semibold"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors pr-12 px-4" // Added px-4
                    placeholder="Enter your password" // Added placeholder
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100" // Added padding and hover bg
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    } // Accessibility
                  >
                    {passwordVisible ? (
                      <EyeOpenIcon className="h-5 w-5" />
                    ) : (
                      <EyeClosedIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <a
                  href="#" // Replace with actual forgot password route
                  className="text-sm text-blue-600 hover:underline text-right block mt-2"
                >
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Continue to CLAY"
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              By continuing, you agree to CLAY's{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
