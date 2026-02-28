"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import PortalButton from '@/components/common/PortalButton'
import './Navbar.css'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Competitions', href: '/competitions' },
  { name: 'Workshops', href: '/workshops' },
  { name: 'Hackathons', href: '/hackathons' },
  { name: 'Archives', href: '/archives' },
]

const mobileNavItems = [
  ...navItems,
  { name: 'FAQ', href: '/faq' },
  { name: 'Team', href: '/team' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>


      <header className="navbar-header">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link href="/" className="flex items-center gap-4" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="relative w-[48px] h-[48px] md:w-[56px] md:h-[56px] flex items-center justify-center">
              <Image 
                src="/TechKriti_logo.svg" 
                alt="TechKriti Logo" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
            <div style={{ textAlign: 'left' }} className="hidden sm:block logo-text-wrap">
              <p style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px', color: 'var(--text-primary)' }}>TechKriti</p>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>IIT Kanpur</p>
            </div>
          </Link>
        </div>

        {/* Center: Navigation Pill (Desktop Only) */}
        <div className="navbar-center">
          <ul className="nav-pill-list">
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
                  className={`nav-pill-link ${mounted && item.href === pathname ? 'is-active' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: CTA Button (Desktop Only) */}
        <div className="navbar-right">
          <PortalButton />
        </div>

        {/* Hamburger Button (Mobile Only) */}
        <button
          className={`navbar-hamburger ${mobileOpen ? 'is-open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? 'is-open' : ''}`}>
        {mobileNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={(mounted && item.href === pathname) ? 'is-active-link' : ''}
            onClick={() => {
              setMobileOpen(false)
              if (item.name === 'Home' && pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            {item.name}
          </Link>
        ))}
        <div className="mobile-nav-portal">
          <PortalButton />
        </div>
      </div>
    </>
  )
}
