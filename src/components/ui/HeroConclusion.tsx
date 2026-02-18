"use client"

import React from 'react'
import Link from 'next/link'

export default function HeroConclusion() {
  return (
    <section className="relative h-screen z-[70] flex flex-col items-center justify-center text-center px-6 pb-32 overflow-hidden bg-transparent text-white">
      
      {/* Background Glow (Aura) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '50vh',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      ></div>

      <div className="z-10 max-w-4xl group">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-8 font-medium">
          The journey concludes here
        </p>
        
        <h2 className="text-5xl md:text-8xl tracking-tight leading-[0.9] font-extralight font-sans">
          Join the <span className="font-serif italic font-bold">Singularity.</span>
        </h2>

        <div className="h-24" />

        {/* Premium CTA Button */}
        <div className="relative inline-block">
          <style dangerouslySetInnerHTML={{ __html: `
            .cta-button {
              position: relative;
              padding: 1.5rem 3.5rem;
              background: #ffffff;
              color: #000;
              border-radius: 100px;
              font-weight: 600;
              font-size: 0.75rem;
              letter-spacing: 0.15em;
              text-transform: uppercase;
              overflow: hidden;
              transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
              border: 1px solid rgba(255, 255, 255, 1);
              display: inline-flex;
              align-items: center;
              gap: 12px;
              text-decoration: none;
            }

            .cta-button::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -60%;
              width: 40%;
              height: 200%;
              background: linear-gradient(
                90deg, 
                transparent, 
                rgba(255, 255, 255, 0.8), 
                transparent
              );
              transform: rotate(35deg);
              transition: all 0.6s;
            }

            .cta-button:hover::after {
              left: 120%;
            }

            .cta-button:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 40px rgba(255, 255, 255, 0.15);
              letter-spacing: 0.25em;
            }
          `}} />
          
          <Link href="/register" className="cta-button group">
            Register for Techkriti
            <span className="inline-block ml-3 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* Premium Footer Section - Absolute Bottom with offset */}
      <div className="absolute bottom-16 w-full max-w-7xl z-20 px-4">
        <div 
          className="group/footer flex flex-col md:flex-row justify-between items-center gap-16 rounded-[100px] border border-white/10 bg-white/5 backdrop-blur-[40px] px-24 py-10 transition-all duration-400 hover:border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Left: Branding */}
          <div className="flex items-center gap-5">
            <div className="w-[42px] h-[42px] border border-white/10 rounded-[10px] flex items-center justify-center text-[12px] font-bold tracking-normal"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
                 }}>
              TK
            </div>
            <div className="text-left">
              <p className="text-xs font-bold tracking-[0.2em] uppercase leading-none mb-1">TECHKRITI 26</p>
              <p className="font-sans text-[9px] font-medium tracking-[0.2em] text-gray-600 uppercase">IIT Kanpur Festival</p>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="flex gap-12">
            {['TECHNICAL', 'SOCIAL', 'TEAM'].map((label) => (
              <Link 
                key={label}
                href={`/${label.toLowerCase()}`} 
                className="font-mono text-[10px] tracking-[0.2em] text-gray-600 hover:text-white transition-all duration-300 uppercase"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Socials */}
          <div className="flex gap-6 items-center">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-300">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
        
        <p className="copyright mt-8 text-center text-[9px] font-mono tracking-[0.4em] text-[#333] uppercase">
          © 2026 All Rights Reserved. IIT Kanpur.
        </p>
      </div>

    </section>
  )
}
