import { useRouter } from "next/router";
import Link from "next/link";
import AnimatedIcon from "./AnimatedIcon";
import Tooltip from "./Tooltip";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: "🏠", label: "Home", exact: true },
  { href: "/network", icon: "👥", label: "Network" },
  { href: "/discover", icon: "🔍", label: "Discover" },
  { href: "/messages", icon: "💬", label: "Messages" },
  { href: "/profile", icon: "👤", label: "Profile" },
];

export default function BottomNavigation() {
  const router = useRouter();

  // Hide bottom nav on auth pages
  const hideNavPaths = ["/auth", "/onboarding"];
  const shouldHide = hideNavPaths.some((path) => router.pathname.startsWith(path));

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  if (shouldHide) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-amber-200/50 dark:border-gray-700/50 z-50 shadow-2xl md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Tooltip key={item.href} content={item.label} position="top">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
                  active
                    ? "text-amber-600 dark:text-amber-400 scale-110"
                    : "text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-500"
                }`}
              >
                <AnimatedIcon
                  icon={item.icon}
                  className={`text-2xl ${active ? "animate-bounce" : ""}`}
                />
                <span
                  className={`text-xs font-semibold mt-1 ${
                    active ? "opacity-100" : "opacity-70"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-b-full"></div>
                )}
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}

