"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useWindowSize from '@/hooks/useWindowSize';

const streams = [
  {
    label: "LANGUAGES",
    color: "#fbf6f7", // Crimson Depth
    glow: "rgba(133,0,25,0.4)",
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
    color: "#f4f4f4", // Soft Pearl
    glow: "rgba(242,241,237,0.4)",
    tools: [
      { name: "HTML", icon: "🌐" },
      { name: "CSS", icon: "🎨" },
      { name: "React", icon: "⚛" },
      { name: "Next.js", icon: "▲" },
      { name: "Android", icon: "🤖" },
      { name: "Gradle", icon: "🤖" },
    ],
  },
  {
    label: "BACKEND",
    color: "#f3eced", // Crimson Depth
    glow: "rgba(133,0,25,0.4)",
    tools: [
      { name: "Node.js", icon: "⬡" },
      { name: "Express", icon: "EX" },
      { name: "REST APIs", icon: "🔗" },
    ],
  },
  {
    label: "DATABASES",
    color: "#f7f0f2", // Soft Pearl
    glow: "rgba(242,241,237,0.4)",
    tools: [
      { name: "MongoDB", icon: "🍃" },
      { name: "Firebase", icon: "🔥" },
    ],
  },
  {
    label: "AI / ML",
    color: "#f8f1f3", // Crimson Depth
    glow: "rgba(133,0,25,0.4)",
    tools: [
      { name: "Hugging Face", icon: "🤗" },
      { name: "OpenCV", icon: "👁" },
      { name: "Scikit-learn", icon: "🧠" },
    ],
  },
  {
    label: "TOOLS & INFRA",
    color: "#f7f1f2", // Soft Pearl
    glow: "rgba(242,241,237,0.4)",
    tools: [
      { name: "Git", icon: "⎇" },
      { name: "GitHub", icon: "⚙" },
      { name: "Arduino", icon: "⚡" },
      { name: "Render", icon: "☁" },
    ],
  },
  {
    label: "CORE CS",
    color: "#f9f3f4", // Crimson Depth
    glow: "rgba(255, 202, 202, 0.4)",
    tools: [
      { name: "DSA", icon: "🌲" },
      { name: "OOP", icon: "📦" },
      { name: "OS", icon: "💻" },
      { name: "HPC", icon: "⚡" },
      { name: "CI", icon: "💻" },
    ],
  },
];

const LABEL_DELAY = 150;
const TOOL_DELAY = 100;

export default function ToolsPage({
  activePage,
}: {
  activePage: string;
}){
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  const [headingVisible, setHeadingVisible] = useState(false);
  const [visibleLabels, setVisibleLabels] = useState<boolean[]>(Array(streams.length).fill(false));
  const [visibleTools, setVisibleTools] = useState<boolean[][]>(
    streams.map(s => Array(s.tools.length).fill(false))
  );
  const [imageVisible, setImageVisible] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  // Mouse glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Orchestrated entrance - sequential loading
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;

    // 1. Heading first
    t += 100;
    timers.push(setTimeout(() => setHeadingVisible(true), t));

    // 2. Image starts loading at same time as first label
    t += 200;
    timers.push(setTimeout(() => setImageVisible(true), t));

    // 3. Labels load one by one
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

    // 4. Tools load one by one after their label appears
    streams.forEach((stream, si) => {
      stream.tools.forEach((_, ti) => {
        // Add extra delay so tools appear after their label
        const toolDelay = (si * LABEL_DELAY) + 300 + (ti * TOOL_DELAY);
        const cs = si, ct = ti;
        timers.push(setTimeout(() => {
          setVisibleTools(prev => {
            const next = prev.map(row => [...row]);
            next[cs][ct] = true;
            return next;
          });
        }, toolDelay));
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
        background: "#280202", // Obsidian Black base
        position: "relative",
        overflow: isMobile ? "auto" : "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* Gradient overlay from skeleton image - left to right */}
      <div style={{
        position: "absolute",
        inset: 0,
        // background: "linear-gradient(135deg, #850019 0%, #1D0B10 40%, #F2F1ED10 100%)",
        opacity: 0.8,
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Mouse glow - using Crimson Depth */}
      <div style={{
        position: "absolute",
        left: mousePos.x - 150,
        top: mousePos.y - 150,
        width: "300px", height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(133,0,25,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 998,
        filter: "blur(10px)",
      }} />

      {/* LEFT — Tools content */}
      <div style={{
        width: isMobile ? "100%" : "60%",
        height: isMobile ? "auto" : "100%",
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: isMobile ? "20px" : "40px 0 40px 60px",
        opacity: 1,
      }}>

        {/* Heading */}
        <div style={{
          marginBottom: "30px",
          opacity: headingVisible ? 1 : 0,
          transform: headingVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.8s ease, transform 0.4s ease",
        }}>
          <p style={{
            fontSize: "0.9rem", letterSpacing: "0.5em",
            textTransform: "uppercase", fontFamily: "monospace",
            color: "#F2F1ED", marginBottom: "6px",
          }}>what i work with</p>
          <h2 style={{
            fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
            fontFamily: "Georgia, serif", fontWeight: "800",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "#f6d1d1",
            textShadow: "0 0 20px rgba(133,0,25,0.5)",
          }}>TOOLS & STACK</h2>
        </div>

        {/* Streams */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: isMobile ? "20px" : "14px", 
          maxWidth: "700px",
        }}>
          {streams.map((stream, si) => (
            <div key={stream.label} style={{
              display: "flex", alignItems: "flex-start", gap: "15px",
            }}>

              {/* Label */}
              <div style={{
                width: isMobile ? "100px" : "140px",
                flexShrink: 0,
                fontFamily: "Georgia, serif",
                fontSize: isMobile ? "0.65rem" : "0.75rem",
                fontWeight: "600",
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: stream.color,
                textAlign: isMobile ? "left" : "right",
                textShadow: `0 0 8px ${stream.glow}`,
                paddingTop: "6px",
                opacity: visibleLabels[si] ? 1 : 0,
                transform: visibleLabels[si] ? "translateX(0)" : "translateX(-12px)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}>
                {stream.label}
              </div>

              {/* Connector */}
              <div style={{
                width: "16px", height: "1px", flexShrink: 0,
                background: `linear-gradient(to right, transparent, ${stream.color})`,
                marginTop: "10px",
                opacity: visibleLabels[si] ? 1 : 0,
                transition: "opacity 0.4s ease 0.1s",
              }} />

              {/* Tools */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "6px" : "8px", flex: 1 }}>
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
                        border: `1px solid ${isHov ? stream.color : `${stream.color}80`}`,
                        borderRadius: "20px",
                        background: isHov ? `${stream.color}20` : "rgba(242,241,237,0.05)",
                        cursor: "default",
                        opacity: show ? 1 : 0,
                        transform: show ? "translateY(0) scale(1)" : "translateY(6px) scale(0.9)",
                        transition: "opacity 0.3s ease, transform 0.3s ease, border-color 0.2s ease, background 0.2s ease",
                        transitionDelay: show ? `${ti * 50}ms` : "0ms",
                      }}
                    >
                      <span style={{
                        fontSize: ".8rem",
                        color: isHov ? stream.color : `${stream.color}CC`,
                        transition: "color 0.2s ease",
                        fontFamily: tool.icon.length <= 2 ? "monospace" : "inherit",
                        fontWeight: tool.icon.length <= 2 ? "bold" : "normal",
                      }}>
                        {tool.icon}
                      </span>
                      <span style={{
                        fontFamily: "monospace", fontSize: "0.7rem",
                        letterSpacing: "0.05em",
                        color: isHov ? stream.color : `${stream.color}B3`,
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

      {/* RIGHT — Image */}
      {!isMobile && (
        <div style={{
          width: "40%", height: "100%",
          position: "relative", zIndex: 5,
          overflow: "hidden",
          transform: imageVisible ? "translateX(0)" : "translateX(110%)",
          transition: "transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: "#29010c",
        }}>
          <Image
            src="/TOOLS.png"
            alt="Tools background"
            fill
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.9 }}
            priority
          />
          <div style={{
            position: "absolute", inset: 0,
            // background: "linear-gradient(to right,#850019 0%, #250c13 2%, transparent 30%)",
            zIndex: 2,
          }} />
        </div>
      )}
    </div>
  );
}