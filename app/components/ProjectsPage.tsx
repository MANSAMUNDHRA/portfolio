"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const projectTypes = [
  { id: "all", label: "All", count: 6 },
  { id: "fullstack", label: "Full Stack", count: 2 },
  { id: "android", label: "Android", count: 1 },
  { id: "ml", label: "ML", count: 2 },
  { id: "web", label: "Web", count: 2 },
];

const allProjects = [
  {
    id: 1, type: "fullstack", name: "PolyCode-AI",
    tagline: "AI-powered code generation platform with real-time execution",
    year: "2024", status: "completed",
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
  completed:     { label: "Completed",   bg: "#1a0e06", text: "#E8D8C4" },
  "in-progress": { label: "In Progress", bg: "#3a2010", text: "#E8D8C4" },
  "coming-soon": { label: "Coming Soon", bg: "#333",    text: "#aaa" },
};

export default function ProjectsPage({ onExitToTools }: { onExitToTools?: () => void }) {
  const [selectedType, setSelectedType] = useState("all");
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<typeof allProjects[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const exitLockedRef = useRef(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    allProjects.forEach((p, i) => {
      timers.push(setTimeout(() => setVisibleCards(prev => [...prev, p.id]), 200 + i * 200));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── Scroll handler: horizontal on cards, up → tools, popup blocks all ──
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // If popup is open, completely block — don't scroll cards or exit
      if (selectedProject) {
        e.preventDefault();
        return;
      }

      const el = scrollRef.current;
      if (!el) return;

      // Horizontal deltaX → scroll cards left/right
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaX;
        return;
      }

      // Scroll UP (deltaY < 0) at the start → exit to tools
      if (e.deltaY < -60) {
        if (el.scrollLeft <= 0 && !exitLockedRef.current) {
          exitLockedRef.current = true;
          onExitToTools?.();
          setTimeout(() => { exitLockedRef.current = false; }, 1000);
        }
        return;
      }

      // Scroll DOWN → move cards horizontally
      e.preventDefault();
      el.scrollLeft += e.deltaY * 0.9;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onExitToTools, selectedProject]);

  const filtered = selectedType === "all"
    ? allProjects
    : allProjects.filter(p => p.type === selectedType);

  const p = selectedProject;

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative",
      display: "flex", flexDirection: "column", overflow: "hidden",
      background: "#0a0a0f",
    }}>

      {/* ── Header ── */}
      <div style={{ padding: "28px 56px 10px", flexShrink: 0, zIndex: 2, position: "relative" }}>
        <p style={{ fontFamily: "monospace", fontSize: "0.5rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(232,216,196,0.5)", marginBottom: "4px" }}>selected work</p>
        <h1 style={{ fontSize: "clamp(1.6rem, 2.2vw, 2rem)", fontWeight: 700, color: "#E8D8C4", margin: 0, fontFamily: "Georgia, serif" }}>Projects</h1>
      </div>

      {/* ── Cards row ── */}
      <div ref={scrollRef} style={{
        flex: 1, display: "flex", gap: "20px", overflowX: "auto", overflowY: "hidden",
        padding: "12px 56px 16px", zIndex: 2, position: "relative",
        scrollbarWidth: "none", alignItems: "center",
      }}>
        {filtered.map((project) => {
          const s = STATUS[project.status as keyof typeof STATUS];
          const isHov = hoveredId === project.id;
          const isVisible = visibleCards.includes(project.id);
          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProject(project)}
              style={{
                flex: "0 0 230px", height: "320px", background: "#E8D8C4",
                borderRadius: "14px", overflow: "hidden", cursor: "pointer",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? (isHov ? "translateY(-8px)" : "translateY(0)") : "translateY(40px)",
                transition: "opacity 0.45s ease, transform 0.3s ease",
                boxShadow: isHov ? "0 20px 48px rgba(0,0,0,0.55)" : "0 6px 20px rgba(0,0,0,0.4)",
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{ height: "150px", position: "relative", overflow: "hidden", flexShrink: 0, background: "#d4c4b0" }}>
                <Image src={project.image} alt={project.name} fill
                  style={{ objectFit: "cover", transform: isHov ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }} />
                <div style={{ position: "absolute", top: "10px", left: "10px", background: s.bg, color: s.text, fontSize: "0.38rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 9px", borderRadius: "20px" }}>{s.label}</div>
                <div style={{ position: "absolute", top: "10px", right: "10px", color: "rgba(255,255,255,0.7)", fontSize: "0.38rem", fontFamily: "monospace", background: "rgba(0,0,0,0.35)", padding: "3px 8px", borderRadius: "20px" }}>{project.year}</div>
              </div>
              <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: "7px", flex: 1 }}>
                <h3 style={{ color: "#2a1a0a", fontSize: "0.95rem", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif", lineHeight: 1.2 }}>{project.name}</h3>
                <p style={{ color: "rgba(42,26,10,0.7)", fontSize: "0.58rem", lineHeight: 1.5, margin: 0, fontFamily: "monospace", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.tagline}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "auto" }}>
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ background: "rgba(42,26,10,0.1)", color: "#2a1a0a", padding: "3px 7px", borderRadius: "20px", fontSize: "0.38rem", fontFamily: "monospace", border: "1px solid rgba(42,26,10,0.12)" }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", opacity: isHov ? 1 : 0, transition: "opacity 0.2s ease" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.38rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a1a0a", fontWeight: 700 }}>Open</span>
                  <span style={{ color: "#2a1a0a", fontSize: "0.6rem" }}>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter buttons ── */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 56px 20px", zIndex: 2, position: "relative", flexShrink: 0, gap: "8px", flexWrap: "wrap" }}>
        {projectTypes.map(t => (
          <button key={t.id} onClick={() => setSelectedType(t.id)} style={{
            padding: "5px 16px", borderRadius: "30px",
            border: selectedType === t.id ? "1px solid #E8D8C4" : "1px solid rgba(232,216,196,0.25)",
            background: selectedType === t.id ? "#E8D8C4" : "transparent",
            color: selectedType === t.id ? "#1a0e06" : "rgba(232,216,196,0.7)",
            fontSize: "0.52rem", fontFamily: "monospace", letterSpacing: "0.08em",
            textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s ease",
            fontWeight: selectedType === t.id ? 700 : 400,
          }}>
            {t.label} <span style={{ opacity: 0.6 }}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════
          POPUP — 2-column layout
          LEFT:  image + name + about + unique feature
          RIGHT: tech stack + links
      ══════════════════════════════════════════════ */}
      {p && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1a1208", borderRadius: "14px",
              width: "min(960px, 95vw)", maxHeight: "88vh",
              border: "1px solid #3d2e1a",
              animation: "popIn 0.25s ease",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
          >
            {/* ── Top bar ── */}
            <div style={{
              flexShrink: 0,
              background: "#221808", borderBottom: "1px solid #3d2e1a",
              padding: "10px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#a09070", fontSize: "0.7rem", fontFamily: "monospace" }}>MANSAMUNDHRA /</span>
                <span style={{ color: "#E8D8C4", fontSize: "0.7rem", fontFamily: "monospace", fontWeight: 600 }}>{p.name}</span>
                <span style={{
                  fontSize: "0.5rem", fontFamily: "monospace", padding: "2px 8px", borderRadius: "20px",
                  border: "1px solid #3d2e1a",
                  color: STATUS[p.status as keyof typeof STATUS].text,
                  background: STATUS[p.status as keyof typeof STATUS].bg,
                }}>{STATUS[p.status as keyof typeof STATUS].label}</span>
              </div>
              <button onClick={() => setSelectedProject(null)} style={{
                width: "26px", height: "26px", borderRadius: "6px", background: "#2e2010",
                border: "1px solid #4a3520", color: "#a09070", cursor: "pointer",
                fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>✕</button>
            </div>

            {/* ── Two columns ── */}
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

              {/* LEFT — image + about + unique */}
              <div style={{
                flex: "0 0 58%", overflowY: "auto",
                borderRight: "1px solid #2e2010",
                display: "flex", flexDirection: "column",
              }}>
                {/* Hero image */}
                <div style={{ height: "200px", position: "relative", flexShrink: 0, background: "#221808" }}>
                  <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover", opacity: 0.75 }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #1a1208 0%, transparent 55%)" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "24px" }}>
                    <h2 style={{ color: "#f5ede0", fontSize: "1.4rem", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif" }}>{p.name}</h2>
                    <p style={{ color: "rgba(240,246,252,0.55)", fontSize: "0.72rem", margin: "4px 0 0", fontFamily: "monospace" }}>{p.tagline}</p>
                  </div>
                </div>

                {/* About */}
                <div style={{ padding: "22px 24px 0" }}>
                  <p style={{ color: "#9a8060", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>📄 About</p>
                  <p style={{ color: "#e8d8c4", fontSize: "0.78rem", lineHeight: 1.85, margin: 0, fontFamily: "monospace" }}>{p.description}</p>
                </div>

                {/* Unique feature */}
                <div style={{ margin: "20px 24px 24px", padding: "16px 18px", background: "rgba(232,216,196,0.07)", borderRadius: "8px", border: "1px solid rgba(232,216,196,0.2)" }}>
                  <p style={{ color: "#E8D8C4", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>⚡ What makes it different</p>
                  <p style={{ color: "#e8d8c4", fontSize: "0.78rem", lineHeight: 1.8, margin: 0, fontFamily: "monospace" }}>{p.uniqueFeature}</p>
                </div>
              </div>

              {/* RIGHT — tech stack + links */}
              <div style={{
                flex: 1, overflowY: "auto",
                padding: "24px 22px",
                display: "flex", flexDirection: "column", gap: "24px",
              }}>

                {/* Links */}
                <div>
                  <p style={{ color: "#9a8060", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>🔗 Links</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 14px", borderRadius: "8px",
                          background: "#221808", border: "1px solid #3d2e1a",
                          color: "#e8d8c4", textDecoration: "none",
                          transition: "border-color 0.2s, background 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8D8C4"; e.currentTarget.style.background = "#1c2128"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#3d2e1a"; e.currentTarget.style.background = "#221808"; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, color: "#a09070" }}>
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                        <div>
                          <div style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 600 }}>GitHub Repository</div>
                          <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#a09070", marginTop: "2px" }}>Opens in new tab →</div>
                        </div>
                      </a>
                    )}
                    {p.liveDemo && (
                      <a
                        href={p.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 14px", borderRadius: "8px",
                          background: "#C4A882", border: "1px solid #C4A882",
                          color: "#fff", textDecoration: "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#D4B892"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#C4A882"; }}
                      >
                        <span style={{ fontSize: "0.9rem" }}>↗</span>
                        <div>
                          <div style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 600 }}>Live Demo</div>
                          <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>Opens in new tab →</div>
                        </div>
                      </a>
                    )}
                    {(p as any).apk && (
                      <a
                        href={(p as any).apk}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "10px 14px", borderRadius: "8px",
                          background: "#7a5c3a", border: "1px solid #7a5c3a",
                          color: "#fff", textDecoration: "none",
                        }}
                      >
                        <span style={{ fontSize: "0.9rem" }}>↓</span>
                        <div>
                          <div style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 600 }}>Download APK</div>
                          <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>Opens in new tab →</div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #2e2010" }} />

                {/* Tech stack */}
                <div>
                  <p style={{ color: "#9a8060", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>🛠 Tech Stack</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                    {p.techStack.map(tech => (
                      <span key={tech} style={{
                        padding: "5px 12px", borderRadius: "20px",
                        background: "#221808", border: "1px solid #3d2e1a",
                        color: "#a09070", fontSize: "0.65rem", fontFamily: "monospace",
                        letterSpacing: "0.04em",
                      }}>{tech}</span>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                {(p as any).progress && (p as any).progress !== "0%" && (
                  <>
                    <div style={{ borderTop: "1px solid #2e2010" }} />
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ color: "#9a8060", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>Progress</span>
                        <span style={{ color: "#E8D8C4", fontSize: "0.65rem", fontFamily: "monospace" }}>{(p as any).progress}</span>
                      </div>
                      <div style={{ background: "#2e2010", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(to right, #C4A882, #E8D8C4)", width: (p as any).progress, transition: "width 0.6s ease" }} />
                      </div>
                    </div>
                  </>
                )}

                {/* Year + type */}
                <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #2e2010" }}>
                  <span style={{ color: "#8a7060", fontSize: "0.6rem", fontFamily: "monospace", letterSpacing: "0.1em" }}>
                    {p.year} · {p.type.toUpperCase()}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        div::-webkit-scrollbar { width: 5px; height: 5px; }
        div::-webkit-scrollbar-track { background: #221808; }
        div::-webkit-scrollbar-thumb { background: #4a3520; border-radius: 4px; }
        div::-webkit-scrollbar-thumb:hover { background: #C4A882; }
      `}</style>
    </div>
  );
}