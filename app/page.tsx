"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [slide, setSlide] = useState(1);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Preload main page assets during loading
  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure smooth transition
      const readyTimer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(readyTimer);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isReady) return;

    const handleScroll = (e: WheelEvent) => {
      if (slide === 1 && e.deltaY > 0) {
        setSlide(2);
      }
    };

    // Touch support
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (slide === 1 && delta > 50) setSlide(2);
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [slide, isReady]);

  useEffect(() => {
    if (slide !== 2 || !isReady) return;

    const typingSpeed = 100;
    const backspaceSpeed = 50;
    const pauseBetween = 500;

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 0) {
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
      const target = "I'm Mansha";
      if (charIndex < target.length) {
        timeout = setTimeout(() => {
          setLine2(target.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, charIndex, slide, isReady]);

  // Show loading page first
  if (isLoading) {
    return <Loading onLoadingComplete={handleLoadingComplete} />;
  }

  // Main Page - only render fully when ready
  return (
    <div 
      className="relative h-screen w-screen flex justify-center items-center overflow-hidden bg-black"
      style={{
        opacity: isReady ? 1 : 0,
        transition: "opacity 0.3s ease-in-out"
      }}
    >
      {/* Preload images in background during loading */}
      {isLoading && (
        <div style={{ display: "none" }}>
          <Image src="/skull.png" alt="preload" width={1} height={1} />
          <img src="/gear.png" alt="preload" width={1} height={1} />
        </div>
      )}

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

      {/* Scroll indicator — bottom left, only on slide 1 */}
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "32px",
          zIndex: 30,
          opacity: slide === 1 ? 1 : 0,
          transition: "opacity 0.6s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {/* Animated mouse icon */}
        <div
          style={{
            width: "20px",
            height: "32px",
            border: "2px solid rgba(255,255,255,0.4)",
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "3px",
              height: "6px",
              background: "rgba(255,200,80,0.8)",
              borderRadius: "2px",
              position: "absolute",
              top: "5px",
              left: "50%",
              transform: "translateX(-50%)",
              animation: "scrollDot 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          scroll
        </p>
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
          <span style={{ display: "block" }}>
            {line1}{phase === 0 && <span className="animate-pulse">|</span>}
          </span>
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