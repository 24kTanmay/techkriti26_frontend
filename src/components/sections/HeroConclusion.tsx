"use client"

import React from 'react'
import Link from 'next/link'
import Timer from './Timer'

export default function HeroConclusion() {
  return (
    <section className="relative min-h-screen z-[70] flex flex-col items-center justify-between text-center px-4 py-12 md:px-6 md:py-20 overflow-hidden bg-transparent text-white">
      
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

      {/* Top Spacer to help center content vertically when footer is present */}
      <div className="hidden md:block h-20" />

      <div className="z-10 max-w-4xl group flex flex-col items-center w-full px-2">
        <p className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-6 md:mb-8 font-medium" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          The journey concludes here
        </p>
        
        <h2 className="tracking-tight leading-[1.1] font-normal" style={{ 
          fontFamily: "var(--font-playfair), serif",
          fontSize: 'clamp(2.2rem, 12vw, 6rem)'
        }}>
          Join the <br /><i style={{ fontStyle: 'italic', fontWeight: 300, opacity: 0.6 }}>Singularity.</i>
        </h2>

        <div style={{ marginTop: '25px', marginBottom: '25px' }} className="w-full scale-90 sm:scale-100">
          <Timer />
        </div>

        {/* Register Button - Shine & Slide Animation */}
        <div className="relative inline-block mt-8 md:mt-24">
          <style dangerouslySetInnerHTML={{ __html: `
            .register-btn-main {
                position: relative;
                background: #ffffff;
                color: #000000;
                padding: 1.1rem 2.2rem;
                @media (min-width: 480px) {
                  padding: 1.2rem 3.5rem;
                }
                @media (min-width: 768px) {
                  padding: 1.5rem 4.5rem;
                }
                border-radius: 100px;
                font-family: var(--font-space-grotesk), sans-serif;
                font-size: 0.75rem;
                @media (min-width: 480px) {
                  font-size: 0.9rem;
                }
                @media (min-width: 768px) {
                  font-size: 1rem;
                }
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2px;
                @media (min-width: 768px) {
                  letter-spacing: 2.5px;
                }
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.7rem;
                @media (min-width: 768px) {
                  gap: 1.5rem;
                }
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            }

            /* shine effect */
            .register-btn-main::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255,255,255,0.8),
                    transparent
                );
                transform: translateX(-100%);
                transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }

            /* hover */
            .register-btn-main:hover {
                transform: scale(1.05) translateY(-5px);
                box-shadow: 0 20px 60px rgba(255,255,255,0.15);
                background: #ffffff;
            }

            .register-btn-main:hover::before {
                transform: translateX(100%);
            }

            .register-btn-main svg {
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .register-btn-main:hover svg {
                transform: translateX(8px);
            }
          `}} />
          
          <Link 
            href="/register" 
            className="register-btn-main group"
          >
            Register For Techkriti
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="md:w-6 md:h-6">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Premium Footer Section - Pushed to bottom */}
      <div className="w-full max-w-7xl z-20 px-4 md:px-12 mt-24 md:mt-0 relative md:absolute md:bottom-12">
        <div 
          className="group/footer flex flex-col items-center rounded-[48px] md:rounded-[100px] border border-white/10 backdrop-blur-[50px] px-8 pt-20 pb-24 md:px-16 md:py-12 md:flex-row transition-all duration-500 hover:border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.015)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
            height: 'auto',
          }}
        >
          {/* Left: Branding */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-5 md:gap-6 mb-16 md:mb-0">
            <div className="w-[60px] h-[60px] md:w-[60px] md:h-[60px] border border-white/10 rounded-[14px] md:rounded-[14px] flex items-center justify-center text-[21px] md:text-[21px] font-bold tracking-normal transition-all duration-500 group-hover/footer:scale-110 group-hover/footer:border-white/30"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                 }}>
              TK
            </div>
            <div className="text-center md:text-left">
              <p className="text-[16px] md:text-[18px] font-bold tracking-[0.3em] uppercase leading-none mb-3 text-white/90" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>TECHKRITI 26</p>
              <p className="text-[12px] md:text-[15px] font-medium tracking-[0.2em] text-gray-500 uppercase" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>IIT Kanpur Festival</p>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="flex-[2] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 mb-16 md:mb-0">
            {['FAQ', 'TEAM'].map((label) => (
              <Link 
                key={label}
                href={`/${label.toLowerCase()}`} 
                className="text-[15px] md:text-[16.5px] tracking-[0.35em] text-gray-400 hover:text-white transition-all duration-300 uppercase relative group/link"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {label}
                <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-white transition-all duration-300 -translate-x-1/2 group-hover/link:w-[60%]" />
              </Link>
            ))}
          </div>

          {/* Right: Socials */}
          <div className="flex-1 flex gap-12 md:gap-10 items-center justify-center">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
        
        <p className="copyright mt-16 md:mt-[200px] text-center text-[8.5px] tracking-[0.4em] text-gray-400 uppercase pb-16 md:pb-12" style={{ fontFamily: "var(--font-space-grotesk), sans-serif", paddingBottom: 'calc(env(safe-area-inset-bottom) + 3rem)' }}>
          © 2026 All Rights Reserved. IIT Kanpur.
        </p>
      </div>

    </section>
  )
}
