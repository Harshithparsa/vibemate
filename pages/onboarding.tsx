import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import AnimatedButton from "@/components/AnimatedButton";
import VibeMateLogo from "@/components/VibeMateLogo";
import Tooltip from "@/components/Tooltip";

export default function Onboarding() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const validateUsername = (value: string) => {
    // Remove @ if user types it
    const cleanValue = value.replace(/^@/, "");
    
    // Username validation: 3-20 characters, alphanumeric and underscores only
    if (cleanValue.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    if (cleanValue.length > 20) {
      setUsernameError("Username must be less than 20 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanValue)) {
      setUsernameError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^@/, ""); // Remove @ if typed
    setUsername(value);
    validateUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUsername(username)) {
      return;
    }
    
    // TODO: Add authentication and database logic later
    console.log("Profile data:", { displayName, username });
    
    router.push("/"); // redirect to home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4" data-no-bottom-nav>
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-2 border-amber-200/50 dark:border-gray-700/50 rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <VibeMateLogo size="lg" showText={true} />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100 text-center">
          Welcome to VibeMate!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Create your unique profile to start connecting
        </p>
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-300 text-center mb-2">
            <strong>New to VibeMate?</strong> Start by{" "}
            <Link href="/auth" className="underline font-semibold hover:text-amber-800 dark:hover:text-amber-200">
              signing up with Gmail, Email, or Phone
            </Link>
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
            Already have an account?{" "}
            <Link href="/auth" className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-300">
              Sign In
            </Link>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full p-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <Tooltip content="Your unique ID for others to find you (e.g., @johndoe)" position="right">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-semibold">
                  @
                </span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                  className="w-full pl-8 pr-3 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-amber-200/50 dark:border-gray-600/50 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all duration-300"
                />
              </div>
            </Tooltip>
            {usernameError && (
              <p className="text-red-500 text-xs mt-1">{usernameError}</p>
            )}
            {username && !usernameError && (
              <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">
                ✓ Available: vibemate.com/@{username}
              </p>
            )}
          </div>

          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
          >
            Create Profile
          </AnimatedButton>
        </form>
      </div>
    </div>
  );
}
