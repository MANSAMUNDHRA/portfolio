"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import SkillsPage from "./components/SkillsPage";
import ToolsPage from "./components/ToolPage";
import ProjectsPage from "./components/ProjectsPage";
import ContactPage from "./components/ContactPage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [slide, setSlide] = useState(1);
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [phase, setPhase] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activePage, setActivePage] = useState("skills");
  const [toolsExiting, setToolsExiting] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(true);
  const [rotation, setRotation] = useState(0); // ADD THIS LINE
  
  useEffect(() => {
    if (!isLoading) {
      const readyTimer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(readyTimer);
    }
  }, [isLoading]);

  const handleLoadingComplete = () => setIsLoading(false);

  const goToSlide = (next: number) => {
    if (scrollLocked) return;
    setScrollLocked(true);
    setSlide(next);
    if (next !== 1) {
      setShowWelcomeText(false);
    } else {
      setShowWelcomeText(true);
    }
    const lockTime = next === 2 ? 3000 : 1000;
    setTimeout(() => setScrollLocked(false), lockTime);
  };

  useEffect(() => {
    if (!isReady) return;

  const handleScroll = (e: WheelEvent) => {
  if (scrollLocked) return;

  // LANDING SLIDES
  if (slide === 1 && e.deltaY > 0) {
    goToSlide(2);
    return;
  }

  if (slide === 2) {
    if (e.deltaY > 0) goToSlide(3);
    if (e.deltaY < 0) goToSlide(1);
    return;
  }

  // INSIDE SLIDE 3 (Skills / Tools / Projects)
  if (slide === 3) {
    setScrollLocked(true);

    if (e.deltaY > 60) {
      // Scroll down
      if (activePage === "skills") setActivePage("tools");
      else if (activePage === "tools") setActivePage("projects");
    }

    if (e.deltaY < -60) {
      // Scroll up
      if (activePage === "projects") setActivePage("tools");
      else if (activePage === "tools") setActivePage("skills");
      else if (activePage === "skills") goToSlide(2);
    }

    setTimeout(() => setScrollLocked(false), 900);
  }
};
    

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) < 50) return;
      if (slide === 3) return; // block — skills/tools handle their own scroll
      
      if (delta > 0) {
        // Swipe up (scrolling down)
        if (slide === 1) goToSlide(2);
        else if (slide === 2) goToSlide(3);
        // If on slide 3, swiping up does nothing
      } else {
        // Swipe down (scrolling up)
        if (slide === 3) goToSlide(2);
        else if (slide === 2) goToSlide(1);
        // If on slide 1, swiping down does nothing
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
  }, [slide, isReady, scrollLocked]);

  useEffect(() => {
    if (slide !== 2 || !isReady) return;
    const typingSpeed = 100;
    const backspaceSpeed = 50;
    const pauseBetween = 500;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 0) {
      const target = "hey,";
      if (charIndex < target.length) {
        timeout = setTimeout(() => { setLine1(target.substring(0, charIndex + 1)); setCharIndex(charIndex + 1); }, typingSpeed);
      } else {
        timeout = setTimeout(() => { setPhase(1); setCharIndex(0); }, pauseBetween);
      }
    } else if (phase === 1) {
      const target = "I'm Clueless";
      if (charIndex < target.length) {
        timeout = setTimeout(() => { setLine2(target.substring(0, charIndex + 1)); setCharIndex(charIndex + 1); }, typingSpeed);
      } else {
        timeout = setTimeout(() => { setPhase(2); setCharIndex(target.length); }, pauseBetween * 2);
      }
    } else if (phase === 2) {
      const target = "I'm Clueless";
      if (charIndex > 0) {
        timeout = setTimeout(() => { setLine2(target.substring(0, charIndex - 1)); setCharIndex(charIndex - 1); }, backspaceSpeed);
      } else {
        timeout = setTimeout(() => { setPhase(3); setCharIndex(0); }, pauseBetween);
      }
    } else if (phase === 3) {
      const target = "I'm Mansha";
      if (charIndex < target.length) {
        timeout = setTimeout(() => { setLine2(target.substring(0, charIndex + 1)); setCharIndex(charIndex + 1); }, typingSpeed);
      }
    }
    return () => clearTimeout(timeout);
  }, [phase, charIndex, slide, isReady]);

  if (isLoading) {
    return <Loading onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.3s ease-in-out" }}
    >

      {/* ── SLIDES 1 & 2: Landing ── */}
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
          <div style={{ position: "absolute", top: "35%", left: "55%", marginLeft: "-75px", marginTop: "-75px", zIndex: 3 }}>
            <img src="/gear.png" alt="Gear" width={150} height={150} className="spin-gear" />
          </div>
          
          {/* Welcome text overlay on skull - only visible on slide 1 */}
          {showWelcomeText && slide === 1 && (
            <div style={{
              position: "absolute",
              top: "67%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              textAlign: "center",
              width: "100%",
              pointerEvents: "none",
            }}>
              <h1 style={{
                color: "white",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                fontFamily: "monospace",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                textShadow: "0 0 30px rgba(255,160,0,0.7)",
                background: "rgba(0,0,0,0.3)",
                padding: "12px 24px",
                borderRadius: "4px",
                backdropFilter: "blur(2px)",
                display: "inline-block",
              }}>
                Welcome to my Mind
              </h1>
            </div>
          )}
        </div>

        {/* Scroll indicator — slide 1 */}
        <div style={{
          position: "absolute", bottom: "32px", left: "32px", zIndex: 30,
          opacity: slide === 1 ? 1 : 0, transition: "opacity 0.6s ease-in-out",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: "20px", height: "32px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "10px", position: "relative" }}>
            <div style={{
              width: "3px", height: "6px", background: "rgba(255,200,80,0.8)",
              borderRadius: "2px", position: "absolute", top: "5px", left: "50%",
              transform: "translateX(-50%)", animation: "scrollDot 1.5s ease-in-out infinite",
            }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</p>
        </div>

        {/* Typewriter text — slide 2 */}
        <div style={{
          position: "absolute", left: "6%", top: "50%",
          transform: "translateY(-50%)", zIndex: 30,
          opacity: slide === 2 ? 1 : 0,
          transition: "opacity 1.2s ease-in-out 0.8s",
          display: "flex", flexDirection: "column",
        }}>
          <h1 className="text-white font-bold uppercase" style={{
            fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "0.05em",
            lineHeight: 1.1, fontFamily: "monospace",
            textShadow: "0 0 40px rgba(255,160,0,0.5)",
          }}>
            <span style={{ display: "block" }}>
              {line1}{phase === 0 && <span className="animate-pulse">|</span>}
            </span>
            <span style={{ display: "block", minHeight: "1.1em" }}>
              {line2}{phase !== 0 && <span className="animate-pulse">|</span>}
            </span>
          </h1>
          <div style={{ width: "60px", height: "2px", background: "linear-gradient(to right, #FFA500, transparent)", marginTop: "16px" }} />
        </div>

        {/* Scroll hint — slide 2 bottom */}
        <div style={{
          position: "absolute", bottom: "32px", left: "32px", zIndex: 30,
          opacity: slide === 2 ? 1 : 0,
          transition: "opacity 0.6s ease-in-out 2s",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          <div style={{ width: "20px", height: "32px", border: "2px solid rgba(255,255,255,0.4)", borderRadius: "10px", position: "relative" }}>
            <div style={{
              width: "3px", height: "6px", background: "rgba(255,200,80,0.8)",
              borderRadius: "2px", position: "absolute", top: "5px", left: "50%",
              transform: "translateX(-50%)", animation: "scrollDot 1.5s ease-in-out infinite",
            }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>scroll</p>
        </div>

      </div>
      
      {/* ── SLIDE 3: Skills / Index page ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "#0a0a0a",
        opacity: slide === 3 ? 1 : 0,
        transform: slide === 3 ? "translateY(0)" : "translateY(60px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
        pointerEvents: slide === 3 ? "all" : "none",
        display: "flex", flexDirection: "column",
      }}>

        {/* NavBar always on top */}
        <div style={{ position: "relative", zIndex: 1000, flexShrink: 0 }}>
          <NavBar activePage={activePage} onNavigate={(page) => {
            setActivePage(page);
          }} />
        </div>

        {/* Content below navbar */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            overflow: "hidden",
            zIndex: 1,
          }}>
            <div
  style={{
    position: "absolute",
    inset: 0,
    transform:
      activePage === "skills"
        ? "translateX(0%)"
        : "translateX(-100%)",
    transition: "transform 0.9s cubic-bezier(0.77,0,0.18,1)",
    zIndex: 3,
  }}
>
  <SkillsPage
    onExitToTools={(currentRotation) => {
      setRotation(currentRotation);
      setActivePage("tools");
    }}
  />
</div>
  <div
  style={{
    position: "absolute",
    inset: 0,
    transform:
      activePage === "tools"
        ? "translateX(0%)"
        : activePage === "skills"
        ? "translateX(100%)"
        : "translateX(-100%)",
    transition: "transform 0.9s cubic-bezier(0.77,0,0.18,1)",
    zIndex: 2,
  }}
>
  <ToolsPage activePage={activePage} />
</div>

            <div
  style={{
    position: "absolute",
    inset: 0,
    transform:
      activePage === "projects"
        ? "translateX(0%)"
        : "translateX(100%)",
    transition: "transform 0.9s cubic-bezier(0.77,0,0.18,1)",
    zIndex: 1,
  }}
>
  <ProjectsPage onExitToTools={() => setActivePage("tools")} />
</div>
          </div>
        </div>
      </div>
    </div>
  );
}