"use client";
import { useEffect, useRef } from "react";
import Stats from "stats.js";

export default function PerformanceStats() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const stats = new Stats();
      stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(stats.dom);
      
      const animate = () => {
        stats.begin();
        stats.end();
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
      
      return () => {
        document.body.removeChild(stats.dom);
      };
    }
  }, []);

  return null;
}
