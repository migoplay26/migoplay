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
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${phase === "fadeout" ? "opacity-0" : "opacity-100"}`}>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: "1.5px", height: "1.5px", top: Math.random() * 100 + "%", left: Math.random() * 100 + "%", opacity: Math.random() * 0.4 + 0.1 }} />
        ))}
      </div>

      {/* Light beam — uses logo purple colour */}
      <div
        className="absolute top-0 bottom-0 w-[3px] blur-sm"
        style={{
          background: "linear-gradient(to bottom, transparent, #a855f7, #ec4899, transparent)",
          boxShadow: "0 0 20px 8px rgba(168,85,247,0.5)",
          left: phase === "beam" ? "-5%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Wide glow sweep */}
      <div
        className="absolute top-0 bottom-0 w-[120px] blur-lg"
        style={{
          background: "linear-gradient(to right, transparent, rgba(168,85,247,0.15), transparent)",
          left: phase === "beam" ? "-15%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Logo */}
      <div className={`relative z-10 transition-all duration-700 ${
        phase === "beam" ? "opacity-0 scale-90 blur-md"
        : phase === "assemble" ? "opacity-100 scale-100 blur-0"
        : phase === "glow" ? "opacity-100 scale-105 blur-0"
        : "opacity-100 scale-100 blur-0"
      }`}>
        <div className={`absolute inset-0 rounded-full transition-all duration-700 ${
          phase === "glow" ? "opacity-100" : "opacity-0"
        }`}
          style={{ boxShadow: "0 0 80px 40px rgba(168,85,247,0.3)" }}
        />

        <Image src="/logo.png" alt="MigoPlay" width={420} height={140}
          className={`object-contain transition-all duration-700 ${
            phase === "glow"
              ? "drop-shadow-[0_0_40px_rgba(168,85,247,0.9)]"
              : "drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          }`}
          priority
        />

        {/* Shimmer lines */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${phase === "assemble" ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-4"
            style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)" }} />
          <div className="absolute top-1/2 left-0 right-0 h-px translate-y-4"
            style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.3), transparent)" }} />
        </div>
      </div>

      {/* Shockwave ring */}
      <div className={`absolute rounded-full border transition-all duration-700 ${
        phase === "glow" || phase === "fadeout" ? "w-[500px] h-[500px] opacity-0"
        : phase === "assemble" ? "w-[200px] h-[200px] opacity-50"
        : "w-0 h-0 opacity-0"
      }`}
        style={{ borderColor: "rgba(168,85,247,0.4)" }}
      />
    </div>
  );
}