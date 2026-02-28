"use client";
import { useEffect } from "react";

export default function PerformanceStats() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("stats.js").then((Stats) => {
        const stats = new (Stats.default || Stats)();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        
        let rafId: number;
        const animate = () => {
          stats.begin();
          stats.end();
          rafId = requestAnimationFrame(animate);
        };
        
        rafId = requestAnimationFrame(animate);
        
        return () => {
          if (document.body.contains(stats.dom)) {
            document.body.removeChild(stats.dom);
          }
          cancelAnimationFrame(rafId);
        };
      });
    }
  }, []);

  return null;
}
