import type { AppProps } from "next/app";
import PermissionManager from "@/components/PermissionManager";
import BottomNavigation from "@/components/BottomNavigation";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PermissionManager />
      <Component {...pageProps} />
      <BottomNavigation />
    </>
  );
}

