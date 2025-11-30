"use client";

import { useState, useRef, useEffect } from "react";

interface HoverPreviewProps {
  children: React.ReactNode;
  content: React.ReactNode;
  type?: "profile" | "media" | "message";
  delay?: number;
}

export default function HoverPreview({
  children,
  content,
  type = "profile",
  delay = 300,
}: HoverPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      // Use containerRef instead of e.currentTarget to avoid null reference
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          x: rect.right + 20,
          y: rect.top,
        });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPreviewStyles = () => {
    switch (type) {
      case "profile":
        return "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800";
      case "media":
        return "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border-sky-200 dark:border-sky-800";
      case "message":
        return "bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-800";
      default:
        return "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`fixed z-[10000] w-80 p-4 rounded-2xl shadow-2xl border-2 backdrop-blur-md ${getPreviewStyles()} transition-all duration-300 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: `translateY(${typeof window !== 'undefined' && position.y + 200 > window.innerHeight ? -100 : 0}px)`,
          }}
        >
          <div className="text-gray-900 dark:text-gray-100">{content}</div>
        </div>
      )}
    </div>
  );
}

