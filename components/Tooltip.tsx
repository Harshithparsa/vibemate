"use client";

import { ReactNode, useState, useRef, useEffect } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string | ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export default function Tooltip({
  children,
  content,
  position = "top",
  delay = 200,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
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

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "top":
        return "top-full left-1/2 transform -translate-x-1/2 border-t-amber-400";
      case "bottom":
        return "bottom-full left-1/2 transform -translate-x-1/2 border-b-amber-400";
      case "left":
        return "left-full top-1/2 transform -translate-y-1/2 border-l-amber-400";
      case "right":
        return "right-full top-1/2 transform -translate-y-1/2 border-r-amber-400";
      default:
        return "top-full left-1/2 transform -translate-x-1/2 border-t-amber-400";
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${getPositionClasses()} z-[10001] px-3 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm rounded-lg shadow-xl whitespace-nowrap animate-fade-in`}
        >
          {content}
          <div
            className={`absolute ${getArrowClasses()} w-0 h-0 border-4 border-transparent`}
          />
        </div>
      )}
    </div>
  );
}

