"use client";

import { useEffect, useState, useRef } from "react";

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

// Shard positions — each shard starts scattered in 3D space and assembles to centre
const SHARDS = [
  { id: 0, w: 45, h: 55, tx: -280, ty: -180, tz: -400, rx: 45, ry: -60, rz: 20, delay: 0 },
  { id: 1, w: 55, h: 45, tx: 260, ty: -160, tz: -350, rx: -30, ry: 70, rz: -15, delay: 60 },
  { id: 2, w: 50, h: 60, tx: -200, ty: 200, tz: -500, rx: 60, ry: 30, rz: 25, delay: 120 },
  { id: 3, w: 40, h: 50, tx: 300, ty: 180, tz: -300, rx: -45, ry: -50, rz: -20, delay: 80 },
  { id: 4, w: 60, h: 40, tx: -350, ty: 0, tz: -450, rx: 20, ry: 80, rz: 10, delay: 40 },
  { id: 5, w: 35, h: 55, tx: 350, ty: -80, tz: -380, rx: -60, ry: -40, rz: 30, delay: 100 },
  { id: 6, w: 50, h: 35, tx: 0, ty: -280, tz: -420, rx: 70, ry: 20, rz: -25, delay: 20 },
  { id: 7, w: 45, h: 50, tx: -120, ty: 260, tz: -360, rx: -35, ry: 60, rz: 15, delay: 140 },
  { id: 8, w: 55, h: 45, tx: 180, ty: 240, tz: -480, rx: 50, ry: -30, rz: -10, delay: 90 },
  { id: 9, w: 40, h: 60, tx: -300, ty: -100, tz: -320, rx: -25, ry: -70, rz: 35, delay: 50 },
  { id: 10, w: 60, h: 40, tx: 240, ty: 100, tz: -440, rx: 40, ry: 50, rz: -30, delay: 110 },
  { id: 11, w: 45, h: 45, tx: 100, ty: -300, tz: -400, rx: -55, ry: 25, rz: 20, delay: 70 },
];

type Phase = "waiting" | "shards" | "assemble" | "glow" | "fadeout";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [assembled, setAssembled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function addTimer(fn: () => void, delay: number) {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
    return t;
  }

  useEffect(() => {
    async function handleFirstInteraction() {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);

      await playWhooshTone();

      // Phase 1: show shards scattered
      setPhase("shards");

      // Phase 2: assemble shards
      addTimer(() => setAssembled(true), 400);

      // Phase 3: logo appears with glow
      addTimer(() => setPhase("assemble"), 1800);

      // Phase 4: full glow
      addTimer(() => setPhase("glow"), 2400);

      // Phase 5: fade out
      addTimer(() => setPhase("fadeout"), 3400);

      // Done
      addTimer(() => onComplete(), 4000);
    }

    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("touchstart", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      clearTimers();
    };
  }, [onComplete]);

  const isAssembling = assembled && phase === "shards";
  const showLogo = phase === "assemble" || phase === "glow" || phase === "fadeout";
  const showGlow = phase === "glow" || phase === "fadeout";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${
        phase === "fadeout" ? "opacity-0" : "opacity-100"
      }`}
      style={{ perspective: "1000px" }}
    >
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.8 ? "2px" : "1px",
              height: Math.random() > 0.8 ? "2px" : "1px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Tap to start */}
      <div className={`absolute bottom-16 left-0 right-0 text-center transition-opacity duration-500 pointer-events-none ${
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

      {/* 3D Shards container */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
          phase === "shards" ? "opacity-100" : "opacity-0"
        }`}
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        <div style={{ position: "relative", width: "300px", height: "100px" }}>
          {SHARDS.map((shard) => (
            <div
              key={shard.id}
              style={{
                position: "absolute",
                width: shard.w + "%",
                height: shard.h + "px",
                background: isAssembling
                  ? `linear-gradient(${shard.id * 30}deg, rgba(168,85,247,0.8), rgba(236,72,153,0.6), rgba(251,191,36,0.4))`
                  : `linear-gradient(${shard.id * 30}deg, rgba(168,85,247,0.4), rgba(236,72,153,0.3))`,
                top: "50%",
                left: "50%",
                borderRadius: "2px",
                boxShadow: isAssembling
                  ? "0 0 20px rgba(168,85,247,0.6), 0 0 40px rgba(236,72,153,0.3)"
                  : "0 0 10px rgba(168,85,247,0.3)",
                transform: isAssembling
                  ? `translate(-50%, -50%) translate3d(${shard.tx * 0.1}px, ${shard.ty * 0.1}px, ${shard.tz * 0.1}px) rotateX(${shard.rx * 0.1}deg) rotateY(${shard.ry * 0.1}deg) rotateZ(${shard.rz * 0.1}deg)`
                  : `translate(-50%, -50%) translate3d(${shard.tx}px, ${shard.ty}px, ${shard.tz}px) rotateX(${shard.rx}deg) rotateY(${shard.ry}deg) rotateZ(${shard.rz}deg)`,
                transition: isAssembling
                  ? `transform ${1.2 + shard.delay * 0.003}s cubic-bezier(0.16, 1, 0.3, 1) ${shard.delay * 0.5}ms, box-shadow 0.8s ease, background 0.8s ease`
                  : "none",
                clipPath: shard.id % 3 === 0
                  ? "polygon(0 0, 100% 0, 85% 100%, 15% 100%)"
                  : shard.id % 3 === 1
                  ? "polygon(15% 0, 85% 0, 100% 100%, 0 100%)"
                  : "polygon(0 15%, 100% 0, 100% 85%, 0 100%)",
              }}
            />
          ))}

          {/* Centre glow as shards assemble */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isAssembling ? "300px" : "0px",
              height: isAssembling ? "120px" : "0px",
              background: "radial-gradient(ellipse, rgba(168,85,247,0.4) 0%, transparent 70%)",
              transition: "all 1.5s ease",
              borderRadius: "50%",
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>

      {/* Logo — appears after shards assemble */}
      <div
        className={`relative z-10 transition-all duration-700 ${
          showLogo
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-75 blur-sm"
        }`}
        style={{
          transform: showLogo
            ? "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
            : "perspective(800px) rotateX(15deg) rotateY(-10deg) scale(0.75)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Glow behind logo */}
        {showGlow && (
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              boxShadow: "0 0 100px 50px rgba(168,85,247,0.35)",
              borderRadius: "50%",
            }}
          />
        )}

        {/* Logo image */}
        <img
          src="/logo.png"
          alt="MigoPlay"
          width={380}
          height={130}
          style={{
            objectFit: "contain",
            filter: showGlow
              ? "drop-shadow(0 0 40px rgba(168,85,247,0.9)) drop-shadow(0 0 20px rgba(236,72,153,0.6))"
              : "drop-shadow(0 0 15px rgba(168,85,247,0.5))",
            transition: "filter 0.8s ease",
            maxWidth: "80vw",
          }}
        />

        {/* Shimmer lines */}
        {showLogo && (
          <div className="absolute inset-0">
            <div
              className="absolute left-0 right-0 h-px"
              style={{
                top: "40%",
                background: "linear-gradient(to right, transparent, rgba(168,85,247,0.6), transparent)",
                animation: "shimmer 2s ease infinite",
              }}
            />
            <div
              className="absolute left-0 right-0 h-px"
              style={{
                top: "60%",
                background: "linear-gradient(to right, transparent, rgba(236,72,153,0.4), transparent)",
              }}
            />
          </div>
        )}
      </div>

      {/* Shockwave ring */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          borderColor: "rgba(168,85,247,0.5)",
          width: showGlow ? "600px" : phase === "assemble" ? "250px" : "0px",
          height: showGlow ? "600px" : phase === "assemble" ? "250px" : "0px",
          opacity: showGlow ? 0 : phase === "assemble" ? 0.6 : 0,
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Second ring */}
      <div
        className="absolute rounded-full border pointer-events-none"
        style={{
          borderColor: "rgba(236,72,153,0.3)",
          width: showGlow ? "800px" : phase === "assemble" ? "150px" : "0px",
          height: showGlow ? "800px" : phase === "assemble" ? "150px" : "0px",
          opacity: showGlow ? 0 : phase === "assemble" ? 0.4 : 0,
          transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
        }}
      />

      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}