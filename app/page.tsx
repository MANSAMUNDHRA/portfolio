"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [slide, setSlide] = useState(1);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSlide(2), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (slide !== 2) return;

    const typingSpeed = 100;
    const backspaceSpeed = 50;
    const pauseBetween = 500;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 0) {
      // Type "Hey,"
      const target = "Hey,";
      if (charIndex < target.length) {
        timeout = setTimeout(() => {
          setLine1(target.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => { setPhase(1); setCharIndex(0); }, pauseBetween);
      }

    } else if (phase === 1) {
      // Type "I'm Clueless" on line 2
      const target = "I'm Clueless";
      if (charIndex < target.length) {
        timeout = setTimeout(() => {
          setLine2(target.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => { setPhase(2); setCharIndex(target.length); }, pauseBetween * 2);
      }

    } else if (phase === 2) {
      // Backspace "I'm Clueless" on line 2
      const target = "I'm Clueless";
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setLine2(target.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, backspaceSpeed);
      } else {
        timeout = setTimeout(() => { setPhase(3); setCharIndex(0); }, pauseBetween);
      }

    } else if (phase === 3) {
      // Type "I'm Mansha" on line 2
      const target = "I'm Mansha";
      if (charIndex < target.length) {
        timeout = setTimeout(() => {
          setLine2(target.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, charIndex, slide]);

  return (
    <div className="relative h-screen w-screen flex justify-center items-center overflow-hidden bg-black">

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" style={{ zIndex: 1 }} />

      {/* Single group — circle + skull + gear move together */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: slide === 1 ? "calc(50% - 420px)" : "-140px",
          transition: "right 1.5s ease-in-out",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Golden Circle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "30%",
            transform: "translate(-20%, -50%)",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, #FFE000 0%, #FFA500 35%, #cc5500 65%, #3a0a00 85%, transparent 100%)",
            filter: "blur(5px)",
            zIndex: 1,
          }}
        />

        {/* Skull */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Image
            src="/skull.png"
            alt="Skull"
            width={2000}
            height={3000}
            style={{ height: "130vh", width: "auto", objectFit: "contain" }}
            priority
          />
        </div>

        {/* Gear */}
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "55%",
            marginLeft: "-75px",
            marginTop: "-75px",
            zIndex: 3,
          }}
        >
          <img
            src="/gear.png"
            alt="Gear"
            width={150}
            height={150}
            className="spin-gear"
          />
        </div>
      </div>

      {/* Text — left side */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30,
          opacity: slide === 2 ? 1 : 0,
          transition: "opacity 1.2s ease-in-out 0.8s",
          display: "flex",
          flexDirection: "column",
          gap: "0px",
        }}
      >
        <h1
          className="text-white font-bold uppercase"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)",
            letterSpacing: "0.05em",
            lineHeight: 1.1,
            fontFamily: "monospace",
            textShadow: "0 0 40px rgba(255,160,0,0.5)",
          }}
        >
          {/* Line 1 — always "Hey," once typed */}
          <span style={{ display: "block" }}>
            {line1}{phase === 0 && <span className="animate-pulse">|</span>}
          </span>
          {/* Line 2 — "I'm Clueless" / "I'm Mansha" */}
          <span style={{ display: "block", minHeight: "1.1em" }}>
            {line2}{phase !== 0 && <span className="animate-pulse">|</span>}
          </span>
        </h1>

        <div
          style={{
            width: "60px",
            height: "2px",
            background: "linear-gradient(to right, #FFA500, transparent)",
            marginTop: "16px",
          }}
        />
      </div>

    </div>
  );
}