"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      gsap.to(containerRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 1.5,
        ease: "power4.inOut",
        delay: 0.5,
      });
    }
  }, [progress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <div className="relative flex flex-col items-center">
        <div ref={textRef} className="text-xl font-light tracking-[0.5em] text-white uppercase mb-4">
          Loading Consciousness
        </div>
        <div className="w-64 h-[2px] bg-white/10 overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-[10px] font-mono text-white/40 tracking-widest uppercase">
          {progress}% synchronized
        </div>
      </div>
    </div>
  );
}
