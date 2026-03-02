"use client";

import { useEffect, useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import useWindowSize from '@/hooks/useWindowSize';

export default function ContactPage({ onExitToProjects }: { onExitToProjects?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const formRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const lockRef = { locked: false };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -60 && !lockRef.locked) {
        lockRef.locked = true;
        onExitToProjects?.();
        setTimeout(() => { lockRef.locked = false; }, 1000);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onExitToProjects]);

  const handleSend = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setSending(true);
    setError("");

    try {
      const templateParams = {
        name: name,
        email: email,
        subject: subject || "Portfolio Message",
        message: message,
      };

      console.log("Sending with:", {
        service: "service_efihsfl",
        template: "template_5hu2sas",
        params: templateParams,
        publicKey: "vbVcs1zCR-e0s6oKa"
      });

      const result = await emailjs.send(
        "service_efihsfl",
        "template_5hu2sas",
        templateParams,
        "vbVcs1zCR-e0s6oKa"
      );

      console.log("Success! Result:", result);

      if (result.status === 200) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setTimeout(() => setSent(false), 3000);
      }
    } catch (err: any) {
      console.error("Full error object:", err);
      console.error("Error status:", err?.status);
      console.error("Error text:", err?.text);
      console.error("Error message:", err?.message);
      
      setError(err?.text || err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    color: "#3d0c0c",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(61,12,12,0.2)",
    padding: "10px 0",
    fontSize: "0.82rem",
    outline: "none",
    width: "100%",
    fontFamily: "monospace",
    letterSpacing: "0.02em",
    transition: "border-color 0.25s ease",
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#3d0c0c",
      position: "relative",
      overflow: isMobile ? "auto" : "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "20px" : "40px 60px",
      boxSizing: "border-box",
    }}>

      {/* Subtle noise texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
        opacity: 0.5,
      }} />

      {/* Radial ambient */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "600px",
        background: "radial-gradient(ellipse, rgba(80,10,10,0.5) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Main card */}
      <div ref={formRef} style={{
        position: "relative", zIndex: 2,
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
        gap: "0",
        width: "100%",
        maxWidth: "1000px",
        maxHeight: isMobile ? "95vh" : "85vh",
        background: "#f0e6d3",
        borderRadius: "16px",
        border: "1px solid rgba(139,90,60,0.2)",
        overflow: isMobile ? "auto" : "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>

        {/* ── LEFT: Contact info ── */}
        <div style={{
          padding: isMobile ? "24px" : "44px 36px",
          borderRight: isMobile ? "none" : "1px solid rgba(61,12,12,0.12)",
          borderBottom: isMobile ? "1px solid rgba(61,12,12,0.12)" : "none",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "20px" : "32px",
          background: "rgba(0,0,0,0.12)",
        }}>
          {/* Label */}
          <div>
            <p style={{ fontSize: "0.42rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(61,12,12,0.45)", margin: "0 0 6px", fontFamily: "monospace" }}>get in touch</p>
            <h1 style={{ fontSize: "clamp(1.4rem, 2vw, 1.9rem)", fontWeight: 900, color: "#3d0c0c", margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
              Contact Info
            </h1>
          </div>

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

            {/* Mail */}
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                background: "rgba(61,12,12,0.08)", border: "1px solid rgba(61,12,12,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d0c0c" strokeWidth="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,12,12,0.4)", margin: "0 0 5px", fontFamily: "monospace" }}>MAIL US</p>
                <p style={{ fontSize: "0.72rem", color: "#3d0c0c", margin: "0 0 2px", fontFamily: "monospace" }}>mansha.mundhra2005@gmail.com</p>
              </div>
            </div>

            {/* GitHub */}
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                background: "rgba(61,12,12,0.08)", border: "1px solid rgba(61,12,12,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3d0c0c">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,12,12,0.4)", margin: "0 0 5px", fontFamily: "monospace" }}>GITHUB</p>
                <a href="https://github.com/MANSAMUNDHRA" target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "#3d0c0c", margin: 0, fontFamily: "monospace", textDecoration: "none", borderBottom: "1px solid rgba(61,12,12,0.25)" }}>MANSAMUNDHRA ↗</a>
              </div>
            </div>

            {/* LinkedIn */}
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                background: "rgba(61,12,12,0.08)", border: "1px solid rgba(61,12,12,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#3d0c0c">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,12,12,0.4)", margin: "0 0 5px", fontFamily: "monospace" }}>LINKEDIN</p>
                <a href="https://www.linkedin.com/in/mansha-mundhra-155140283/" target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "#3d0c0c", margin: 0, fontFamily: "monospace", textDecoration: "none", borderBottom: "1px solid rgba(61,12,12,0.25)" }}>mansha-mundhra ↗</a>
              </div>
            </div>

            {/* Instagram */}
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "8px", flexShrink: 0,
                background: "rgba(61,12,12,0.08)", border: "1px solid rgba(61,12,12,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d0c0c" strokeWidth="1.8">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="#3d0c0c"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.42rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,12,12,0.4)", margin: "0 0 5px", fontFamily: "monospace" }}>INSTAGRAM</p>
                <a href="https://www.instagram.com/manshamundhra19" target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "#3d0c0c", margin: 0, fontFamily: "monospace", textDecoration: "none", borderBottom: "1px solid rgba(61,12,12,0.25)" }}>@manshamundhra19 ↗</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div style={{
          padding: isMobile ? "24px" : "44px 44px",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontSize: "0.42rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(61,12,12,0.45)", margin: "0 0 6px", fontFamily: "monospace" }}>reach out</p>
            <h2 style={{ fontSize: "clamp(1.3rem, 1.8vw, 1.7rem)", fontWeight: 900, color: "#3d0c0c", margin: 0, textTransform: "uppercase", letterSpacing: "-0.01em" }}>
              Send Message
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px", flex: 1 }}>
            {error && (
              <div style={{
                padding: "8px 12px",
                background: "rgba(255,0,0,0.1)",
                border: "1px solid rgba(255,0,0,0.3)",
                borderRadius: "4px",
                color: "#3d0c0c",
                fontSize: "0.65rem",
                fontFamily: "monospace",
              }}>
                {error}
              </div>
            )}
            
            <input
              type="text" placeholder="Name *" value={name} onChange={e => setName(e.target.value)}
              style={inputStyle}
              disabled={sending}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.6)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.2)"}
            />
            <input
              type="email" placeholder="Email *" value={email} onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              disabled={sending}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.6)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.2)"}
            />
            <input
              type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)}
              style={inputStyle}
              disabled={sending}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.6)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.2)"}
            />
            <textarea
              placeholder="Message *" value={message} onChange={e => setMessage(e.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: "none" } as React.CSSProperties}
              disabled={sending}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.6)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(61,12,12,0.2)"}
            />
            <button
              onClick={handleSend}
              disabled={sending || sent}
              style={{
                background: sending ? "rgba(61,12,12,0.3)" : sent ? "rgba(61,12,12,0.15)" : "#3d0c0c",
                border: "1px solid #3d0c0c",
                borderRadius: "6px",
                padding: "12px 0",
                color: sending ? "#f0e6d3" : sent ? "#3d0c0c" : "#f0e6d3",
                fontSize: "0.52rem",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: sending || sent ? "default" : "pointer",
                width: "100%",
                marginTop: "6px",
                transition: "all 0.25s ease",
                opacity: sending ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if (!sending && !sent) {
                  e.currentTarget.style.background = "rgba(61,12,12,0.85)";
                }
              }}
              onMouseLeave={e => {
                if (!sending && !sent) {
                  e.currentTarget.style.background = "#3d0c0c";
                }
              }}
            >
              {sending ? "SENDING..." : sent ? "✓ SENT" : "SEND MESSAGE"}
            </button>
          </div>

          {/* Sign-off */}
          <div style={{ marginTop: "auto", paddingTop: "20px" }}>
            <p style={{ fontSize: "0.42rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(61,12,12,0.3)", fontFamily: "monospace", margin: 0 }}>— MANSHA MUNDHRA</p>
          </div>
        </div>
      </div>
    </div>
  );
}