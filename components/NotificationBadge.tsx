"use client";

import { ReactNode, useEffect, useState } from "react";

interface NotificationBadgeProps {
  count: number;
  children: ReactNode;
  variant?: "default" | "pulse" | "bounce";
}

export default function NotificationBadge({
  count,
  children,
  variant = "default",
}: NotificationBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count === 0) return <>{children}</>;

  const getAnimationClass = () => {
    switch (variant) {
      case "pulse":
        return "animate-pulse";
      case "bounce":
        return isAnimating ? "animate-bounce" : "";
      default:
        return "";
    }
  };

  return (
    <div className="relative inline-block">
      {children}
      <span
        className={`
          absolute -top-2 -right-2
          min-w-[20px] h-5 px-1.5
          bg-gradient-to-r from-rose-400 to-pink-400
          text-white text-xs font-bold
          rounded-full
          flex items-center justify-center
          shadow-lg shadow-rose-500/50
          ${getAnimationClass()}
          transition-all duration-300
        `}
      >
        {count > 99 ? "99+" : count}
      </span>
    </div>
  );
}

