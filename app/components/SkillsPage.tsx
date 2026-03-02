"use client";

import { useEffect, useState, useRef } from "react";
import useWindowSize from '@/hooks/useWindowSize';

const skills = [
  { id: 1, title: "FULL STACK DEVELOPER", sub: "React · Next.js · Node.js",          short: "FULL STACK",  bg: "#3d0b11" },
  { id: 2, title: "ANDROID DEVELOPER",    sub: "Native & cross-platform mobile",      short: "ANDROID",     bg: "#512a50" },
  { id: 3, title: "ML RESEARCHER",        sub: "Applied ML — integration & research", short: "ML",          bg: "#9a3f4a" },
  { id: 4, title: "BACKEND DEVELOPER",    sub: "APIs · Databases · Architecture",     short: "BACKEND",     bg: "#520524" },
  { id: 5, title: "AI ENGINEER",          sub: "Integrating AI into real products",   short: "AI",          bg: "#d77a85" },
  { id: 6, title: "LANGUAGES",            sub: "Java · C++ · Python",                short: "LANGUAGES",   bg: "#530402" },
];

const TOTAL = skills.length;
const FIXED_ANGLES = [-75, -45, -15, 195, 225, 255];

export default function SkillsPage({ onExitToTools }: { onExitToTools?: (rotation: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [fading, setFading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const activeIndexRef = useRef(0);
  const active = skills[activeIndex];
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  const go = (dir: 1 | -1) => {
    if (lockRef.current) return;
    lockRef.current = true;

    const current = activeIndexRef.current;

    if (dir === 1 && current === TOTAL - 1) {
      setRotation(prev => prev + 30);
      setTimeout(() => {
        lockRef.current = false;
        if (onExitToTools) onExitToTools(rotation + 30);
      }, 750);
      return;
    }

    setFading(true);
    setTimeout(() => setFading(false), 250);
    setRotation(prev => prev + dir * 30);
    setActiveIndex(prev => (prev + dir + TOTAL) % TOTAL);

    setTimeout(() => { lockRef.current = false; }, 800);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    let accumulated = 0;
    const THRESHOLD = 100;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      accumulated += e.deltaY;
      
      if (accumulated > THRESHOLD) {
        accumulated = 0;
        go(1);
      } else if (accumulated < -THRESHOLD) {
        accumulated = 0;
        go(-1);
      }
    };
    
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const GEAR_SIZE = isMobile ? 300 : 550;
  const PAD = isMobile ? 10 : 20;
  const R = GEAR_SIZE / 2 + PAD;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", height: "100%",
        position: "relative", overflow: "hidden",
        background: active.bg,
        transition: "background 0.6s ease",
      }}
    >
      {/* COUNTER */}
      <div style={{
        position: "absolute", top: "5%", right: "5%", zIndex: 10,
        fontFamily: "monospace", fontSize: "0.55rem",
        letterSpacing: "0.3em", color: "#E8D8C4",
      }}>
        {String(activeIndex + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </div>

      {/* HEADING */}
      <div style={{
        position: "absolute", top: "15%",
        left: "50%", transform: "translateX(-50%)",
        textAlign: "center", zIndex: 10, width: "65%",
      }}>
        <h2 style={{
          fontSize: isMobile ? "clamp(1.5rem, 5vw, 2rem)" : "clamp(2rem, 4.5vw, 4rem)",
          fontFamily: "'Sergio Trendy', 'Georgia', 'Times New Roman', serif",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: isMobile ? "0.04em" : "0.08em",
          color: "#E8D8C4",
          lineHeight: 1.2,
          marginBottom: "10px",
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(-6px)" : "translateY(0)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          textShadow: "0 2px 20px rgba(0,0,0,0.2)",
          whiteSpace: isMobile ? "normal" : "nowrap",
        }}>
          {active.title}
        </h2>
        <p style={{
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          fontFamily: "Bryndan Write",
          color: activeIndex === 5 ? "#561C24" : "#E8D8C4",
          lineHeight: 1.7,
          opacity: fading ? 0 : 1,
          transition: "opacity 0.25s ease 0.05s",
        }}>
          {active.sub}
        </p>
      </div>

            {/* SEMICIRCLE + GEAR */}
      <div style={{
        position: "absolute",
        bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: `${R * 2}px`,
        height: `${R * 2}px`,
        marginBottom: `-${R}px`,
        zIndex: 5,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%", background: "#561C24",
        }} />
        
        {/* GEAR - fixed positioning */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: isMobile ? "200px" : `${GEAR_SIZE}px`,
          height: isMobile ? "200px" : `${GEAR_SIZE}px`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          transition: "transform 0.75s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <img 
            src="/gear.png" 
            alt="gear"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "contain", 
              opacity: 0.9,
              maxWidth: isMobile ? "200px" : "550px",
              maxHeight: isMobile ? "200px" : "550px",
            }} 
          />
        </div>
      </div>
      {/* ARC SVG */}
      <div style={{
        position: "absolute",
        bottom: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "800px", height: "800px",
        marginBottom: "-400px",
        zIndex: 6,
        pointerEvents: "none",
      }}>
        <svg width="800" height="800" viewBox="0 0 800 800"
          style={{ overflow: "visible" }}>

          <path
            d={`M ${400 - (R + 38)} 400 A ${R + 38} ${R + 38} 0 0 1 ${400 + (R + 38)} 400`}
            fill="none" stroke="#E8D8C4" strokeWidth="1"
          />

          {skills.map((skill, i) => {
            const isActive = i === activeIndex;
            const diff = ((i - activeIndex + TOTAL) % TOTAL);
            const minDiff = Math.min(diff, TOTAL - diff);
            const angleDeg = FIXED_ANGLES[i];
            const angleRad = angleDeg * (Math.PI / 180);
            const arcR = R + 38;
            const lx = 400 + (arcR + 28) * Math.cos(angleRad);
            const ly = 400 + (arcR + 28) * Math.sin(angleRad);
            const textRotate = angleDeg + 90;

            const opacity = isActive ? 1 : minDiff === 1 ? 0.8 : minDiff === 2 ? 0.6 : 0.4;
            
            let textColor = "#E8D8C4";
            if (isActive) {
              if (i === 5) textColor = "#E8D8C4";
              else textColor = "#E8D8C4";
            }

            return (
              <g key={skill.id}
                style={{ cursor: isActive ? "default" : "pointer", pointerEvents: isActive ? "none" : "all" }}
                onClick={() => {
                  if (isActive) return;
                  setActiveIndex(i);
                  setFading(true);
                  setTimeout(() => setFading(false), 250);
                }}
              >
                <text
                  x={lx} y={ly}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={textColor}
                  fontSize={isActive ? 16 : 14}
                  fontFamily="Georgia, 'Times New Roman', serif"
                  fontWeight={isActive ? "bold" : "normal"}
                  letterSpacing="2"
                  style={{ opacity, transition: "opacity 0.5s ease", userSelect: "none" }}
                  transform={`rotate(${textRotate}, ${lx}, ${ly})`}
                >
                  {skill.short}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ARROWS - hide on mobile */}
      {!isMobile && ([-1, 1] as const).map((dir, index) => (
        <button key={dir} onClick={() => go(dir as 1 | -1)}
          style={{
            position: "absolute", 
            [index === 0 ? "left" : "right"]: "4%", 
            top: "42%",
            transform: "translateY(-50%)", 
            zIndex: 20,
            background: "rgba(232,216,196,0.15)",
            border: "1px solid rgba(232,216,196,0.35)",
            borderRadius: "50%", 
            width: "44px", 
            height: "44px",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            cursor: "pointer", 
            color: "#E8D8C4", 
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,216,196,0.28)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(232,216,196,0.15)"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E8D8C4" strokeWidth="2.5">
            {dir === -1 ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
          </svg>
        </button>
      ))}
    </div>
  );
}