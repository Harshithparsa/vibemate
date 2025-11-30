"use client";

import { useEffect, useState } from "react";

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  hoverType: "button" | "profile" | "media" | "message" | "icon" | null;
}

export default function AnimatedCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    hoverType: null,
  });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only show custom cursor on desktop
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    const updateCursor = (e: MouseEvent) => {
      setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton = target.closest("button, a, [role='button']");
      const isProfile = target.closest("[data-profile]");
      const isMedia = target.closest("[data-media]");
      const isMessage = target.closest("[data-message]");
      const isIcon = target.closest("[data-icon]");

      if (isButton && !isIcon) {
        setCursor((prev) => ({ ...prev, isHovering: true, hoverType: "button" }));
      } else if (isProfile) {
        setCursor((prev) => ({ ...prev, isHovering: true, hoverType: "profile" }));
      } else if (isMedia) {
        setCursor((prev) => ({ ...prev, isHovering: true, hoverType: "media" }));
      } else if (isMessage) {
        setCursor((prev) => ({ ...prev, isHovering: true, hoverType: "message" }));
      } else if (isIcon) {
        setCursor((prev) => ({ ...prev, isHovering: true, hoverType: "icon" }));
      } else {
        setCursor((prev) => ({ ...prev, isHovering: false, hoverType: null }));
      }
    };

    const handleMouseOut = () => {
      setCursor((prev) => ({ ...prev, isHovering: false, hoverType: null }));
    };

    if (isDesktop) {
      window.addEventListener("mousemove", updateCursor);
      document.addEventListener("mouseover", handleMouseOver, true);
      document.addEventListener("mouseout", handleMouseOut, true);
    }

    return () => {
      window.removeEventListener("mousemove", updateCursor);
      window.removeEventListener("resize", checkDesktop);
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("mouseout", handleMouseOut, true);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  const getCursorClass = () => {
    if (!cursor.isHovering) return "";
    switch (cursor.hoverType) {
      case "button":
        return "scale-150 bg-gradient-to-r from-amber-400 to-orange-400";
      case "profile":
        return "scale-125 bg-gradient-to-r from-rose-400 to-pink-400";
      case "media":
        return "scale-125 bg-gradient-to-r from-sky-400 to-blue-400";
      case "message":
        return "scale-110 bg-gradient-to-r from-violet-400 to-purple-400";
      case "icon":
        return "scale-125 bg-gradient-to-r from-emerald-400 to-teal-400";
      default:
        return "";
    }
  };

  const getTrailColor = () => {
    switch (cursor.hoverType) {
      case "button":
        return "from-amber-400 to-orange-400";
      case "profile":
        return "from-rose-400 to-pink-400";
      case "media":
        return "from-sky-400 to-blue-400";
      case "message":
        return "from-violet-400 to-purple-400";
      case "icon":
        return "from-emerald-400 to-teal-400";
      default:
        return "from-amber-200 to-orange-200";
    }
  };

  const getGlowColor = () => {
    switch (cursor.hoverType) {
      case "button":
        return "bg-amber-400";
      case "profile":
        return "bg-rose-400";
      case "media":
        return "bg-sky-400";
      case "message":
        return "bg-violet-400";
      case "icon":
        return "bg-emerald-400";
      default:
        return "bg-amber-200";
    }
  };

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={`fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] transition-all duration-300 ease-out mix-blend-difference ${
          cursor.isHovering
            ? getCursorClass()
            : "bg-gradient-to-r from-amber-200 to-orange-200"
        }`}
        style={{
          transform: `translate(${cursor.x - 8}px, ${cursor.y - 8}px)`,
        }}
      />
      
      {/* Cursor trail */}
      {cursor.isHovering && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9998] transition-all duration-500 ease-out bg-gradient-to-r ${getTrailColor()}`}
              style={{
                transform: `translate(${cursor.x - 4 - i * 3}px, ${cursor.y - 4 - i * 3}px)`,
                opacity: 0.3 - i * 0.1,
                transitionDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </>
      )}

      {/* Glow effect */}
      {cursor.isHovering && (
        <div
          className={`fixed top-0 left-0 w-20 h-20 rounded-full pointer-events-none z-[9997] opacity-20 blur-xl transition-all duration-300 ${getGlowColor()}`}
          style={{
            transform: `translate(${cursor.x - 40}px, ${cursor.y - 40}px)`,
          }}
        />
      )}
    </>
  );
}

