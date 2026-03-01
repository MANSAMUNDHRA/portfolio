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
    id: 1,
    type: "fullstack",
    name: "PolyCode-AI",
    tagline: "AI-powered code generation platform with real-time execution",
    year: "2024",
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
    id: 2,
    type: "android",
    name: "ASHAConnect",
    tagline: "PHC Management System built for rural India",
    year: "2024",
    status: "completed",
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
    id: 3,
    type: "fullstack",
    name: "CodeNow Classroom",
    tagline: "Stealth chat system hiding messages inside C++ code",
    year: "2024",
    status: "completed",
    liveDemo: "https://codenow.binny.house/",
    github: "https://github.com/MANSAMUNDHRA/CodeNow-Classroom",
    image: "/chatform.png",
    tags: ["Node.js", "Vanilla JS", "REST API"],
    description: `A stealthy, terminal-style real-time chat system where messages look like complex C++ programs but secretly carry human-readable communication inside them.`,
    uniqueFeature: "Messages are embedded inside valid-looking C++ code using 10+ templates — looks like debugging to outsiders, insiders decrypt with one click",
    techStack: ["Node.js", "Vanilla JS", "HTML/CSS", "REST API"],
  },
  {
    id: 4,
    type: "web",
    name: "FixMySociety",
    tagline: "Civic issue reporting platform — 2nd Prize SIH",
    year: "2024",
    status: "completed",
    liveDemo: "https://fix-my-society.vercel.app/",
    github: "https://github.com/MANSAMUNDHRA/fix-my-society",
    image: "/fixmysociety.png",
    tags: ["HTML", "CSS", "JavaScript"],
    description: `🥈 2nd Prize at KIIT Internal Smart India Hackathon. A civic platform where citizens report issues and administrators resolve them.`,
    uniqueFeature: "Admin dashboard, photo uploads, voice notes, and anonymous submissions in a complete civic management system",
    techStack: ["HTML5", "CSS3", "JavaScript", "JSON", "Local Storage"],
  },
  {
    id: 5,
    type: "ml",
    name: "ARD Stock Prediction",
    tagline: "Deep learning for Nifty 50 using CARD architecture",
    year: "2025",
    status: "in-progress",
    liveDemo: null,
    github: "https://github.com/MANSAMUNDHRA/ARD-Stock-Prediction",
    image: "/download.jpg",
    tags: ["Python", "PyTorch", "Time Series"],
    description: `Deep learning-based stock price prediction using Channel Aligned Robust Blend Transformer (CARD) for Nifty 50 stocks.`,
    uniqueFeature: "Dual attention mechanism and multi-task learning for simultaneous returns and volatility prediction",
    techStack: ["Python 3.10", "PyTorch 2.1", "NumPy", "Pandas", "Fyers API"],
    progress: "70%",
  },
  {
    id: 6,
    type: "ml",
    name: "AI Offline Therapist",
    tagline: "Mental wellness companion — 100% on-device, no internet",
    year: "2025",
    status: "coming-soon",
    liveDemo: null,
    github: null,
    image: "/contact.jpeg",
    tags: ["On-device AI", "React Native"],
    description: `A private, offline-first AI therapist that runs entirely on-device. No data leaves your phone, complete privacy.`,
    uniqueFeature: "100% offline LLM with no internet required — complete privacy and zero cloud costs",
    techStack: ["TensorFlow Lite", "React Native", "Local embeddings"],
    progress: "0%",
  },
];

const STATUS = {
  completed:    { label: "Completed",   bg: "#c8b49a", text: "#1a1208" },
  "in-progress":{ label: "In Progress", bg: "#e8c97a", text: "#1a1208" },
  "coming-soon":{ label: "Coming Soon", bg: "#9a9a9a", text: "#1a1208" },
};

export default function ProjectsPage({ onExitToTools }: { onExitToTools?: () => void }) {
  const [selectedType, setSelectedType] = useState("all");
  const [cardsVisible, setCardsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof allProjects[0] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "stack" | "links">("about");
  const scrollRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);
  const popupScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setCardsVisible(true), 150);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (selectedProject) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0 && !lockRef.current) {
        lockRef.current = true;
        onExitToTools?.();
        setTimeout(() => { lockRef.current = false; }, 800);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onExitToTools, selectedProject]);

  const filtered = selectedType === "all"
    ? allProjects
    : allProjects.filter(p => p.type === selectedType);

  const handleCardWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY * 0.8;
    }
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#111009",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Georgia', serif",
    }}>

      {/* Subtle noise texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* ── HEADER ── */}
      <div style={{
        padding: "32px 56px 16px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        position: "relative", zIndex: 1,
        flexShrink: 0,
      }}>
        <div>
          <p style={{
            fontFamily: "monospace",
            fontSize: "0.42rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(210,190,160,0.35)",
            marginBottom: "4px",
          }}>selected work</p>
          <h1 style={{
            fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
            fontWeight: "700",
            color: "#e8d9c0",
            letterSpacing: "-0.01em",
            margin: 0,
          }}>Projects</h1>
        </div>

        {/* Filter pills */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {projectTypes.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              style={{
                padding: "5px 14px",
                borderRadius: "20px",
                border: selectedType === t.id
                  ? "1px solid #c8b49a"
                  : "1px solid rgba(200,180,154,0.2)",
                background: selectedType === t.id
                  ? "#c8b49a"
                  : "transparent",
                color: selectedType === t.id ? "#111009" : "rgba(200,180,154,0.5)",
                fontSize: "0.55rem",
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontWeight: selectedType === t.id ? "700" : "400",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CARDS ROW ── */}
      <div
        ref={scrollRef}
        onWheel={handleCardWheel}
        style={{
          flex: 1,
          display: "flex",
          gap: "18px",
          overflowX: "auto",
          overflowY: "hidden",
          padding: "8px 56px 32px",
          scrollBehavior: "smooth",
          position: "relative", zIndex: 1,
          scrollbarWidth: "none",
        }}
      >
        {filtered.map((project, i) => {
          const s = STATUS[project.status as keyof typeof STATUS];
          const isHov = hoveredId === project.id;
          return (
            <div
              key={project.id}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => { setSelectedProject(project); setActiveTab("about"); }}
              style={{
                flex: "0 0 calc((100% - 36px) / 3)",
                minWidth: "240px",
                maxWidth: "340px",
                background: isHov ? "#2a2016" : "#1c1810",
                borderRadius: "18px",
                overflow: "hidden",
                cursor: "pointer",
                border: `1px solid ${isHov ? "rgba(200,180,154,0.25)" : "rgba(200,180,154,0.08)"}`,
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible
                  ? isHov ? "translateY(-5px)" : "translateY(0)"
                  : "translateY(24px)",
                transition: `opacity 0.4s ease ${i * 80}ms, transform 0.3s ease, background 0.2s ease, border-color 0.2s ease`,
                boxShadow: isHov
                  ? "0 16px 40px rgba(0,0,0,0.5)"
                  : "0 4px 20px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Image */}
              <div style={{
                height: "200px",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
                background: "#0d0c08",
              }}>
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  style={{
                    objectFit: "cover",
                    transform: isHov ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.5s ease",
                    opacity: 0.85,
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(17,16,9,0.7) 100%)",
                }} />

                {/* Status */}
                <div style={{
                  position: "absolute", top: "12px", left: "12px",
                  background: s.bg,
                  color: s.text,
                  fontSize: "0.42rem",
                  fontFamily: "monospace",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: "20px",
                }}>
                  {s.label}
                </div>

                {/* Year */}
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.42rem",
                  fontFamily: "monospace",
                  letterSpacing: "0.1em",
                }}>
                  {project.year}
                </div>
              </div>

              {/* Text content */}
              <div style={{
                padding: "16px 18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flex: 1,
              }}>
                <h3 style={{
                  color: "#e8d9c0",
                  fontSize: "1rem",
                  fontWeight: "700",
                  margin: 0,
                  letterSpacing: "-0.01em",
                  fontFamily: "Georgia, serif",
                }}>
                  {project.name}
                </h3>

                <p style={{
                  color: "rgba(210,190,160,0.55)",
                  fontSize: "0.65rem",
                  lineHeight: 1.55,
                  margin: 0,
                  fontFamily: "monospace",
                  letterSpacing: "0.01em",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  {project.tagline}
                </p>

                {/* Tags */}
                <div style={{
                  display: "flex", flexWrap: "wrap", gap: "5px",
                  marginTop: "auto",
                }}>
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      background: "rgba(200,180,154,0.08)",
                      color: "rgba(200,180,154,0.5)",
                      padding: "3px 9px",
                      borderRadius: "20px",
                      fontSize: "0.42rem",
                      fontFamily: "monospace",
                      letterSpacing: "0.08em",
                      border: "1px solid rgba(200,180,154,0.1)",
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Read more */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  marginTop: "4px",
                  opacity: isHov ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}>
                  <span style={{
                    fontFamily: "monospace",
                    fontSize: "0.42rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#c8b49a",
                  }}>View Project</span>
                  <span style={{ color: "#c8b49a", fontSize: "0.6rem" }}>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll hint */}
      <div style={{
        textAlign: "center",
        paddingBottom: "16px",
        position: "relative", zIndex: 1,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "monospace",
          fontSize: "0.4rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(200,180,154,0.2)",
        }}>scroll to see more →</span>
      </div>

      {/* ── POPUP ── */}
      {selectedProject && (() => {
        const s = STATUS[selectedProject.status as keyof typeof STATUS];
        return (
          <div
            onClick={() => setSelectedProject(null)}
            style={{
              position: "fixed", inset: 0,
              zIndex: 1000,
              background: "rgba(10,9,5,0.85)",
              backdropFilter: "blur(18px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "28px",
            }}
          >
            <div
              ref={popupScrollRef}
              onClick={e => e.stopPropagation()}
              style={{
                background: "#1c1810",
                borderRadius: "22px",
                maxWidth: "680px",
                width: "100%",
                maxHeight: "86vh",
                overflowY: "auto",
                border: "1px solid rgba(200,180,154,0.12)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
                animation: "popIn 0.3s cubic-bezier(0.34,1.4,0.64,1) forwards",
                scrollbarWidth: "none",
              }}
            >
              {/* Hero image */}
              <div style={{
                width: "100%", height: "220px",
                position: "relative",
                borderRadius: "22px 22px 0 0",
                overflow: "hidden",
                background: "#0d0c08",
                flexShrink: 0,
              }}>
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  fill
                  style={{ objectFit: "cover", opacity: 0.75 }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 30%, #1c1810 100%)",
                }} />

                {/* Close */}
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    position: "absolute", top: "16px", right: "16px",
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.5)",
                    border: "1px solid rgba(200,180,154,0.2)",
                    color: "rgba(200,180,154,0.7)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(200,180,154,0.15)";
                    e.currentTarget.style.color = "#e8d9c0";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.5)";
                    e.currentTarget.style.color = "rgba(200,180,154,0.7)";
                  }}
                >✕</button>
              </div>

              {/* Content */}
              <div style={{ padding: "24px 32px 32px" }}>

                {/* Pills row */}
                <div style={{ display: "flex", gap: "7px", marginBottom: "14px" }}>
                  <span style={{
                    background: s.bg, color: s.text,
                    fontSize: "0.42rem", fontFamily: "monospace",
                    fontWeight: "700", letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: "20px",
                  }}>{s.label}</span>
                  <span style={{
                    background: "rgba(200,180,154,0.08)",
                    color: "rgba(200,180,154,0.4)",
                    fontSize: "0.42rem", fontFamily: "monospace",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: "20px",
                    border: "1px solid rgba(200,180,154,0.1)",
                  }}>{selectedProject.year}</span>
                </div>

                {/* Name */}
                <h2 style={{
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  fontWeight: "700",
                  color: "#e8d9c0",
                  letterSpacing: "-0.02em",
                  margin: "0 0 6px",
                  fontFamily: "Georgia, serif",
                }}>
                  {selectedProject.name}
                </h2>

                {/* Tagline */}
                <p style={{
                  fontSize: "0.7rem",
                  color: "rgba(210,190,160,0.5)",
                  fontFamily: "monospace",
                  letterSpacing: "0.03em",
                  marginBottom: "22px",
                  lineHeight: 1.5,
                }}>
                  {selectedProject.tagline}
                </p>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(200,180,154,0.08)", marginBottom: "20px" }} />

                {/* Tab bar */}
                <div style={{
                  display: "flex", gap: "0",
                  marginBottom: "20px",
                  borderBottom: "1px solid rgba(200,180,154,0.08)",
                }}>
                  {(["about", "stack", "links"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        fontFamily: "monospace",
                        fontSize: "0.45rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: activeTab === tab ? "#c8b49a" : "rgba(200,180,154,0.3)",
                        background: "none",
                        border: "none",
                        borderBottom: activeTab === tab
                          ? "2px solid #c8b49a"
                          : "2px solid transparent",
                        padding: "10px 18px 8px",
                        cursor: "pointer",
                        marginBottom: "-1px",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === "about" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p style={{
                      color: "rgba(210,190,160,0.75)",
                      lineHeight: 1.8,
                      fontSize: "0.8rem",
                      margin: 0,
                    }}>
                      {selectedProject.description}
                    </p>

                    {/* Unique feature */}
                    <div style={{
                      background: "rgba(200,180,154,0.05)",
                      border: "1px solid rgba(200,180,154,0.1)",
                      borderLeft: "3px solid #c8b49a",
                      borderRadius: "0 10px 10px 0",
                      padding: "14px 16px",
                    }}>
                      <p style={{
                        fontFamily: "monospace",
                        fontSize: "0.42rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(200,180,154,0.35)",
                        marginBottom: "6px",
                      }}>Key Feature</p>
                      <p style={{
                        color: "rgba(210,190,160,0.7)",
                        fontSize: "0.75rem",
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        {selectedProject.uniqueFeature}
                      </p>
                    </div>

                    {/* Progress */}
                    {selectedProject.progress && (
                      <div>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}>
                          <span style={{
                            fontFamily: "monospace", fontSize: "0.42rem",
                            letterSpacing: "0.2em", textTransform: "uppercase",
                            color: "rgba(200,180,154,0.3)",
                          }}>Progress</span>
                          <span style={{
                            fontFamily: "monospace", fontSize: "0.5rem",
                            color: "#c8b49a",
                          }}>{selectedProject.progress}</span>
                        </div>
                        <div style={{
                          height: "2px",
                          background: "rgba(200,180,154,0.1)",
                          borderRadius: "1px",
                        }}>
                          <div style={{
                            width: selectedProject.progress,
                            height: "100%",
                            background: "linear-gradient(to right, #c8b49a, #e8d9c0)",
                            borderRadius: "1px",
                          }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "stack" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedProject.techStack.map(tech => (
                      <span key={tech} style={{
                        background: "rgba(200,180,154,0.07)",
                        color: "rgba(210,190,160,0.65)",
                        border: "1px solid rgba(200,180,154,0.12)",
                        padding: "7px 14px",
                        borderRadius: "20px",
                        fontSize: "0.6rem",
                        fontFamily: "monospace",
                        letterSpacing: "0.06em",
                      }}>{tech}</span>
                    ))}
                  </div>
                )}

                {activeTab === "links" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {selectedProject.github && (
                      <a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          background: "rgba(200,180,154,0.06)",
                          border: "1px solid rgba(200,180,154,0.12)",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(200,180,154,0.1)";
                          e.currentTarget.style.borderColor = "rgba(200,180,154,0.25)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(200,180,154,0.06)";
                          e.currentTarget.style.borderColor = "rgba(200,180,154,0.12)";
                        }}
                      >
                        <div>
                          <div style={{
                            fontFamily: "monospace", fontSize: "0.42rem",
                            letterSpacing: "0.2em", textTransform: "uppercase",
                            color: "rgba(200,180,154,0.3)", marginBottom: "3px",
                          }}>GitHub Repository</div>
                          <div style={{
                            color: "#c8b49a", fontSize: "0.7rem",
                            fontFamily: "monospace",
                          }}>{selectedProject.github.replace("https://", "")}</div>
                        </div>
                        <span style={{ color: "rgba(200,180,154,0.4)", fontSize: "0.9rem" }}>↗</span>
                      </a>
                    )}
                    {selectedProject.liveDemo && (
                      <a
                        href={selectedProject.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          background: "#c8b49a",
                          border: "none",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "#d4c2ab";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "#c8b49a";
                        }}
                      >
                        <div>
                          <div style={{
                            fontFamily: "monospace", fontSize: "0.42rem",
                            letterSpacing: "0.2em", textTransform: "uppercase",
                            color: "rgba(17,16,9,0.5)", marginBottom: "3px",
                          }}>Live Demo</div>
                          <div style={{
                            color: "#111009", fontSize: "0.7rem",
                            fontFamily: "monospace", fontWeight: "600",
                          }}>{selectedProject.liveDemo.replace("https://", "")}</div>
                        </div>
                        <span style={{ color: "rgba(17,16,9,0.6)", fontSize: "0.9rem" }}>↗</span>
                      </a>
                    )}
                    {selectedProject.apk && (
                      <a
                        href={selectedProject.apk}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex", alignItems: "center",
                          justifyContent: "space-between",
                          padding: "14px 18px",
                          borderRadius: "12px",
                          background: "rgba(200,180,154,0.06)",
                          border: "1px solid rgba(200,180,154,0.12)",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(200,180,154,0.1)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(200,180,154,0.06)";
                        }}
                      >
                        <div>
                          <div style={{
                            fontFamily: "monospace", fontSize: "0.42rem",
                            letterSpacing: "0.2em", textTransform: "uppercase",
                            color: "rgba(200,180,154,0.3)", marginBottom: "3px",
                          }}>Download APK</div>
                          <div style={{
                            color: "#c8b49a", fontSize: "0.7rem",
                            fontFamily: "monospace",
                          }}>GitHub Releases</div>
                        </div>
                        <span style={{ color: "rgba(200,180,154,0.4)", fontSize: "0.9rem" }}>↗</span>
                      </a>
                    )}
                    {!selectedProject.github && !selectedProject.liveDemo && !selectedProject.apk && (
                      <p style={{
                        fontFamily: "monospace", fontSize: "0.6rem",
                        color: "rgba(200,180,154,0.3)",
                        letterSpacing: "0.05em",
                      }}>Links coming soon.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}