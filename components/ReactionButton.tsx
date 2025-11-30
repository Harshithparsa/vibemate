"use client";

import { useState } from "react";

interface ReactionButtonProps {
  emoji: string;
  count?: number;
  onClick?: () => void;
  isActive?: boolean;
}

export default function ReactionButton({
  emoji,
  count = 0,
  onClick,
  isActive = false,
}: ReactionButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      data-icon="icon"
      className={`
        relative px-3 py-1.5
        rounded-full
        bg-white/10 backdrop-blur-sm
        border-2 transition-all duration-300
        hover:bg-white/20 hover:scale-110
        active:scale-95
        ${isActive ? "border-amber-400 bg-amber-400/20" : "border-white/20"}
        ${isAnimating ? "animate-bounce" : ""}
      `}
    >
      <span className="text-lg mr-1">{emoji}</span>
      {count > 0 && (
        <span className="text-sm font-semibold text-white">{count}</span>
      )}
    </button>
  );
}

