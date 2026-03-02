"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import useWindowSize from '@/hooks/useWindowSize';

const allProjects = [
  {
    id: 1, type: "fullstack", name: "PolyCode-AI",
    tagline: "AI-powered code generation platform with real-time execution",
     status: "completed",
    liveDemo: "https://polycode-ai.onrender.com",
    github: "https://github.com/MANSAMUNDHRA/PolyCode-AI",
    image: "/polycode.png",
    tags: ["Node.js", "Express", "MongoDB", "HuggingFace"],
    description: `A full-stack AI-powered code generation and execution platform — built from scratch with Node.js, Express, MongoDB, JWT authentication, and the Hugging Face Inference API.`,
    uniqueFeature: "Real-time token-by-token streaming with Server-Sent Events and in-browser code execution with sandboxing",
    techStack: ["Node.js 18+", "Express.js 5", "MongoDB + Mongoose", "JWT + bcryptjs", "Hugging Face API", "Server-Sent Events", "Vanilla JS"],
  },
  {
    id: 2, type: "android", name: "ASHAConnect",
    tagline: "PHC Management System built for rural India",
    year: "2024", status: "completed",
    liveDemo: null,
    github: "https://github.com/MANSAMUNDHRA/ASHACONNET.git",
    apk: "https://github.com/MANSAMUNDHRA/ASHACONNET/releases",
    image: "/ashaconnect.png",
    tags: ["Android", "Java", "Firebase", "Material Design"],
    description: `A production-grade Android application for India's National Health Mission, designed to digitize and streamline Primary Health Center (PHC) operations.`,
    uniqueFeature: "Offline-first architecture with intelligent merge conflict resolution — works without internet and syncs automatically when connection returns",
    techStack: ["Native Android (Java)", "Material Design 3", "Firebase Realtime DB", "Firebase Auth", "Gson"],
  },
  {
    id: 3, type: "fullstack", name: "CodeNow Classroom",
    tagline: "Stealth chat system hiding messages inside C++ code",
    year: "2024", status: "completed",
    liveDemo: "https://codenow.binny.house/",
    github: "https://github.com/MANSAMUNDHRA/CodeNow-Classroom",
    image: "/chatform.png",
    tags: ["Node.js", "Vanilla JS", "REST API"],
    description: `A stealthy, terminal-style real-time chat system where messages look like complex C++ programs but secretly carry human-readable communication inside them.`,
    uniqueFeature: "Messages are embedded inside valid-looking C++ code using 10+ templates — looks like debugging to outsiders, insiders decrypt with one click",
    techStack: ["Node.js", "Vanilla JS", "HTML/CSS", "REST API"],
  },
  {
    id: 4, type: "web", name: "FixMySociety",
    tagline: "Civic issue reporting platform — 2nd Prize SIH",
    year: "2024", status: "completed",
    liveDemo: "https://fix-my-society.vercel.app/",
    github: "https://github.com/MANSAMUNDHRA/fix-my-society",
    image: "/fixmysociety.png",
    tags: ["HTML", "CSS", "JavaScript"],
    description: `🥈 2nd Prize at KIIT Internal Smart India Hackathon. A civic platform where citizens report issues and administrators resolve them.`,
    uniqueFeature: "Admin dashboard, photo uploads, voice notes, and anonymous submissions in a complete civic management system",
    techStack: ["HTML5", "CSS3", "JavaScript", "JSON", "Local Storage"],
  },
  {
    id: 5, type: "ml", name: "Card Model",
    tagline: "Deep learning for Nifty 50 using CARD architecture",
    year: "2025", status: "in-progress",
    liveDemo: null,
    github: "https://github.com/MANSAMUNDHRA/ARD-Stock-Prediction",
    image: "/stock.jpg",
    tags: ["Python", "PyTorch", "Time Series"],
    description: `Deep learning-based stock price prediction using Channel Aligned Robust Blend Transformer (CARD) for Nifty 50 stocks.`,
    uniqueFeature: "Dual attention mechanism and multi-task learning for simultaneous returns and volatility prediction",
    techStack: ["Python 3.10", "PyTorch 2.1", "NumPy", "Pandas", "Fyers API"],
    progress: "70%",
  },
  {
    id: 6, type: "ml", name: "AI Offline Therapist",
    tagline: "Mental wellness companion — 100% on-device, no internet",
    year: "2025", status: "coming-soon",
    liveDemo: null, github: null,
    image: "/therapy.jpg",
    tags: ["On-device AI", "React Native"],
    description: `A private, offline-first AI therapist that runs entirely on-device. No data leaves your phone, complete privacy.`,
    uniqueFeature: "100% offline LLM with no internet required — complete privacy and zero cloud costs",
    techStack: ["TensorFlow Lite", "React Native", "Local embeddings"],
    progress: "0%",
  },
];

const STATUS = {
  completed:     { label: "Completed",   bg: "#f0e6d3", text: "#3d0c0c" },
  "in-progress": { label: "In Progress", bg: "#3d0c0c", text: "#f0e6d3" },
  "coming-soon": { label: "Coming Soon", bg: "#5a2e2e", text: "#f0e6d3" },
};

export type ProjectItem = typeof allProjects[0];

export default function ProjectsPage({
  onExitToTools,
  onScrollDown,
  onOpenProject,
}: {
  onExitToTools?: () => void;
  onScrollDown?: () => void;
  onOpenProject?: (p: ProjectItem) => void;
}) {
  const [active, setActive] = useState(2);
  const [visible, setVisible] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  
  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Handle touch events for swipe
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const swipeThreshold = 50;
      const diff = touchStartX.current - touchEndX.current;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left -> next project
          setActive(prev => Math.min(prev + 1, allProjects.length - 1));
        } else {
          // Swipe right -> previous project
          setActive(prev => Math.max(prev - 1, 0));
        }
      }
      
      // Reset
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Arrow keys
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive(prev => Math.min(prev + 1, allProjects.length - 1));
      if (e.key === "ArrowLeft")  setActive(prev => Math.max(prev - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getCardStyle = (idx: number) => {
    if (isMobile) {
      const diff = idx - active;
      return {
        transform: `translateX(${diff * 20}px) scale(${idx === active ? 1 : 0.9})`,
        opacity: idx === active ? 1 : 0.5,
        zIndex: 10 - Math.abs(diff),
        transition: "all 0.4s ease",
      };
    }
    
    const diff = idx - active;
    const absDiff = Math.abs(diff);
    const xOffset = diff * 200;
    const zOffset = absDiff === 0 ? 0 : absDiff === 1 ? -120 : absDiff === 2 ? -260 : -380;
    const rotateY = diff * -38;
    const scale = absDiff === 0 ? 1 : absDiff === 1 ? 0.82 : absDiff === 2 ? 0.68 : 0.56;
    const opacity = absDiff === 0 ? 1 : absDiff === 1 ? 0.75 : absDiff === 2 ? 0.5 : 0.3;
    const zIndex = 10 - absDiff;

    return {
      transform: `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
      transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    };
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#0e0d0d",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      position: "relative",
      fontFamily: "monospace",
    }}>

      {/* Radial glow */}
      <div style={{
        position: "absolute", bottom: "-80px", left: "50%",
        transform: "translateX(-50%)",
        width: "700px", height: "300px", borderRadius: "50%",
        background: `radial-gradient(ellipse, ${active % 2 === 0 ? "#f0e6d3" : "#3d0c0c"}40 0%, transparent 70%)`,
        transition: "background 0.6s ease",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        padding: isMobile ? "16px 20px 8px" : "28px 56px 8px",
        flexShrink: 0, zIndex: 5, position: "relative",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.2s",
      }}>
        <p style={{ fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#f0e6d3", margin: "0 0 4px" }}>selected work</p>
        <h1 style={{ fontSize: "clamp(1.6rem, 2.2vw, 2rem)", fontWeight: 900, color: "#f0e6d3", margin: 0, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
          Projects
        </h1>
      </div>

      {/* 3D Stage */}
      <div style={{
        flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
        perspective: isMobile ? "none" : "1200px",
        perspectiveOrigin: "50% 45%",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease 0.4s",
      }}>
        <div style={{
          position: "relative",
          width: isMobile ? "280px" : "320px",
          height: isMobile ? "350px" : "400px",
          transformStyle: isMobile ? "flat" : "preserve-3d",
        }}>
          {allProjects.map((project, idx) => {
            const cardStyle = getCardStyle(idx);
            const isActive  = idx === active;
            const cardBg    = idx % 2 === 0 ? "#f0e6d3" : "#3d0c0c";
            const textColor = idx % 2 === 0 ? "#3d0c0c" : "#f0e6d3";
            const s         = STATUS[project.status as keyof typeof STATUS];

            return (
              <div
                key={project.id}
                onClick={() => isActive ? onOpenProject?.(project) : setActive(idx)}
                style={{
                  position: "absolute", top: 0, left: 0,
                  width: "320px",
                  height: "400px",
                  borderRadius: "20px",
                  background: cardBg,
                  border: `1px solid ${isActive ? "#f0e6d380" : "#f0e6d340"}`,
                  cursor: isActive ? "pointer" : "pointer",
                  overflow: "hidden",
                  boxShadow: isActive
                    ? "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px #f0e6d330"
                    : "0 20px 60px rgba(0,0,0,0.5)",
                  ...cardStyle,
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: "linear-gradient(to right, #f0e6d3, #f0e6d340, transparent)",
                }} />

                {/* Corner glow */}
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: "120px", height: "120px",
                  background: "radial-gradient(circle at 0% 0%, #f0e6d320, transparent 70%)",
                  pointerEvents: "none",
                }} />

                {/* Hero image */}
                <div style={{ height: "165px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                  <Image src={project.image} alt={project.name} fill
                    style={{ objectFit: "cover", opacity: 0.85 }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${cardBg} 0%, transparent 60%)` }} />
                  {/* Status badge */}
                  <div style={{
                    position: "absolute", top: "10px", left: "10px",
                    background: s.bg, color: s.text,
                    fontSize: "0.38rem", fontFamily: "monospace", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "3px 9px", borderRadius: "20px",
                  }}>{s.label}</div>
                  {/* Year */}
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    color: textColor, fontSize: "0.38rem", fontFamily: "monospace",
                    background: idx % 2 === 0 ? "rgba(61,12,12,0.7)" : "rgba(240,230,211,0.7)",
                    padding: "3px 8px", borderRadius: "20px",
                  }}>{project.year}</div>
                </div>

                {/* Card body */}
                <div style={{ padding: "14px 18px 18px", display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                  {/* Type label */}
                  <span style={{ fontSize: "0.42rem", letterSpacing: "0.22em", textTransform: "uppercase", color: textColor, opacity: 0.6 }}>
                    {project.type}
                  </span>

                  {/* Name */}
                  <h3 style={{ color: textColor, fontSize: "1.05rem", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.2 }}>
                    {project.name}
                  </h3>

                  {/* Tagline */}
                  <p style={{ color: textColor, fontSize: "0.58rem", lineHeight: 1.5, margin: 0, fontFamily: "monospace", opacity: 0.8,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {project.tagline}
                  </p>

                  {/* Divider */}
                  <div style={{ height: "1px", background: `linear-gradient(to right, ${textColor}50, transparent)`, margin: "2px 0" }} />

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} style={{
                        background: idx % 2 === 0 ? "rgba(61,12,12,0.12)" : "rgba(240,230,211,0.12)",
                        color: textColor, padding: "3px 8px", borderRadius: "20px",
                        fontSize: "0.38rem", fontFamily: "monospace",
                        border: `1px solid ${idx % 2 === 0 ? "rgba(61,12,12,0.15)" : "rgba(240,230,211,0.15)"}`,
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Open hint on active card */}
                  {isActive && (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "auto" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.38rem", letterSpacing: "0.12em", textTransform: "uppercase", color: textColor, fontWeight: 700 }}>Open</span>
                      <span style={{ color: textColor, fontSize: "0.6rem" }}>→</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot navigation */}
      <div style={{
        display: "flex", justifyContent: "center", gap: "8px",
        paddingBottom: "24px", zIndex: 5, position: "relative",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.7s",
      }}>
        {allProjects.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            style={{
              width: idx === active ? "22px" : "6px",
              height: "6px", borderRadius: "3px",
              border: "none",
              background: idx === active ? "#f0e6d3" : "#f0e6d340",
              cursor: "pointer", padding: 0,
              transition: "all 0.4s ease",
              boxShadow: idx === active ? "0 0 8px #f0e6d360" : "none",
            }}
          />
        ))}
      </div>

      {/* Floor reflection line */}
      <div style={{
        position: "absolute", bottom: "55px", left: "15%", right: "15%",
        height: "1px",
        background: "linear-gradient(to right, transparent, #f0e6d340, transparent)",
        zIndex: 1,
      }} />
    </div>
  );
}