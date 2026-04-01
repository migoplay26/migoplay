"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function playWhooshTone() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Whoosh — filtered noise
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const whoosh = ctx.createBufferSource();
    whoosh.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.5);
    filter.Q.value = 0.8;

    const whooshGain = ctx.createGain();
    whooshGain.gain.setValueAtTime(0, ctx.currentTime);
    whooshGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.2);
    whooshGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

    whoosh.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whoosh.start(ctx.currentTime);
    whoosh.stop(ctx.currentTime + 1.2);

    // Cinematic tone
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, ctx.currentTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);

    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0, ctx.currentTime + 0.5);
    toneGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.7);
    toneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

    const reverb = ctx.createConvolver();
    const reverbBuffer = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = reverbBuffer.getChannelData(c);
      for (let i = 0; i < d.length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
      }
    }
    reverb.buffer = reverbBuffer;

    osc.connect(toneGain);
    toneGain.connect(reverb);
    reverb.connect(ctx.destination);
    toneGain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.5);
    osc.stop(ctx.currentTime + 2);

  } catch (e) {
    console.log("Audio not available:", e);
  }
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"waiting" | "beam" | "assemble" | "glow" | "fadeout">("waiting");

  useEffect(() => {
    // Listen for first user interaction
    function handleFirstInteraction() {
      // Remove listeners immediately so it only fires once
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);

      // Play sound
      playWhooshTone();

      // Start animation
      setPhase("beam");

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
    }

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${phase === "fadeout" ? "opacity-0" : "opacity-100"}`}>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: "1.5px", height: "1.5px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.4 + 0.1,
            }} />
        ))}
      </div>

      {/* Tap to start hint — only shows while waiting */}
      <div className={`absolute bottom-16 left-0 right-0 text-center transition-opacity duration-500 ${phase === "waiting" ? "opacity-100" : "opacity-0"}`}>
        <p className="text-xs text-gray-600 tracking-widest uppercase animate-pulse">
          Tap anywhere to begin
        </p>
      </div>

      {/* Blue light beam */}
      <div
        className="absolute top-0 bottom-0 w-[3px] blur-sm"
        style={{
          background: "linear-gradient(to bottom, transparent, #a855f7, #ec4899, transparent)",
          boxShadow: "0 0 20px 8px rgba(168,85,247,0.5)",
          left: phase === "beam" ? "-5%" : phase === "waiting" ? "-5%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Wide glow sweep */}
      <div
        className="absolute top-0 bottom-0 w-[120px] blur-lg"
        style={{
          background: "linear-gradient(to right, transparent, rgba(168,85,247,0.15), transparent)",
          left: phase === "beam" ? "-15%" : phase === "waiting" ? "-15%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Logo */}
      <div className={`relative z-10 transition-all duration-700 ${
        phase === "waiting" || phase === "beam"
          ? "opacity-0 scale-90 blur-md"
          : phase === "assemble"
          ? "opacity-100 scale-100 blur-0"
          : phase === "glow"
          ? "opacity-100 scale-105 blur-0"
          : "opacity-100 scale-100 blur-0"
      }`}>
        <div
          className={`absolute inset-0 rounded-full transition-all duration-700 ${phase === "glow" ? "opacity-100" : "opacity-0"}`}
          style={{ boxShadow: "0 0 80px 40px rgba(168,85,247,0.3)" }}
        />

        <Image
          src="/logo.png"
          alt="MigoPlay"
          width={420}
          height={140}
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
        phase === "glow" || phase === "fadeout"
          ? "w-[500px] h-[500px] opacity-0"
          : phase === "assemble"
          ? "w-[200px] h-[200px] opacity-50"
          : "w-0 h-0 opacity-0"
      }`}
        style={{ borderColor: "rgba(168,85,247,0.4)" }}
      />
    </div>
  );
}