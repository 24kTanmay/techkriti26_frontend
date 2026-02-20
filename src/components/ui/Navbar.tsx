"use client"

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import PortalButton from './PortalButton'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Competitions', href: '/competitions' },
    { name: 'Archives', href: '/archives' },
    { name: 'Team', href: '/team' },
  ]

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
        zIndex: 1000,
        pointerEvents: 'none',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Left: Logo */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', pointerEvents: 'auto' }}>
        <Link href="/" className="flex items-center gap-4" style={{ textDecoration: 'none', color: 'inherit' }}>
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
            <p style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px', color: 'white' }}>TechKriti</p>
            <p style={{ fontSize: '8px', color: '#666', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>IIT Kanpur</p>
          </div>
        </Link>
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
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={item.href}
                onClick={(e: React.MouseEvent) => {
                  if (item.name === 'Home' && pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                style={{
                  textDecoration: 'none',
                  color: (item.href === pathname || (item.name === 'About' && pathname === '/')) ? '#ffffff' : '#888',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  fontFamily: 'monospace',
                  textShadow: (item.href === pathname || (item.name === 'About' && pathname === '/')) ? '0 0 15px rgba(255,255,255,0.5)' : 'none'
                }}
                onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.textShadow = '0 0 15px rgba(255,255,255,0.5)';
                }}
                onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (!(item.href === pathname || (item.name === 'About' && pathname === '/'))) {
                    e.currentTarget.style.color = '#888';
                    e.currentTarget.style.textShadow = 'none';
                  }
                }}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: CTA Button */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pointerEvents: 'auto' }}>
        <PortalButton />
      </div>
    </header>
  )
}
