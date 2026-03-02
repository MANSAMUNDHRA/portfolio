"use client";
import { useEffect, useState } from "react";
import useWindowSize from '@/hooks/useWindowSize';
interface LoadingProps {
  onLoadingComplete: () => void;
}

export default function Loading({ onLoadingComplete }: LoadingProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation - starts slow then speeds up
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Slow at start (0-30%), medium (30-70%), fast (70-100%)
        if (prev < 30) {
          return prev + 0.60; // Slow
        } else if (prev < 75) {
          return prev + 1; // Medium
        } else if (prev < 99) {
          return prev + 2; // Fast
        }
        return prev;
      });
    }, 30); // Update every 30ms

    const timer = setTimeout(() => {
      setProgress(100); // Complete the bar
      clearInterval(progressInterval);
      
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onLoadingComplete();
        }, 300);
      }, 500); // Wait half a second at 100%
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onLoadingComplete]);

  return (
    <div 
      className="relative h-screen w-screen flex flex-col justify-center items-center overflow-hidden bg-black"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease-in-out"
      }}
    >
      {/* Large rotating gear in center */}
      <div className="animate-spin-slow mb-12">
        <img
          src="/gear.png"
          alt="Loading Gear"
          width={150}
          height={150}
          className="opacity-80"
        />
      </div>
      
      {/* Progress Bar Container */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
          style={{ 
            width: `${progress}%`,
            transition: "width 0.1s ease-out",
            boxShadow: "0 0 10px rgba(255,200,0,0.5)"
          }}
        />
      </div>
      
      {/* Loading text with percentage */}
      <div className="flex items-center gap-2">
        <span className="text-white/70 text-sm font-mono">Loading</span>
        <span className="text-orange-400/90 text-sm font-mono">{Math.round(progress)}%</span>
      </div>
      
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />
    </div>
  );
}