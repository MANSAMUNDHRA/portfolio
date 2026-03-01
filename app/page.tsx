"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import AboutPage from "./components/AboutPage";
import SkillsPage from "./components/SkillsPage";
import ToolsPage from "./components/ToolPage";
import ProjectsPage from "./components/ProjectsPage";
import ContactPage from "./components/ContactPage";

// Page order for vertical stack
const PAGES = ["about", "skills", "tools", "projects"] as const;
type PageName = typeof PAGES[number];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [slide, setSlide] = useState(1);          // 1 = landing1, 2 = landing2, 3 = main content
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activePage, setActivePage] = useState<PageName>("about");
  const [scrollLocked, setScrollLocked] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const [rotation, setRotation] = useState(0);

  // Gear drop
  const [gearDrop, setGearDrop] = useState(false);
  const [gearStartX, setGearStartX] = useState(0);
  const [gearStartY, setGearStartY] = useState(0);
  const gearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => setIsLoading(false);

  // ── Slide transition (landing slides) ─────────────────────────────
  const goToSlide = (next: number) => {
    if (scrollLocked) return;
    setScrollLocked(true);
    setSlide(next);
    if (next !== 1) setShowWelcomeText(false);
    else setShowWelcomeText(true);
    if (next === 2) setGearDrop(false); // reset gear when going back
    const lockTime = next === 2 ? 3000 : 1000;
    setTimeout(() => setScrollLocked(false), lockTime);
  };

  // ── Sub-page navigation (vertical stack) ─────────────────────────
  const goToPage = (page: PageName) => setActivePage(page);

  const scrollDown = () => {
    const idx = PAGES.indexOf(activePage);
    if (idx < PAGES.length - 1) {
      setScrollLocked(true);
      setActivePage(PAGES[idx + 1]);
      setTimeout(() => setScrollLocked(false), 900);
    }
  };

  const scrollUp = () => {
    const idx = PAGES.indexOf(activePage);
    if (idx > 0) {
      setScrollLocked(true);
      setActivePage(PAGES[idx - 1]);
      setTimeout(() => setScrollLocked(false), 900);
    } else {
      // at "about", go back to landing
      goToSlide(2);
    }
  };

  // ── Wheel + touch handlers ────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;

    const handleScroll = (e: WheelEvent) => {
      if (scrollLocked) return;

      if (slide === 1 && e.deltaY > 0) { goToSlide(2); return; }

      if (slide === 2) {
        if (e.deltaY > 0) {
          // Lock immediately — prevents fast/double scrolls skipping past About
          setScrollLocked(true);
          // Always reset to About before entering slide 3
          setActivePage("about");
          if (gearRef.current) {
            const rect = gearRef.current.getBoundingClientRect();
            setGearStartX(rect.left);
            setGearStartY(rect.top);
          }
          setGearDrop(true);
          setTimeout(() => goToSlide(3), 300);
          setTimeout(() => setScrollLocked(false), 1300);
          return;
        }
        if (e.deltaY < 0) { goToSlide(1); return; }
      }

      if (slide === 3) {
        if (e.deltaY > 60) { scrollDown(); return; }
        if (e.deltaY < -60) { scrollUp(); return; }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      if (delta > 0) {
        if (slide === 1) goToSlide(2);
        else if (slide === 2) {
          setScrollLocked(true);
          setActivePage("about");
          if (gearRef.current) {
            const rect = gearRef.current.getBoundingClientRect();
            setGearStartX(rect.left);
            setGearStartY(rect.top);
          }
          setGearDrop(true);
          setTimeout(() => goToSlide(3), 300);
          setTimeout(() => setScrollLocked(false), 1300);
        } else if (slide === 3) scrollDown();
      } else {
        if (slide === 3) scrollUp();
        else if (slide === 2) goToSlide(1);
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
  }, [slide, isReady, scrollLocked, activePage]);

  // ── Typewriter ────────────────────────────────────────────────────
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

  // ── Active page index for vertical offset ─────────────────────────
  const pageIndex = PAGES.indexOf(activePage);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
    >

      {/* ════════════════════════════════════════════
          SLIDES 1 & 2  —  Landing
      ════════════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", justifyContent: "center", alignItems: "center",
        opacity: slide <= 2 ? 1 : 0,
        transform: slide === 3 ? "translateY(-40px)" : "translateY(0)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        pointerEvents: slide <= 2 ? "all" : "none",
      }}>
        <div className="absolute inset-0 bg-black/50" style={{ zIndex: 1 }} />

        {/* Skull group */}
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

          {/* Gear on skull — hidden only while drop clone is active */}
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
              position: "absolute", top: "67%", left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10, textAlign: "center", width: "100%", pointerEvents: "none",
            }}>
              <h1 style={{
                color: "white", fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontFamily: "monospace", fontWeight: "bold",
                textTransform: "uppercase", letterSpacing: "0.15em",
                textShadow: "0 0 30px rgba(255,160,0,0.7)",
                background: "rgba(0,0,0,0.3)", padding: "12px 24px",
                borderRadius: "4px", backdropFilter: "blur(2px)", display: "inline-block",
              }}>Welcome to my Mind</h1>
            </div>
          )}
        </div>

        {/* Scroll dot — slide 1 */}
        <div style={{
          position: "absolute", bottom: "32px", left: "32px", zIndex: 30,
          opacity: slide === 1 ? 1 : 0, transition: "opacity 0.6s ease-in-out",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: "20px", height: "32px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "10px", position: "relative" }}>
            <div style={{ width: "3px", height: "6px", background: "rgba(255,200,80,0.8)", borderRadius: "2px", position: "absolute", top: "5px", left: "50%", transform: "translateX(-50%)", animation: "scrollDot 1.5s ease-in-out infinite" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</p>
        </div>

        {/* Typewriter — slide 2 */}
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

        {/* Scroll dot — slide 2 */}
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

      {/* ════════════════════════════════════════════
          SLIDE 3  —  Vertical page stack
          Each page is 100vh tall, stacked top→bottom.
          We translateY the whole track upward by pageIndex * 100vh.
      ════════════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: slide === 3 ? 1 : 0,
        transform: slide === 3 ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        pointerEvents: slide === 3 ? "all" : "none",
        display: "flex", flexDirection: "column",
      }}>
        {/* Sticky NavBar */}
        <div style={{ position: "relative", zIndex: 1000, flexShrink: 0 }}>
          <NavBar activePage={activePage} onNavigate={(page) => goToPage(page as PageName)} />
        </div>

        {/* Scrolling track — clips to viewport height minus navbar */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
          {/* Inner track: 3 × 100% tall (about/skills/tools only), slides up with translateY */}
          {/* Projects is rendered separately as a fixed overlay to allow popups to escape overflow:hidden */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: `300%`,
            transform: activePage === "projects"
              ? `translateY(-${2 * (100 / 3)}%)`
              : `translateY(-${["about","skills","tools"].indexOf(activePage) * (100 / 3)}%)`,
            transition: "transform 0.9s cubic-bezier(0.77,0,0.18,1)",
            willChange: "transform",
          }}>
            {/* About — 1st slot */}
            <div style={{ height: `${100 / 3}%`, position: "relative" }}>
              <AboutPage />
            </div>

            {/* Skills — 2nd slot */}
            <div style={{ height: `${100 / 3}%`, position: "relative" }}>
              <SkillsPage onExitToTools={(r) => { setRotation(r); goToPage("tools"); }} />
            </div>

            {/* Tools — 3rd slot */}
            <div style={{ height: `${100 / 3}%`, position: "relative" }}>
              <ToolsPage activePage={activePage} />
            </div>
          </div>
        </div>

        {/* Projects — rendered OUTSIDE the overflow:hidden track so popups are never clipped */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 500,
          background: "#0a0a0a",
          visibility: activePage === "projects" ? "visible" : "hidden",
          opacity: activePage === "projects" ? 1 : 0,
          pointerEvents: activePage === "projects" ? "all" : "none",
          transition: "opacity 0.9s cubic-bezier(0.77,0,0.18,1), visibility 0.9s",
        }}>
          <ProjectsPage onExitToTools={() => goToPage("tools")} />
        </div>
      </div>

      {/* ════════════════════════════════════════════
          FALLING GEAR — only rendered while gearDrop
          AND only visible when on about page
      ════════════════════════════════════════════ */}
      {gearDrop && (
        <div style={{
          position: "fixed",
          left: gearStartX,
          top: slide === 2 ? gearStartY : "85vh",
          transition: "top 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
          zIndex: 9999,
          pointerEvents: "none",
          // Hide gear on every page except about
          opacity: activePage === "about" ? 1 : 0,
          // No transition on opacity so it disappears instantly when leaving about
        }}>
          <img src="/gear.png" width={150} height={150} className="spin-gear" alt="Gear" />
        </div>
      )}

    </div>
  );
}