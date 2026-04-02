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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show splash once per session
    const seen = sessionStorage.getItem("splashSeen");
    if (!seen) {
      setShowSplash(true);
    }
  }, []);

  function handleSplashComplete() {
    sessionStorage.setItem("splashSeen", "true");
    setShowSplash(false);
  }

  // Don't render anything until mounted to avoid hydration issues on mobile
  if (!mounted) {
    return (
      <html lang="en">
        <body style={{ backgroundColor: "#0a0a0f", margin: 0 }}>
          <div style={{
            minHeight: "100vh",
            backgroundColor: "#0a0a0f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "2px solid rgba(168,85,247,0.3)",
              borderTopColor: "#a855f7",
              animation: "spin 1s linear infinite"
            }} />
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0a0a0f", margin: 0 }}>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; }
        `}</style>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        {!showSplash && (
          <Protected>{children}</Protected>
        )}
      </body>
    </html>
  );
}