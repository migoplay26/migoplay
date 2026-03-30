"use client";

import "./globals.css";
import Protected from "./protected";
import SplashScreen from "./components/SplashScreen";
import { useState, useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Only show splash once per browser session
    const seen = sessionStorage.getItem("splashSeen");
    if (!seen) {
      setShowSplash(true);
    }
  }, []);

  function handleSplashComplete() {
    sessionStorage.setItem("splashSeen", "true");
    setShowSplash(false);
  }

  return (
    <html lang="en">
      <body>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <Protected>{children}</Protected>
      </body>
    </html>
  );
}