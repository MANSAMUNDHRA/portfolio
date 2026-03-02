"use client";

import { useEffect, useState } from "react";

const experiences = [
  {
    id: 0,
    role: "AI Intern",
    company: "DeepSurge AI",
    period: "Aug – Oct 2025",
    type: "Technical Experience",
    color: "#f0e6d3", // Light cream from contact page
    bg: "#f0e6d3", // Card background - light cream
    points: [
      "Computer vision pipeline for anomaly detection using OpenCV",
      "Feature extraction & damage classification for road conditions",
      "Augmented image datasets for detection robustness",
    ],
  },
  {
    id: 5,
    role: "Coming Soon",
    company: "———",
    period: "—",
    type: "",
    color: "#3d0c0c", // Deep burgundy
    bg: "#3d0c0c", // Card background - deep burgundy
    points: [],
    blank: true,
  },
  {
    id: 1,
    role: "Technical Project Member",
    company: "KIIT Electrical Society",
    period: "2024 – Present",
    type: "Technical Experience",
    color: "#3d0c0c", // Deep burgundy from contact page
    bg: "#3d0c0c", // Card background - deep burgundy
    points: [
      "Arduino-based autonomous robots: Line Follower, Sand Rover, Obstacle Bot",
      "Embedded C++ for real-time sensor processing & motor control",
      "Prototypes demonstrated at IIT Patna & IIT Kharagpur tech fests",
    ],
  },
  
  {
    id: 4,
    role: "Coming Soon",
    company: "———",
    period: "—",
    type: "",
    color: "#f0e6d3", // Light cream
    bg: "#f0e6d3", // Card background - light cream
    points: [],
    blank: true,
  },
];

export default function ExperiencePage({ onScrollUp }: { onScrollUp?: () => void }) {
  const [active, setActive] = useState(2);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const lockRef = { locked: false };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -60 && !lockRef.locked) {
        lockRef.locked = true;
        onScrollUp?.();
        setTimeout(() => { lockRef.locked = false; }, 1000);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onScrollUp]);

  const getCardStyle = (idx: number) => {
    const diff = idx - active;
    const absDiff = Math.abs(diff);

    // Position along the arc
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
      width: "100%",
      height: "100%",
      background: "#0e0d0d", // Deep burgundy background
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      fontFamily: "monospace",
    }}>

      {/* Radial glow at center bottom */}
      <div style={{
        position: "absolute",
        bottom: "-80px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "700px",
        height: "300px",
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${experiences[active].color}40 0%, transparent 70%)`,
        transition: "background 0.6s ease",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Header */}
      <div style={{
        padding: "28px 56px 8px",
        flexShrink: 0, zIndex: 5, position: "relative",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease 0.2s",
      }}>
        <p style={{ fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#f0e6d3", margin: "0 0 4px" }}>work history</p>
        <h1 style={{ fontSize: "clamp(1.6rem, 2.2vw, 2rem)", fontWeight: 900, color: "#f0e6d3", margin: 0, letterSpacing: "-0.02em", textTransform: "uppercase" }}>
          Experience
        </h1>
      </div>

      {/* 3D Stage */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
        perspective: "1200px",
        perspectiveOrigin: "50% 45%",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s ease 0.4s",
      }}>
        {/* Cards container — centered, preserves 3D */}
        <div style={{
          position: "relative",
          width: "320px",
          height: "400px",
          transformStyle: "preserve-3d",
        }}>
          {experiences.map((exp, idx) => {
            const cardStyle = getCardStyle(idx);
            const isActive = idx === active;

            return (
              <div
                key={exp.id}
                onClick={() => setActive(idx)}
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "320px",
                  height: "400px",
                  borderRadius: "20px",
                  background: exp.bg,
                  border: `1px solid ${isActive ? "#f0e6d380" : "#f0e6d340"}`,
                  cursor: isActive ? "default" : "pointer",
                  overflow: "hidden",
                  boxShadow: isActive
                    ? `0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px #f0e6d330`
                    : "0 20px 60px rgba(0,0,0,0.5)",
                  ...cardStyle,
                }}
              >
                {/* Top accent bar - cream */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: `linear-gradient(to right, #f0e6d3, #f0e6d340, transparent)`,
                }} />

                {/* Subtle corner glow - cream */}
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: "120px", height: "120px",
                  background: `radial-gradient(circle at 0% 0%, #f0e6d320, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                {exp.blank ? (
                  /* Blank card */
                  <div style={{
                    height: "100%", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "10px",
                  }}>
                    <div style={{ width: "32px", height: "1px", background: "#f0e6d380" }} />
                    <span style={{ fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", color: exp.color === "#f0e6d3" ? "#3d0c0c" : "#f0e6d3" }}>forthcoming</span>
                    <div style={{ width: "32px", height: "1px", background: "#f0e6d380" }} />
                  </div>
                ) : (
                  /* Experience card content */
                  <div style={{ padding: "28px 24px 24px", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>

                    {/* Type */}
                    {exp.type && (
                      <span style={{
                        fontSize: "0.42rem", letterSpacing: "0.22em", textTransform: "uppercase",
                        color: exp.color === "#f0e6d3" ? "#3d0c0c" : "#f0e6d3", marginBottom: "14px", display: "block",
                      }}>{exp.type}</span>
                    )}

                    {/* Role */}
                    <h2 style={{
                      fontSize: "1.1rem", fontWeight: 700, color: exp.color === "#f0e6d3" ? "#3d0c0c" : "#f0e6d3",
                      margin: "0 0 4px", lineHeight: 1.2, letterSpacing: "-0.01em",
                    }}>{exp.role}</h2>

                    {/* Company */}
                    <p style={{ fontSize: "0.72rem", color: exp.color === "#f0e6d3" ? "#3d0c0c" : "#f0e6d3", margin: "0 0 3px" }}>{exp.company}</p>

                    {/* Period */}
                    <span style={{
                      fontSize: "0.48rem", letterSpacing: "0.14em", color: exp.color === "#f0e6d3" ? "#3d0c0c" : "#f0e6d3",
                      textTransform: "uppercase", display: "block", marginBottom: "18px",
                    }}>{exp.period}</span>

                    {/* Divider */}
                    <div style={{ height: "1px", background: `linear-gradient(to right, #f0e6d380, transparent)`, marginBottom: "16px" }} />

                    {/* Points */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                      {exp.points.map((pt, j) => (
                        <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <div style={{
                            width: "5px", height: "5px", borderRadius: "50%",
                            background: "#f0e6d3", flexShrink: 0, marginTop: "5px",
                            boxShadow: `0 0 6px #f0e6d380`,
                          }} />
                          <p style={{
                            fontSize: "0.65rem", color: exp.color === "#f0e6d3" ? "#3d0c0c" : "#f0e6d3",
                            lineHeight: 1.7, margin: 0,
                          }}>{pt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
        {experiences.map((exp, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            style={{
              width: idx === active ? "22px" : "6px",
              height: "6px",
              borderRadius: "3px",
              border: "none",
              background: idx === active ? "#f0e6d3" : "#f0e6d340",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s ease",
              boxShadow: idx === active ? `0 0 8px #f0e6d360` : "none",
            }}
          />
        ))}
      </div>

      {/* Floor reflection line */}
      <div style={{
        position: "absolute",
        bottom: "55px", left: "15%", right: "15%",
        height: "1px",
        background: `linear-gradient(to right, transparent, #f0e6d340, transparent)`,
        transition: "background 0.6s ease",
        zIndex: 1,
      }} />
    </div>
  );
}