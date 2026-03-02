"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import AboutPage from "./components/AboutPage";
import SkillsPage from "./components/SkillsPage";
import ToolsPage from "./components/ToolPage";
import ProjectsPage, { type ProjectItem } from "./components/ProjectsPage";
import ContactPage from "./components/ContactPage";
import ExperiencePage from "./components/ExperiencePage";

// Page order for vertical stack - ALL 6 PAGES
const PAGES = ["about", "skills", "tools", "projects", "experience", "contact"] as const;
type PageName = typeof PAGES[number];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [slide, setSlide] = useState(1);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activePage, setActivePage] = useState<PageName>("about");
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const [gearDrop, setGearDrop] = useState(false);
  const [gearStartX, setGearStartX] = useState(0);
  const [gearStartY, setGearStartY] = useState(0);
  const gearRef = useRef<HTMLDivElement>(null);

  // Refs — always current, never stale in event handlers
  const slideRef = useRef(1);
  const activePageRef = useRef<PageName>("about");
  const scrollLockedRef = useRef(false);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => setIsLoading(false);

  const goToSlide = (next: number) => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    slideRef.current = next;
    setSlide(next);
    if (next !== 1) setShowWelcomeText(false);
    else setShowWelcomeText(true);
    if (next === 2) setGearDrop(false);
    const lockTime = next === 2 ? 3000 : 1000;
    setTimeout(() => { scrollLockedRef.current = false; }, lockTime);
  };

  const goToPage = (page: PageName) => {
    activePageRef.current = page;
    setActivePage(page);
  };

  const scrollDown = () => {
    if (scrollLockedRef.current) return;
    const idx = PAGES.indexOf(activePageRef.current);
    if (idx < PAGES.length - 1) {
      scrollLockedRef.current = true;
      const next = PAGES[idx + 1];
      activePageRef.current = next;
      setActivePage(next);
      setTimeout(() => { scrollLockedRef.current = false; }, 750);
    }
  };

  const scrollUp = () => {
    if (scrollLockedRef.current) return;
    const idx = PAGES.indexOf(activePageRef.current);
    if (idx > 0) {
      scrollLockedRef.current = true;
      const prev = PAGES[idx - 1];
      activePageRef.current = prev;
      setActivePage(prev);
      setTimeout(() => { scrollLockedRef.current = false; }, 750);
    } else {
      goToSlide(2);
    }
  };

  // Single wheel handler — registered once, reads only from refs
  useEffect(() => {
    if (!isReady) return;

    const handleScroll = (e: WheelEvent) => {
      if (scrollLockedRef.current) return;
      const currentSlide = slideRef.current;
      const currentPage = activePageRef.current;

      if (currentSlide === 1 && e.deltaY > 0) { goToSlide(2); return; }

      if (currentSlide === 2) {
        if (e.deltaY > 0) {
          scrollLockedRef.current = true;
          activePageRef.current = "about";
          setActivePage("about");
          if (gearRef.current) {
            const rect = gearRef.current.getBoundingClientRect();
            setGearStartX(rect.left);
            setGearStartY(rect.top);
          }
          setGearDrop(true);
          setTimeout(() => { slideRef.current = 3; setSlide(3); }, 300);
          setTimeout(() => { scrollLockedRef.current = false; }, 1300);
          return;
        }
        if (e.deltaY < 0) { goToSlide(1); return; }
      }

      if (currentSlide === 3) {
        if (e.deltaY > 30) { scrollDown(); return; }
        if (e.deltaY < -30) { scrollUp(); return; }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      const currentSlide = slideRef.current;
      if (delta > 0) {
        if (currentSlide === 1) { goToSlide(2); return; }
        if (currentSlide === 2) {
          scrollLockedRef.current = true;
          activePageRef.current = "about";
          setActivePage("about");
          if (gearRef.current) {
            const rect = gearRef.current.getBoundingClientRect();
            setGearStartX(rect.left);
            setGearStartY(rect.top);
          }
          setGearDrop(true);
          setTimeout(() => { slideRef.current = 3; setSlide(3); }, 300);
          setTimeout(() => { scrollLockedRef.current = false; }, 1300);
          return;
        }
        if (currentSlide === 3) scrollDown();
      } else {
        if (currentSlide === 3) scrollUp();
        else if (currentSlide === 2) goToSlide(1);
      }
    };

    window.addEventListener("wheel", handleScroll);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isReady]); // ONLY isReady — handler never re-registers, always reads from refs

  useEffect(() => {
    if (slide !== 2 || !isReady) return;
    const typingSpeed = 100, backspaceSpeed = 50, pauseBetween = 500;
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === 0) {
      const target = "hey,";
      if (charIndex < target.length) timeout = setTimeout(() => { setLine1(target.substring(0, charIndex + 1)); setCharIndex(charIndex + 1); }, typingSpeed);
      else timeout = setTimeout(() => { setPhase(1); setCharIndex(0); }, pauseBetween);
    } else if (phase === 1) {
      const target = "I'm Clueless";
      if (charIndex < target.length) timeout = setTimeout(() => { setLine2(target.substring(0, charIndex + 1)); setCharIndex(charIndex + 1); }, typingSpeed);
      else timeout = setTimeout(() => { setPhase(2); setCharIndex(target.length); }, pauseBetween * 2);
    } else if (phase === 2) {
      const target = "I'm Clueless";
      if (charIndex > 0) timeout = setTimeout(() => { setLine2(target.substring(0, charIndex - 1)); setCharIndex(charIndex - 1); }, backspaceSpeed);
      else timeout = setTimeout(() => { setPhase(3); setCharIndex(0); }, pauseBetween);
    } else if (phase === 3) {
      const target = "I'm Mansha";
      if (charIndex < target.length) timeout = setTimeout(() => { setLine2(target.substring(0, charIndex + 1)); setCharIndex(charIndex + 1); }, typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [phase, charIndex, slide, isReady]);

  if (isLoading) return <Loading onLoadingComplete={handleLoadingComplete} />;

  const pageIndex = PAGES.indexOf(activePage);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
    >

      {/* ════ SLIDES 1 & 2 — Landing ════ */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", justifyContent: "center", alignItems: "center",
        opacity: slide <= 2 ? 1 : 0,
        transform: slide === 3 ? "translateY(-40px)" : "translateY(0)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        pointerEvents: slide <= 2 ? "all" : "none",
      }}>
        <div className="absolute inset-0 bg-black/50" style={{ zIndex: 1 }} />

        <div style={{
          position: "absolute", top: 0, bottom: 0,
          right: slide === 1 ? "calc(50% - 420px)" : "-140px",
          transition: "right 1.5s ease-in-out",
          zIndex: 2, display: "flex", alignItems: "center",
        }}>
          <div style={{
            position: "absolute", top: "50%", left: "30%",
            transform: "translate(-20%, -50%)",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, #FFE000 0%, #FFA500 35%, #cc5500 65%, #3a0a00 85%, transparent 100%)",
            filter: "blur(5px)", zIndex: 1,
          }} />
          <div style={{ position: "relative", zIndex: 2 }}>
            <Image src="/skull.png" alt="Skull" width={2000} height={3000}
              style={{ height: "130vh", width: "auto", objectFit: "contain" }} priority />
          </div>

          {!gearDrop && (
            <div ref={gearRef} style={{
              position: "absolute", top: "35%", left: "55%",
              marginLeft: "-75px", marginTop: "-75px", zIndex: 3,
            }}>
              <img src="/gear.png" alt="Gear" width={150} height={150} className="spin-gear" />
            </div>
          )}

          {showWelcomeText && slide === 1 && (
            <div style={{
              position: "absolute", top: "80%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10, textAlign: "center", width: "100%", pointerEvents: "none",
            }}>
              <h4 style={{
                color: "white", fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontFamily: "monospace", fontWeight: "bold",
                textTransform: "uppercase", letterSpacing: "0.15em",
                textShadow: "0 0 30px rgba(248, 95, 7, 0.7)",
                background: "rgba(0,0,0,0.3)", padding: "12px 24px",
                borderRadius: "4px",display: "inline-block",
              }}>A Look Into My Thinking</h4>
            </div>
          )}
        </div>

        <div style={{
          position: "absolute", top: "30px", left: "32px", zIndex: 30,
          opacity: slide === 1 ? 1 : 0, transition: "opacity 0.6s ease-in-out",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: "20px", height: "32px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "10px", position: "relative" }}>
            <div style={{ width: "3px", height: "6px", background: "rgba(255,200,80,0.8)", borderRadius: "2px", position: "absolute", top: "5px", left: "50%", transform: "translateX(-50%)", animation: "scrollDot 1.5s ease-in-out infinite" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</p>
        </div>

        <div style={{
          position: "absolute", left: "6%", top: "50%",
          transform: "translateY(-50%)", zIndex: 30,
          opacity: slide === 2 ? 1 : 0, transition: "opacity 1.2s ease-in-out 0.8s",
          display: "flex", flexDirection: "column",
        }}>
          <h1 className="text-white font-bold uppercase" style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "0.05em",
            lineHeight: 1.1, fontFamily: "monospace",
            textShadow: "0 0 40px rgba(255,160,0,0.5)",
          }}>
            <span style={{ display: "block" }}>{line1}{phase === 0 && <span className="animate-pulse">|</span>}</span>
            <span style={{ display: "block", minHeight: "1.1em" }}>{line2}{phase !== 0 && <span className="animate-pulse">|</span>}</span>
          </h1>
          <div style={{ width: "60px", height: "2px", background: "linear-gradient(to right, #FFA500, transparent)", marginTop: "16px" }} />
        </div>

        <div style={{
          position: "absolute", bottom: "32px", left: "32px", zIndex: 30,
          opacity: slide === 2 ? 1 : 0, transition: "opacity 0.6s ease-in-out 2s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: "20px", height: "32px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "10px", position: "relative" }}>
            <div style={{ width: "3px", height: "6px", background: "rgba(255,200,80,0.8)", borderRadius: "2px", position: "absolute", top: "5px", left: "50%", transform: "translateX(-50%)", animation: "scrollDot 1.5s ease-in-out infinite" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</p>
        </div>
      </div>

      {/* ════ SLIDE 3 — Vertical page stack - ALL 6 PAGES ════ */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: slide === 3 ? 1 : 0,
        transform: slide === 3 ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        pointerEvents: slide === 3 ? "all" : "none",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ position: "relative", zIndex: 1000, flexShrink: 0 }}>
          <NavBar activePage={activePage} onNavigate={(page) => goToPage(page as PageName)} />
        </div>

        {/* Scrolling track — ALL 6 PAGES */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: `${PAGES.length * 100}%`,
            transform: `translateY(-${pageIndex * (100 / PAGES.length)}%)`,
            transition: "transform 0.9s cubic-bezier(0.77,0,0.18,1)",
            willChange: "transform",
          }}>
            <div style={{ height: `${100 / PAGES.length}%`, position: "relative" }}>
              <AboutPage />
            </div>
            <div style={{ height: `${100 / PAGES.length}%`, position: "relative" }}>
              <SkillsPage onExitToTools={(r) => { setRotation(r); goToPage("tools"); }} />
            </div>
            <div style={{ height: `${100 / PAGES.length}%`, position: "relative" }}>
              {/* <ToolsPage activePage={activePage} /> */}
              <ToolsPage 
    activePage={activePage} 
    isVisible={activePage === "tools"} 
  />
            </div>
            {/* Projects — overflow visible so popup isn't clipped */}
            <div style={{ height: `${100 / PAGES.length}%`, position: "relative", overflow: "visible" }}>
              <ProjectsPage onExitToTools={() => goToPage("tools")} onOpenProject={(p) => setSelectedProject(p)} />
            </div>
            <div style={{ height: `${100 / PAGES.length}%`, position: "relative" }}>
              <ExperiencePage />
            </div>
            <div style={{ height: `${100 / PAGES.length}%`, position: "relative" }}>
              <ContactPage onExitToProjects={() => goToPage("experience")} />
            </div>
          </div>
        </div>
      </div>

      {/* ════ FALLING GEAR — untouched ════ */}
      {gearDrop && (
        <div style={{
          position: "fixed",
          left: gearStartX,
          top: slide === 2 ? gearStartY : "85vh",
          transition: "top 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
          zIndex: 9999,
          pointerEvents: "none",
          opacity: activePage === "about" ? 1 : 0,
        }}>
          <img src="/gear.png" width={150} height={150} className="spin-gear" alt="Gear" />
        </div>
      )}
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>

      {/* ════ PROJECT POPUP — at root, above willChange:transform ════ */}
      {selectedProject && (() => {
        const p = selectedProject;
        const STATUS: Record<string, { label: string; bg: string; text: string }> = {
          completed: { label: "Completed", bg: "rgba(35,134,54,0.15)", text: "#3fb950" },
          "in-progress": { label: "In Progress", bg: "rgba(187,128,9,0.15)", text: "#d29922" },
          planned: { label: "Planned", bg: "rgba(31,111,235,0.1)", text: "#58a6ff" },
        };
        return (
          <div
            onClick={() => setSelectedProject(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 99999,
              background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "#0d1117", borderRadius: "14px",
                width: "min(960px, 95vw)", maxHeight: "88vh",
                border: "1px solid #30363d",
                animation: "popIn 0.25s ease",
                display: "flex", flexDirection: "column",
                overflow: "hidden",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              }}
            >
              {/* Top bar */}
              <div style={{
                flexShrink: 0,
                background: "#161b22", borderBottom: "1px solid #30363d",
                padding: "10px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#8b949e", fontSize: "0.7rem", fontFamily: "monospace" }}>MANSAMUNDHRA /</span>
                  <span style={{ color: "#B3CFE5", fontSize: "0.7rem", fontFamily: "monospace", fontWeight: 600 }}>{p.name}</span>
                  <span style={{
                    fontSize: "0.5rem", fontFamily: "monospace", padding: "2px 8px", borderRadius: "20px",
                    border: "1px solid #30363d",
                    color: STATUS[p.status]?.text ?? "#8b949e",
                    background: STATUS[p.status]?.bg ?? "transparent",
                  }}>{STATUS[p.status]?.label ?? p.status}</span>
                </div>
                <button onClick={() => setSelectedProject(null)} style={{
                  width: "26px", height: "26px", borderRadius: "6px", background: "#21262d",
                  border: "1px solid #3d444d", color: "#8b949e", cursor: "pointer",
                  fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              </div>

              {/* Two columns */}
              <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

                {/* LEFT */}
                <div style={{
                  flex: "0 0 58%", overflowY: "auto",
                  borderRight: "1px solid #21262d",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ height: "200px", position: "relative", flexShrink: 0, background: "#161b22" }}>
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0d1117 0%, transparent 55%)" }} />
                    <div style={{ position: "absolute", bottom: "16px", left: "24px" }}>
                      <h2 style={{ color: "#f0f6fc", fontSize: "1.4rem", fontWeight: 700, margin: 0, fontFamily: "Georgia, serif" }}>{p.name}</h2>
                      <p style={{ color: "rgba(240,246,252,0.55)", fontSize: "0.72rem", margin: "4px 0 0", fontFamily: "monospace" }}>{p.tagline}</p>
                    </div>
                  </div>
                  <div style={{ padding: "22px 24px 0" }}>
                    <p style={{ color: "#6e7681", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>📄 About</p>
                    <p style={{ color: "#c9d1d9", fontSize: "0.78rem", lineHeight: 1.85, margin: 0, fontFamily: "monospace" }}>{p.description}</p>
                  </div>
                  <div style={{ margin: "20px 24px 24px", padding: "16px 18px", background: "rgba(31,111,235,0.07)", borderRadius: "8px", border: "1px solid rgba(31,111,235,0.18)" }}>
                    <p style={{ color: "#B3CFE5", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>⚡ What makes it different</p>
                    <p style={{ color: "#c9d1d9", fontSize: "0.78rem", lineHeight: 1.8, margin: 0, fontFamily: "monospace" }}>{p.uniqueFeature}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div style={{ flex: 1, overflowY: "auto", padding: "24px 22px", display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <p style={{ color: "#6e7681", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>🔗 Links</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: "#161b22", border: "1px solid #30363d", color: "#c9d1d9", textDecoration: "none" }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, color: "#8b949e" }}><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                          <div>
                            <div style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 600 }}>GitHub Repository</div>
                            <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "#8b949e", marginTop: "2px" }}>Opens in new tab →</div>
                          </div>
                        </a>
                      )}
                      {p.liveDemo && (
                        <a href={p.liveDemo} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: "#58a6ff", border: "1px solid #58a6ff", color: "#fff", textDecoration: "none" }}>
                          <span style={{ fontSize: "0.9rem" }}>↗</span>
                          <div>
                            <div style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 600 }}>Live Demo</div>
                            <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>Opens in new tab →</div>
                          </div>
                        </a>
                      )}
                      {(p as any).apk && (
                        <a href={(p as any).apk} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "8px", background: "#238636", border: "1px solid #7a5c3a", color: "#fff", textDecoration: "none" }}>
                          <span style={{ fontSize: "0.9rem" }}>↓</span>
                          <div>
                            <div style={{ fontSize: "0.72rem", fontFamily: "monospace", fontWeight: 600 }}>Download APK</div>
                            <div style={{ fontSize: "0.58rem", fontFamily: "monospace", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>Opens in new tab →</div>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid #21262d" }} />
                  <div>
                    <p style={{ color: "#6e7681", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>🛠 Tech Stack</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                      {p.techStack.map((tech: string) => (
                        <span key={tech} style={{ padding: "5px 12px", borderRadius: "20px", background: "#161b22", border: "1px solid #30363d", color: "#8b949e", fontSize: "0.65rem", fontFamily: "monospace", letterSpacing: "0.04em" }}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  {(p as any).progress && (p as any).progress !== "0%" && (
                    <>
                      <div style={{ borderTop: "1px solid #21262d" }} />
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ color: "#6e7681", fontSize: "0.62rem", fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase" }}>Progress</span>
                          <span style={{ color: "#B3CFE5", fontSize: "0.65rem", fontFamily: "monospace" }}>{(p as any).progress}</span>
                        </div>
                        <div style={{ background: "#21262d", borderRadius: "4px", height: "5px", overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: "4px", background: "linear-gradient(to right, #58a6ff, #B3CFE5)", width: (p as any).progress, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    </>
                  )}
                  <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #21262d" }}>
                    <span style={{ color: "#484f58", fontSize: "0.6rem", fontFamily: "monospace", letterSpacing: "0.1em" }}>{p.year} · {p.type.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
            <style>{`
              @keyframes popIn { from { opacity:0; transform:scale(0.97) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
              div::-webkit-scrollbar { width:5px; height:5px; }
              div::-webkit-scrollbar-track { background:#161b22; }
              div::-webkit-scrollbar-thumb { background:#3d444d; border-radius:4px; }
              div::-webkit-scrollbar-thumb:hover { background:#58a6ff; }
            `}</style>
          </div>
        );
      })()}

    </div>
  );
}