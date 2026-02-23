'use client'

import React from 'react'
import Link from 'next/link'

export default function PortalButton() {
  return (
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
        height: '56px',
        padding: '0 8px 0 36px',
        borderRadius: '100px',
        textDecoration: 'none',
        color: 'white',
        fontSize: '16.5px',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: "var(--font-space-grotesk), sans-serif",
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        pointerEvents: 'auto'
      }}
      onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      <span style={{ marginRight: '24px' }}>Sign in</span>
      <div 
        style={{
          backgroundColor: '#fff',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </Link>
  )
}
