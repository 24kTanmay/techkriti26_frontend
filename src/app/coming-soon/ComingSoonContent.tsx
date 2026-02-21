"use client";

import React, { useEffect, useRef } from 'react';
import styles from './ComingSoon.module.css';
import Navbar from '@/components/common/Navbar';

const ComingSoonContent = () => {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!auraRef.current) return;
      
      const x = e.clientX;
      const y = e.clientY;
      
      const relX = x - window.innerWidth / 2;
      const relY = y - window.innerHeight / 2;
      
      auraRef.current.style.transform = `translate(${relX}px, ${relY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div ref={auraRef} className={styles.aura}></div>
      <div className={styles.noise}></div>

      <main className={styles.mainContent}>
        <span className={styles.tag}>Phase_02 // Synthesis</span>
        <h1 className={styles.title}>
          Coming into <i>Being.</i>
        </h1>
        
        <div className={styles.progressLine}>
          <div className={styles.progressFill}></div>
        </div>

        <span className={styles.status}>Aligning with the Singularity</span>
      </main>
    </div>
  );
};

export default ComingSoonContent;
