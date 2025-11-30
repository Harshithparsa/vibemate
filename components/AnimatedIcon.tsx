"use client";

import { ReactNode, useState } from "react";

interface AnimatedIconProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  animation?: "scale" | "rotate" | "bounce" | "pulse";
  tooltip?: string;
}

export default function AnimatedIcon({
  children,
  onClick,
  className = "",
  animation = "scale",
  tooltip,
}: AnimatedIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getAnimationClass = () => {
    switch (animation) {
      case "scale":
        return "hover:scale-125 active:scale-95";
      case "rotate":
        return "hover:rotate-12 active:rotate-0";
      case "bounce":
        return "hover:animate-bounce";
      case "pulse":
        return "hover:animate-pulse";
      default:
        return "hover:scale-110";
    }
  };

  return (
    <div className="relative inline-block">
      <button
        data-icon="icon"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          p-2 rounded-full
          transition-all duration-300 ease-out
          ${getAnimationClass()}
          hover:bg-white/10
          focus:outline-none focus:ring-2 focus:ring-amber-400/50
          ${className}
        `}
      >
        {children}
      </button>
      {tooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg whitespace-nowrap z-50 animate-fade-in">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}
    </div>
  );
}

