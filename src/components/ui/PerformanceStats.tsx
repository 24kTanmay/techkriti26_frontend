"use client";
import { useEffect } from "react";

export default function PerformanceStats() {
  useEffect(() => {
    let stats: any;
    let rafId: number;

    if (process.env.NODE_ENV === "development") {
      import("stats.js").then((Stats) => {
        stats = new (Stats.default || Stats)();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        
        const animate = () => {
          stats.begin();
          stats.end();
          rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
      });
    }

    return () => {
      if (stats && document.body.contains(stats.dom)) {
        document.body.removeChild(stats.dom);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
