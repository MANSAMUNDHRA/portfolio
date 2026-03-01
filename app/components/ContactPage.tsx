"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const CONTACTS = [
  {
    icon: "✉",
    label: "Email",
    value: "mansha.mundhra2005@gmail.com",
    href: "mailto:mansha.mundhra2005@gmail.com",
    color: "#a78bfa",
  },
  {
    icon: "in",
    label: "LinkedIn",
    value: "mansha-mundhra",
    href: "https://www.linkedin.com/in/mansha-mundhra-155140283/",
    color: "#60a5fa",
  },
  {
    icon: "⌥",
    label: "GitHub",
    value: "MANSAMUNDHRA",
    href: "https://github.com/MANSAMUNDHRA",
    color: "#34d399",
  },
  {
    icon: "◎",
    label: "Instagram",
    value: "@manshamundhra19",
    href: "https://www.instagram.com/manshamundhra19",
    color: "#f472b6",
  },
  {
    icon: "☎",
    label: "Phone",
    value: "available on request",
    href: null,
    color: "#fbbf24",
  },
];

function ContactRow({ c, i, visible }: { c: typeof CONTACTS[0]; i: number; visible: boolean }) {
  const [hov, setHov] = useState(false);

  const sharedStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "11px 16px",
    border: `1px solid ${hov ? c.color + "55" : c.color + "20"}`,
    borderRadius: "10px",
    background: hov ? `${c.color}12` : `${c.color}06`,
    transition: "all 0.2s ease",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-16px)",
    transitionDelay: `${i * 70}ms`,
    textDecoration: "none",
    cursor: c.href ? "pointer" : "default",
  };

  const inner = (
    <>
      <span style={{
        fontFamily: "monospace", fontSize: "0.85rem",
        color: c.color, width: "22px", textAlign: "center", fontWeight: "bold",
      }}>{c.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "monospace", fontSize: "0.4rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)", marginBottom: "2px",
        }}>{c.label}</div>
        <div style={{
          fontFamily: "monospace", fontSize: "0.58rem",
          color: "rgba(255,255,255,0.75)", letterSpacing: "0.03em",
        }}>{c.value}</div>
      </div>
      {c.href && (
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>↗</span>
      )}
    </>
  );

  return c.href ? (
    
      href={c.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={sharedStyle}
    >{inner}</a>
  ) : (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={sharedStyle}
    >{inner}</div>
  );
}

function ResumeRow({ visible, delay }: { visible: boolean; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    
      href="https://drive.google.com/file/d/1_R308lI7gd6BpiOoGe_HqF-VeKpSDKfX/view?usp=drivesdk"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "11px 16px",
        border: `1px solid ${hov ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "10px",
        background: hov ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        textDecoration: "none", cursor: "pointer",
        transition: "all 0.2s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span style={{
        fontFamily: "monospace", fontSize: "0.85rem",
        color: "white", width: "22px", textAlign: "center",
      }}>⬇</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "monospace", fontSize: "0.4rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.3)", marginBottom: "2px",
        }}>Resume</div>
        <div style={{
          fontFamily: "monospace", fontSize: "0.58rem",
          color: "rgba(255,255,255,0.75)",
        }}>View / Download CV</div>
      </div>
      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>↗</span>
    </a>
  );
}

export default function ContactPage({ onExitToProjects }: { onExitToProjects?: () => void }) {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hey 👋 I'm Mansha's assistant. Leave a message and I'll make sure she sees it." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0 && !lockRef.current) {
        lockRef.current = true;
        if (onExitToProjects) onExitToProjects();
        setTimeout(() => { lockRef.current = false; }, 800);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [onExitToProjects]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setSending(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, from: "Portfolio visitor" }),
      });
    } catch {}

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "bot",
        text: "Thanks! Mansha will get back to you at mansha.mundhra2005@gmail.com 🙌",
      }]);
      setSending(false);
    }, 800);
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#060608",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "40px 80px",
    }}>

      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
        pointerEvents: "none",
      }} />

      {/* BG image bottom right */}
      <div style={{
        position: "absolute",
        bottom: "-20px", right: "-20px",
        width: "400px", height: "400px",
        opacity: 0.1,
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <Image
          src="/contact.jpeg"
          alt=""
          fill
          style={{ objectFit: "contain", objectPosition: "bottom right" }}
        />
      </div>

      {/* Ambient glow */}
      <div style={{
        position: "absolute",
        bottom: "5%", right: "5%",
        width: "500px", height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)",
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
        gap: "28px", maxWidth: "960px", width: "100%",
      }}>

        {/* Heading */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <p style={{
            fontSize: "0.45rem", letterSpacing: "0.5em",
            textTransform: "uppercase", fontFamily: "monospace",
            color: "rgba(255,255,255,0.22)", marginBottom: "5px",
          }}>get in touch</p>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
            fontFamily: "Georgia, serif", fontWeight: "900",
            textTransform: "uppercase", letterSpacing: "0.1em",
            color: "white", margin: 0,
          }}>Contact</h2>
        </div>

        {/* Two columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          alignItems: "start",
        }}>

          {/* LEFT — links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CONTACTS.map((c, i) => (
              <ContactRow key={c.label} c={c} i={i} visible={visible} />
            ))}
            <ResumeRow visible={visible} delay={CONTACTS.length * 70} />
          </div>

          {/* RIGHT — chatbot */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(16px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
            display: "flex", flexDirection: "column",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.02)",
            overflow: "hidden",
            height: "340px",
          }}>

            {/* Chat header */}
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <div style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#34d399", boxShadow: "0 0 6px #34d399",
              }} />
              <span style={{
                fontFamily: "monospace", fontSize: "0.45rem",
                letterSpacing: "0.2em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
              }}>leave a message</span>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto",
              padding: "14px",
              display: "flex", flexDirection: "column", gap: "8px",
              scrollbarWidth: "none",
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "82%",
                    padding: "7px 12px",
                    borderRadius: msg.role === "user"
                      ? "12px 12px 2px 12px"
                      : "12px 12px 12px 2px",
                    background: msg.role === "user"
                      ? "rgba(167,139,250,0.22)"
                      : "rgba(255,255,255,0.05)",
                    border: msg.role === "user"
                      ? "1px solid rgba(167,139,250,0.35)"
                      : "1px solid rgba(255,255,255,0.07)",
                    fontFamily: "monospace", fontSize: "0.56rem",
                    color: "rgba(255,255,255,0.8)",
                    lineHeight: 1.6, letterSpacing: "0.02em",
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "7px 12px",
                    borderRadius: "12px 12px 12px 2px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    fontFamily: "monospace", fontSize: "0.56rem",
                    color: "rgba(255,255,255,0.3)",
                  }}>...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "10px 14px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", gap: "8px",
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "7px 11px",
                  fontFamily: "monospace", fontSize: "0.56rem",
                  color: "white", outline: "none",
                  letterSpacing: "0.03em",
                }}
                onFocus={e => {
                  (e.target as HTMLElement).style.borderColor = "rgba(167,139,250,0.5)";
                }}
                onBlur={e => {
                  (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  background: input.trim()
                    ? "rgba(167,139,250,0.85)"
                    : "rgba(255,255,255,0.05)",
                  border: "none",
                  cursor: input.trim() ? "pointer" : "default",
                  fontFamily: "monospace", fontSize: "0.5rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: input.trim() ? "white" : "rgba(255,255,255,0.2)",
                  transition: "all 0.2s ease",
                }}
              >Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}