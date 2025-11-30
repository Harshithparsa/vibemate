"use client";

interface VibeMateLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function VibeMateLogo({ size = "md", showText = true, className = "" }: VibeMateLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Circle with M */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          
          {/* Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#logoGradient)"
            strokeWidth="4"
          />
          
          {/* Letter M */}
          <path
            d="M 30 70 L 30 30 L 40 30 L 50 50 L 60 30 L 70 30 L 70 70 L 60 70 L 60 45 L 50 60 L 40 45 L 40 70 Z"
            fill="url(#logoGradient)"
          />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-bold text-white ${textSizes[size]}`}>
          VibeMate
        </span>
      )}
    </div>
  );
}

