"use client";

import { useState } from "react";

const pages = [
  {
    id: "skills",
    label: "Skills",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
  },
  {
    id: "tools",
    label: "Tools",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: "experience",
    label: "Experience",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    id: "thoughts",
    label: "Thoughts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    id: "connect",
    label: "Connect",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
];

interface NavBarProps {
  activePage: string;
  onNavigate: (id: string) => void;
}

export default function NavBar({ activePage, onNavigate }: NavBarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div style={{
      position: "fixed",
      top: "18px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
    }}>

      {/* Pill container */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        background: "rgba(12,12,12,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "999px",
        padding: "6px 8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
      }}>

       


        {/* Nav items */}
        {pages.map((page) => {
          const isActive = activePage === page.id;
          const isHovered = hoveredId === page.id;

          return (
            <button
              key={page.id}
              onClick={() => onNavigate(page.id)}
              onMouseEnter={() => setHoveredId(page.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: isActive
                  ? "rgba(255,160,0,0.12)"
                  : isHovered
                  ? "rgba(255,255,255,0.06)"
                  : "none",
                border: isActive
                  ? "1px solid rgba(255,160,0,0.25)"
                  : "1px solid transparent",
                borderRadius: "999px",
                cursor: "pointer",
                padding: "6px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                minWidth: "52px",
                transition: "background 0.2s ease, border 0.2s ease",
                color: isActive
                  ? "#FFA500"
                  : isHovered
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(255,255,255,0.35)",
                position: "relative",
              }}
            >
              {/* Icon */}
              <span style={{
                display: "flex",
                filter: isActive
                  ? "drop-shadow(0 0 5px rgba(255,160,0,0.7))"
                  : "none",
                transition: "filter 0.2s ease",
              }}>
                {page.icon}
              </span>

              {/* Label — always visible, small */}
              <span style={{
                fontSize: "0.42rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontFamily: "monospace",
                whiteSpace: "nowrap",
                opacity: isActive || isHovered ? 1 : 0,
                maxHeight: isActive || isHovered ? "12px" : "0px",
                overflow: "hidden",
                transition: "opacity 0.2s ease, max-height 0.2s ease",
              }}>
                {page.label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
}