"use client"

import React from 'react'
import Link from 'next/link'
import Timer from './Timer'
import { ArrowRightIcon, LinkedInIcon, InstagramIcon, YouTubeIcon, WhatsAppIcon } from '../common/Icons'

export default function HeroConclusion() {
  return (
    <section className="relative min-h-screen z-[70] flex flex-col items-center justify-center text-center px-6 py-20 overflow-visible bg-transparent text-white">
      
      {/* Background Glow (Aura) */}
      <div 
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80vw',
          height: '50vh',
          background: 'radial-gradient(circle, var(--white-subtle) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      ></div>

      <div className="z-10 max-w-4xl group flex-1 flex flex-col justify-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-8 font-medium" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          The journey concludes here
        </p>
        
        <h2 className="tracking-tight leading-[1.1] font-normal" style={{ 
          fontFamily: "var(--font-playfair), serif",
          fontSize: 'clamp(3rem, 8vw, 6rem)'
        }}>
          Join the <br /><i style={{ fontStyle: 'italic', fontWeight: 300, opacity: 0.6 }}>Singularity.</i>
        </h2>

        <div style={{ marginTop: '30px', marginBottom: '30px' }}>
          <Timer />
        </div>

        {/* Register Button - Shine & Slide Animation */}
        <div className="relative inline-block mt-8">
          <style dangerouslySetInnerHTML={{ __html: `
            .register-btn-main {
                position: relative;
                background: var(--color-white);
                color: var(--color-black);
                padding: 1.5rem 4.5rem;
                border-radius: 100px;
                font-family: var(--font-space-grotesk), sans-serif;
                font-size: 1rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 2.5px;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 1.5rem;
                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(var(--color-black-rgb), 0.4);
            }

            /* shine effect */
            .register-btn-main::before {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(var(--color-white-rgb),0.8),
                    transparent
                );
                transform: translateX(-100%);
                transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }

            /* hover */
            .register-btn-main:hover {
                transform: scale(1.05) translateY(-5px);
                box-shadow: 0 20px 60px var(--white-strong);
                background: var(--color-white);
            }

            .register-btn-main:hover::before {
                transform: translateX(100%);
            }

            .register-btn-main svg {
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                flex-shrink: 0;
            }

            .register-btn-main:hover svg {
                transform: translateX(8px);
            }

            @media (max-width: 768px) {
                .register-btn-main {
                    padding: 1.25rem 3.5rem;
                    font-size: 0.95rem;
                }
            }

            @media (max-width: 480px) {
                .register-btn-main {
                    padding: 1.1rem 2.8rem;
                    font-size: 0.85rem;
                    letter-spacing: 1.5px;
                    gap: 1rem;
                }
            }

            @media (max-width: 360px) {
                .register-btn-main {
                    width: calc(100vw - 48px);
                    padding: 1rem 1.5rem;
                    font-size: 0.75rem;
                    justify-content: center;
                    letter-spacing: 1px;
                }
            }
          `}} />
          
          <Link 
            href="/register" 
            className="register-btn-main group"
          >
            Register For Techkriti
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      {/* Premium Footer Section - Absolute Bottom to use below space */}
      <div className="w-[90%] mx-auto z-20 flex flex-col gap-6 py-12">
        <div 
          className="group/footer flex flex-col md:flex-row items-center gap-4 md:gap-0 rounded-[12px] md:rounded-[32px] border border-white/10 backdrop-blur-[50px] px-6 py-4 md:px-16 md:py-12 transition-all duration-500 hover:border-white/20"
          style={{
            background: 'var(--white-subtle)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Top Spacer for Mobile */}
          <div className="h-1 md:hidden" />

          {/* Left: Branding */}
          <div className="md:flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center md:justify-start">
            <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] border border-white/10 rounded-[8px] md:rounded-[14px] flex items-center justify-center text-[20px] md:text-[21px] font-bold tracking-normal transition-all duration-500 group-hover/footer:scale-110 group-hover/footer:border-white/30"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
                 }}>
              TK
            </div>
            <div className="text-center md:text-left">
              <p className="text-[14px] md:text-[18px] font-bold tracking-[0.3em] uppercase leading-none mb-3 text-white/90" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>TECHKRITI 26</p>
              <p className="text-[11px] md:text-[15px] font-medium tracking-[0.2em] text-gray-500 uppercase" style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>IIT Kanpur Festival</p>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="md:flex-[1.5] flex flex-row justify-center gap-12 md:gap-16">
            {['FAQ', 'TEAM'].map((label) => (
              <Link 
                key={label}
                href={`/${label.toLowerCase()}`} 
                className="text-[14px] md:text-[16.5px] tracking-[0.35em] text-gray-400 hover:text-white transition-all duration-300 uppercase relative group/link"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              >
                {label}
                <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-[var(--text-primary)] transition-all duration-300 -translate-x-1/2 group-hover/link:w-[60%]" />
              </Link>
            ))}
          </div>

          {/* Right: Socials */}
          <div className="md:flex-1 flex gap-10 md:gap-10 items-center justify-center">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <LinkedInIcon size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <InstagramIcon size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <YouTubeIcon size={20} />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-400 hover:text-white hover:scale-125 transition-all duration-300">
              <WhatsAppIcon size={20} />
            </a>
          </div>

          {/* Bottom Spacer for Mobile */}
          <div className="h-1 md:hidden" />
        </div>


        
        <p className="text-center text-[9px] pb-8 tracking-[0.4em] text-gray-400 uppercase"
         style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}>
          © 2026 All Rights Reserved. IIT Kanpur.
        </p>
      </div>

    </section>
  )
}
