"use client";

import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
}: AnimatedButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 hover:from-amber-500 hover:via-orange-500 hover:to-rose-500 text-white shadow-lg shadow-amber-500/30";
      case "secondary":
        return "bg-gradient-to-r from-violet-400 to-purple-400 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30";
      case "success":
        return "bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/30";
      case "danger":
        return "bg-gradient-to-r from-red-400 to-rose-400 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/30";
      case "ghost":
        return "bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:bg-white/20 text-white";
      default:
        return "bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3 text-base";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3 text-base";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-icon="button"
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        rounded-full font-bold
        transition-all duration-300 ease-out
        transform hover:scale-110 active:scale-95
        hover:shadow-2xl hover:-translate-y-1
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-amber-400/50
        ${className}
      `}
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

