import Link from "next/link";
import { useState, useEffect } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import Tooltip from "@/components/Tooltip";
import AnimatedIcon from "@/components/AnimatedIcon";
import VibeMateLogo from "@/components/VibeMateLogo";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-amber-200/50 dark:border-gray-700/50 z-50 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <VibeMateLogo size="md" showText={true} />
            </Link>
            <div className="flex gap-4">
              <Tooltip content="Sign in or create account" position="bottom">
                <Link
                  href="/auth"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 dark:from-amber-600 dark:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all duration-300 font-semibold text-white shadow-lg hover:shadow-xl"
                >
                  Sign In
                </Link>
              </Tooltip>
              <Tooltip content="View your profile" position="bottom">
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
                >
                  Profile
                </Link>
              </Tooltip>
              <Tooltip content="Discover new people" position="bottom">
                <Link
                  href="/discover"
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 transition-all duration-300 font-semibold text-amber-700 dark:text-amber-300"
                >
                  Discover
                </Link>
              </Tooltip>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 mb-6 leading-tight animate-slide-down">
              Connect with
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-transparent bg-clip-text"> Awesome People</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Find friends, travel buddies, or your perfect match. Connect, chat, share moments, and build meaningful relationships.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-fade-in">
              <Link href="/network">
                <Tooltip content="Connect with people worldwide" position="top">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="text-3xl mb-2">🌍</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Network</p>
                  </div>
                </Tooltip>
              </Link>
              <Link href="/chat">
                <Tooltip content="Real-time messaging" position="top">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="text-3xl mb-2">💬</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Real Chat</p>
                  </div>
                </Tooltip>
              </Link>
              <Link href="/travel-buddies">
                <Tooltip content="Find travel companions" position="top">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="text-3xl mb-2">✈️</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Travel Buddies</p>
                  </div>
                </Tooltip>
              </Link>
              <Link href="/memories">
                <Tooltip content="Share your moments" position="top">
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-xl p-4 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">Share Moments</p>
                  </div>
                </Tooltip>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <Link href="/auth">
                <AnimatedButton variant="primary" size="lg">
                  Get Started
                </AnimatedButton>
              </Link>
              <Link href="/discover">
                <AnimatedButton variant="ghost" size="lg">
                  Explore Now
                </AnimatedButton>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 text-center animate-fade-in">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">50K+</div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Active Users</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">100K+</div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Connections</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:scale-110 transition-transform duration-300">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">180</div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Countries</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-16">Why Choose VibeMate?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-8 hover:border-amber-400 dark:hover:border-amber-500 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-full flex items-center justify-center mb-6 hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Smart Matching</h3>
                <p className="text-gray-700 dark:text-gray-300">AI-powered matching based on interests, location, and preferences</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-8 hover:border-amber-400 dark:hover:border-amber-500 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-400 rounded-full flex items-center justify-center mb-6 hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Safe & Secure</h3>
                <p className="text-gray-700 dark:text-gray-300">Verified profiles and secure messaging keep you safe online</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2 border-amber-200/50 dark:border-gray-700/50 rounded-2xl p-8 hover:border-amber-400 dark:hover:border-amber-500 hover:scale-105 hover:shadow-2xl transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mb-6 hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Instant Connection</h3>
                <p className="text-gray-700 dark:text-gray-300">Real-time chat, video calls, and media sharing</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-amber-200/50 dark:border-gray-700/50 py-12 px-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center text-gray-700 dark:text-gray-300">
            <p>&copy; 2025 VibeMate. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
