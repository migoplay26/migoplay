"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"beam" | "assemble" | "glow" | "fadeout">("beam");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("assemble"), 600);
    const t2 = setTimeout(() => setPhase("glow"), 1400);
    const t3 = setTimeout(() => setPhase("fadeout"), 2400);
    const t4 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: "1.5px",
              height: "1.5px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Blue light beam sweeping across */}
      <div
        className={`absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-blue-400 to-transparent blur-sm transition-all duration-500 shadow-[0_0_20px_8px_rgba(37,99,235,0.6)]`}
        style={{
          left: phase === "beam" ? "-5%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Wide beam glow sweep */}
      <div
        className="absolute top-0 bottom-0 w-[120px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-lg"
        style={{
          left: phase === "beam" ? "-15%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Logo assembles after beam */}
      <div
        className={`relative z-10 transition-all duration-700 ${
          phase === "beam"
            ? "opacity-0 scale-90 blur-md"
            : phase === "assemble"
            ? "opacity-100 scale-100 blur-0"
            : phase === "glow"
            ? "opacity-100 scale-105 blur-0"
            : "opacity-100 scale-100 blur-0"
        }`}
      >
        {/* Glow ring behind logo */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-700 ${
            phase === "glow"
              ? "shadow-[0_0_80px_40px_rgba(37,99,235,0.4)] opacity-100"
              : "opacity-0"
          }`}
        />

        <Image
          src="/logo.png"
          alt="MigoPlay"
          width={420}
          height={140}
          className={`object-contain transition-all duration-700 ${
            phase === "glow"
              ? "drop-shadow-[0_0_40px_rgba(37,99,235,0.9)]"
              : "drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          }`}
          priority
        />

        {/* Shimmer lines assembling */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            phase === "assemble" ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent -translate-y-4" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent translate-y-4" />
        </div>
      </div>

      {/* Shockwave ring on glow phase */}
      <div
        className={`absolute rounded-full border border-blue-500/50 transition-all duration-700 ${
          phase === "glow" || phase === "fadeout"
            ? "w-[500px] h-[500px] opacity-0"
            : phase === "assemble"
            ? "w-[200px] h-[200px] opacity-60"
            : "w-0 h-0 opacity-0"
        }`}
      />
    </div>
  );
}