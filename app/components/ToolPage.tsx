"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const streams = [
  {
    label: "LANGUAGES",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
    tools: [
      { name: "Java", icon: "☕" },
      { name: "Python", icon: "🐍" },
      { name: "JavaScript", icon: "JS" },
      { name: "TypeScript", icon: "TS" },
      { name: "C++", icon: "C++" },
    ],
  },
  {
    label: "FRONTEND & MOBILE",
    color: "#34d399",
    glow: "rgba(52,211,153,0.4)",
    tools: [
      { name: "HTML", icon: "🌐" },
      { name: "CSS", icon: "🎨" },
      { name: "React", icon: "⚛" },
      { name: "Next.js", icon: "▲" },
      { name: "Android", icon: "🤖" },
    ],
  },
  {
    label: "BACKEND",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.4)",
    tools: [
      { name: "Node.js", icon: "⬡" },
      { name: "Express", icon: "EX" },
      { name: "Next.js", icon: "▲" },
      { name: "REST APIs", icon: "🔗" },
    ],
  },
  {
    label: "DATABASES",
    color: "#f472b6",
    glow: "rgba(244,114,182,0.4)",
    tools: [
      { name: "MongoDB", icon: "🍃" },
      { name: "Firebase", icon: "🔥" },
    ],
  },
  {
    label: "AI / ML",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.4)",
    tools: [
      { name: "Hugging Face", icon: "🤗" },
      { name: "OpenCV", icon: "👁" },
      { name: "Scikit-learn", icon: "🧠" },
    ],
  },
  {
    label: "TOOLS & INFRA",
    color: "#f87171",
    glow: "rgba(248,113,113,0.4)",
    tools: [
      { name: "Git", icon: "⎇" },
      { name: "GitHub", icon: "⚙" },
      { name: "Arduino", icon: "⚡" },
      { name: "Render", icon: "☁" },
    ],
  },
  {
    label: "CORE CS",
    color: "#94a3b8",
    glow: "rgba(148,163,184,0.4)",
    tools: [
      { name: "DSA", icon: "🌲" },
      { name: "OOP", icon: "📦" },
      { name: "OS", icon: "💻" },
      { name: "HPC", icon: "⚡" },
    ],
  },
];

const LABEL_DELAY = 80;
const TOOL_DELAY  = 60;

export default function ToolsPage({
  activePage,
}: {
  activePage: string;
}){
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const [hovered, setHovered]     = useState<string | null>(null);

  const [headingVisible, setHeadingVisible] = useState(false);
  const [visibleLabels, setVisibleLabels]   = useState<boolean[]>(Array(streams.length).fill(false));
  const [visibleTools, setVisibleTools]     = useState<boolean[][]>(
    streams.map(s => Array(s.tools.length).fill(false))
  );
  const [imageVisible, setImageVisible] = useState(false);

  // Mouse glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Orchestrated entrance
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;

    // 1. Heading
    t += 100;
    timers.push(setTimeout(() => setHeadingVisible(true), t));

    // 2. Labels staggered
    streams.forEach((_, si) => {
      t += LABEL_DELAY;
      const captured = si;
      timers.push(setTimeout(() => {
        setVisibleLabels(prev => {
          const next = [...prev];
          next[captured] = true;
          return next;
        });
      }, t));
    });

    // 3. Image starts sliding in at same time as tools
    t += 200;
    
    timers.push(setTimeout(() => setImageVisible(true), t));

    // 4. Tools load one by one
    streams.forEach((stream, si) => {
      stream.tools.forEach((_, ti) => {
        t += TOOL_DELAY;
        const cs = si, ct = ti;
        timers.push(setTimeout(() => {
          setVisibleTools(prev => {
            const next = prev.map(row => [...row]);
            next[cs][ct] = true;
            return next;
          });
        }, t));
      });
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      id="tools-container"
      style={{
        width: "100%",
        height: "100%",
        background: "#060608",
        position: "relative",
        overflow: "hidden",
        display: "flex",
      }}
    >
      {/* Mouse glow */}
      <div style={{
        position: "absolute",
        left: mousePos.x - 150,
        top: mousePos.y - 150,
        width: "300px", height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 998,
        filter: "blur(10px)",
      }} />

      {/* ── LEFT — Tools content ── */}
      <div style={{
        width: "60%", height: "100%",
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "40px 0 40px 60px",
        opacity: 1,
      }}>

        {/* Heading */}
        <div style={{
          marginBottom: "30px",
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 1s ease, transform 0.25s ease",
        }}>
          <p style={{
            fontSize: "0.6rem", letterSpacing: "0.5em",
            textTransform: "uppercase", fontFamily: "monospace",
            color: "rgba(255,255,255,0.3)", marginBottom: "6px",
          }}>what i work with</p>
          <h2 style={{
            fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
            fontFamily: "Georgia, serif", fontWeight: "800",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "white",
            textShadow: "0 0 20px rgba(255,255,255,0.15)",
          }}>TOOLS & STACK</h2>
        </div>

        {/* Streams */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: "14px", maxWidth: "700px",
        }}>
          {streams.map((stream, si) => (
            <div key={stream.label} style={{
              display: "flex", alignItems: "flex-start", gap: "15px",
            }}>

              {/* Label */}
              <div style={{
                width: "140px", flexShrink: 0,
                fontFamily: "Georgia, serif",
                fontSize: "0.75rem", fontWeight: "600",
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: stream.color, textAlign: "right",
                textShadow: `0 0 8px ${stream.glow}`,
                paddingTop: "6px",
                opacity: visibleLabels[si] ? 1 : 0,
                transform: visibleLabels[si] ? "translateX(0)" : "translateX(-12px)",
                transition: "opacity 0.2s ease, transform 0.4s ease",
              }}>
                {stream.label}
              </div>

              {/* Connector */}
              <div style={{
                width: "16px", height: "1px", flexShrink: 0,
                background: `linear-gradient(to right, transparent, ${stream.color}66)`,
                marginTop: "10px",
                opacity: visibleLabels[si] ? 1 : 0,
                transition: "opacity 0.4s ease 0.1s",
              }} />

              {/* Tools */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
                {stream.tools.map((tool, ti) => {
                  const key = `${si}-${ti}`;
                  const isHov = hovered === key;
                  const show = visibleTools[si][ti];
                  return (
                    <div
                      key={tool.name}
                      onMouseEnter={() => setHovered(key)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        padding: "5px 12px",
                        border: `1px solid ${isHov ? stream.color : stream.color + "30"}`,
                        borderRadius: "20px",
                        background: isHov ? `${stream.color}15` : `${stream.color}08`,
                        cursor: "default",
                        opacity: show ? 1 : 0,
                        transform: show ? "translateY(0) scale(1)" : "translateY(6px) scale(0.9)",
                        transition: "opacity 0.25s ease, transform 0.25s ease, border-color 0.2s ease, background 0.2s ease",
                      }}
                    >
                      <span style={{
                        fontSize: "0.85rem",
                        color: isHov ? stream.color : "rgba(255,255,255,0.7)",
                        transition: "color 0.2s ease",
                        fontFamily: tool.icon.length <= 2 ? "monospace" : "inherit",
                        fontWeight: tool.icon.length <= 2 ? "bold" : "normal",
                      }}>
                        {tool.icon}
                      </span>
                      <span style={{
                        fontFamily: "monospace", fontSize: "0.6rem",
                        letterSpacing: "0.05em",
                        color: isHov ? "white" : "rgba(255,255,255,0.6)",
                        transition: "color 0.2s ease",
                      }}>
                        {tool.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — Image slides in from right, slides left when projects active ── */}
      <div style={{
        width: "40%", height: "100%",
        position: "relative", zIndex: 5,
        overflow: "hidden",
        transform:
          activePage === "projects"
            ? "translateX(-120%)"   // Slide LEFT fully off screen
            : imageVisible
            ? "translateX(0)"       // Normal position
            : "translateX(110%)",   // Initial entrance from right
        transition: "transform 0.9s cubic-bezier(0.77,0,0.18,1)",
      }}>
        <Image
          src="/TOOLS.jpg"
          alt="Tools background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, #060608 0%, transparent 30%)",
          zIndex: 2,
        }} />
      </div>
    </div>
  );
}