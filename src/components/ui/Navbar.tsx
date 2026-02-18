"use client"

import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <header 
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 40px',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000, // Ensuring it's above everything
        pointerEvents: 'none',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Left: Logo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', pointerEvents: 'auto' }}>
        <div className="flex items-center gap-4">
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            TK
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>TechKriti</p>
            <p style={{ fontSize: '8px', color: '#666', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>IIT Kanpur</p>
          </div>
        </div>
      </div>

      {/* Center: Navigation Pill */}
      <div style={{ flex: 2, display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
        <ul 
          style={{
            display: 'flex',
            gap: '32px',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 32px',
            borderRadius: '100px',
            listStyle: 'none',
            margin: 0,
            alignItems: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
          }}
        >
          {['Home', 'Technical', 'Entrepreneurial', 'Miscellaneous'].map((item) => (
            <li key={item}>
              <Link 
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                style={{
                  textDecoration: 'none',
                  color: '#888',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  fontFamily: 'monospace'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.textShadow = '0 0 15px rgba(255,255,255,0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#888';
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: CTA Button */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        <Link 
          href="/signin" 
          className="group"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '5px 5px 5px 24px',
            borderRadius: '100px',
            textDecoration: 'none',
            color: 'white',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        >
          <span style={{ marginRight: '16px' }}>Portal</span>
          <div 
            style={{
              backgroundColor: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
          >
            <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </Link>
      </div>
    </header>
  )
}
