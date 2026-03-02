"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useWindowSize from '@/hooks/useWindowSize';
export default function AboutPage() {
  const [showContent, setShowContent] = useState(false);
  const { width } = useWindowSize();
const isMobile = width <= 768;

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative",
      background: "#561C24", // Tools page background
      overflow: "hidden",
      // display: "flex",
      display: "flex",
flexDirection: isMobile ? "column" : "row",
    }}>

      {/* Mouse glow effect from Tools page */}
      <div style={{
        position: "absolute",
        width: "300px", height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 998,
        filter: "blur(10px)",
      }} />
        <div style={{
  // width: "45%",
  width: isMobile ? "100%" : "45%",
height: isMobile ? "40%" : "100%",
  // height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}}>

  <div style={{
    position: "relative",
    // width: "500px",
    // height: "600px", // adjust to your image ratio
    width: isMobile ? "250px" : "500px",
height: isMobile ? "300px" : "600px",
    // border: "10px solid #000",
    overflow: "hidden",
  }}>

   <Image
  src="/me.png"
  alt="Mansha Mundhra"
  fill
  style={{
    objectFit: "contain",
    filter: `
      drop-shadow(0 0 0 #000)
      drop-shadow(4px 0 0 #000)
      drop-shadow(-4px 0 0 #000)
      drop-shadow(0 4px 0 #000)
      drop-shadow(0 -4px 0 #000)
    `,
  }}
  priority
/>

  </div>

</div>
    

      

      {/* ── RIGHT — text in Tools-style box ── */}
      <div style={{
        // width: "55%",
        width: isMobile ? "100%" : "55%",
height: isMobile ? "60%" : "100%",
paddingLeft: isMobile ? "20px" : "40px",
paddingRight: isMobile ? "20px" : "10%",
paddingBottom: isMobile ? "20px" : "0",
        // height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // paddingLeft: "40px",
        // paddingRight: "10%",
        position: "relative",
        zIndex: 10,
      }}>
        

        {/* Tools-style box for the quote */}
        <div style={{
          marginBottom: "20px",
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "right",
            alignContent: "center",
            padding: "1px 1px 1px 1px",
            // border: "1px solid rgba(176,5,5,0.5)",
            borderRadius: "20px",
            // background: "rgba(176,5,5,0.08)",
            marginBottom: "1px",
          }}>
            <span style={{
              fontFamily: "Georgia, serif",
              // fontSize: "2rem",
              fontSize: isMobile ? "1.2rem" : "2rem",
              color: "rgb(248, 246, 246)",
              fontWeight: 600,
            }}>“      Everybody lies .”</span>
          </div>
          <p style={{
            display: "flex",
            justifyContent: "right",
            alignContent: "right",
            fontFamily: "monospace",
            fontSize: "1rem",
            color: "rgba(241, 223, 230, 0.7)",
            letterSpacing: "0.05em",
            // marginLeft: "px",
          }}>-Dr. Gregory House</p>
        </div>

        {/* Tools-style container for all text */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "19px",
          maxWidth: "600px",
          background: "#E8D8C4",
          borderRadius: "16px",
          padding: "24px",
          border: "1px solid #E8D8C4",
          backdropFilter: "blur(5px)",
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s",
        }}>

          {/* Paragraph 1 - Systems lie */}
          <div style={{
            // borderLeft: "2px solid rgba(8, 8, 8, 0.5)",
            paddingLeft: "16px",
          }}>
            <p style={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              color: "rgba(15, 14, 14, 0.92)",
              lineHeight: 1.8,
              letterSpacing: "0.03em",
              margin: 0,
            }}>
              Systems lie. Data lies. People lie. Sometimes even our first
              assumptions lie — the interesting part isn't the lie,
              it's tracing where the truth is hiding.
            </p>
          </div>

          {/* Paragraph 2 - CS journey */}
          <div style={{
            // borderLeft: "2px solid rgba(247,11,106,0.4)",
            paddingLeft: "16px",
          }}>
            <p style={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              color: "rgba(11, 11, 11, 0.91)",
              lineHeight: 1.8,
              letterSpacing: "0.03em",
              margin: 0,
            }}>
              I got into Computer Science because I like concepts that make my brain stretch.
              If it doesn't challenge me, it doesn't hold me. I've explored different domains
              but lately, I've been drawn to something oddly specific: loss functions.
            </p>
          </div>

          {/* Paragraph 3 - Loss functions poetry */}
          <div style={{
            // borderLeft: "2px solid rgba(18, 18, 18, 0.94)",
            paddingLeft: "16px",
          }}>
            <p style={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              color: "rgb(23, 22, 22)",
              lineHeight: 1.8,
              letterSpacing: "0.05em",
              margin: 0,
            }}>
              There's something poetic about minimizing error over epochs —
              measuring where you're wrong, adjusting, trying again, slowly converging.
              Feels familiar.
            </p>
          </div>

          {/* Paragraph 4 - Final line */}
          <div style={{
            // borderLeft: "2px solid rgba(32, 31, 32, 0.4)",
            paddingLeft: "16px",
            marginTop: "8px",
          }}>
            <p style={{
              fontFamily: "Georgia, serif",
              fontSize: "0.8rem",
              color: "black",
              lineHeight: 1.6,
              margin: 0,
              fontStyle: "italic",
            }}>
              I'm not trying to be perfect.
              <br />
              I'm just trying to reduce the loss.
            </p>
          </div>

          {/* Sign-off with Tools-style tag */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1px",
          }}>
            <span style={{
              fontFamily: "monospace",
              fontSize: "0.5rem",
              color: "rgba(245, 232, 232, 0.96)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "9px 12px",
              borderRadius: "20px",
              background: "rgba(105, 11, 11, 0.95)",
            }}>
              Mansha Mundhra
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blobDrift {
          from { transform: translate(0px, 0px) scale(1); }
          to   { transform: translate(30px, 20px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}