"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

async function playWhooshTone() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") await ctx.resume();

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
    whooshGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.2);
    whooshGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    whoosh.connect(filter);
    filter.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whoosh.start(ctx.currentTime);
    whoosh.stop(ctx.currentTime + 1.2);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, ctx.currentTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.0);
    const toneGain = ctx.createGain();
    toneGain.gain.setValueAtTime(0, ctx.currentTime + 0.5);
    toneGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.7);
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
  const [started, setStarted] = useState(false);

  async function handleTap() {
    if (started) return;
    setStarted(true);

    await playWhooshTone();

    setPhase("beam");

    setTimeout(() => setPhase("assemble"), 600);
    setTimeout(() => setPhase("glow"), 1400);
    setTimeout(() => setPhase("fadeout"), 2400);
    setTimeout(() => onComplete(), 3000);
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onClick={handleTap}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleTap();
      }}
      style={{ cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
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
              opacity: Math.random() * 0.4 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Tap to start hint */}
      <div className={`absolute bottom-16 left-0 right-0 text-center pointer-events-none transition-opacity duration-500 ${
        phase === "waiting" ? "opacity-100" : "opacity-0"
      }`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
            <div className="w-4 h-4 rounded-full bg-white/30" />
          </div>
          <p className="text-xs text-gray-500 tracking-widest uppercase">
            Tap anywhere to begin
          </p>
        </div>
      </div>

      {/* Light beam */}
      <div
        className="absolute top-0 bottom-0 w-[3px] blur-sm pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #a855f7, #ec4899, transparent)",
          boxShadow: "0 0 20px 8px rgba(168,85,247,0.5)",
          left: phase === "beam" ? "-5%" : phase === "waiting" ? "-5%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Wide glow */}
      <div
        className="absolute top-0 bottom-0 w-[120px] blur-lg pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent, rgba(168,85,247,0.15), transparent)",
          left: phase === "beam" ? "-15%" : phase === "waiting" ? "-15%" : "110%",
          transition: phase === "beam" ? "left 0.6s ease-in" : "left 0.5s ease-out",
        }}
      />

      {/* Logo */}
      <div
        className={`relative z-10 pointer-events-none transition-all duration-700 ${
          phase === "waiting" || phase === "beam"
            ? "opacity-0 scale-90 blur-md"
            : phase === "assemble"
            ? "opacity-100 scale-100 blur-0"
            : phase === "glow"
            ? "opacity-100 scale-105 blur-0"
            : "opacity-100 scale-100 blur-0"
        }`}
      >
        <div
          className={`absolute inset-0 rounded-full transition-all duration-700 ${
            phase === "glow" ? "opacity-100" : "opacity-0"
          }`}
          style={{ boxShadow: "0 0 80px 40px rgba(168,85,247,0.3)" }}
        />

        <img
          src="/logo.png"
          alt="MigoPlay"
          style={{
            width: "min(420px, 80vw)",
            height: "auto",
            objectFit: "contain",
            filter: phase === "glow"
              ? "drop-shadow(0 0 40px rgba(168,85,247,0.9))"
              : "drop-shadow(0 0 15px rgba(168,85,247,0.4))",
            transition: "filter 0.7s ease",
          }}
        />

        {/* Shimmer lines */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          phase === "assemble" ? "opacity-100" : "opacity-0"
        }`}>
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-4"
            style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)" }} />
          <div className="absolute top-1/2 left-0 right-0 h-px translate-y-4"
            style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.3), transparent)" }} />
        </div>
      </div>

      {/* Shockwave ring */}
      <div
        className="absolute rounded-full border pointer-events-none transition-all duration-700"
        style={{
          borderColor: "rgba(168,85,247,0.4)",
          width: phase === "glow" || phase === "fadeout" ? "500px"
            : phase === "assemble" ? "200px" : "0px",
          height: phase === "glow" || phase === "fadeout" ? "500px"
            : phase === "assemble" ? "200px" : "0px",
          opacity: phase === "glow" || phase === "fadeout" ? 0
            : phase === "assemble" ? 0.5 : 0,
        }}
      />
    </div>
  );
}