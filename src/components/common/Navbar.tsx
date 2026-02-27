"use client"

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import PortalButton from '@/components/common/PortalButton'

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
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Navbar Responsive Styles ── */
        .navbar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          pointer-events: none;
          box-sizing: border-box;
          font-family: var(--font-space-grotesk), sans-serif;
        }

        .navbar-left { flex: 1; display: flex; justify-content: flex-start; align-items: center; pointer-events: auto; }
        .navbar-center { flex: 2; display: flex; justify-content: center; align-items: center; pointer-events: auto; }
        .navbar-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; pointer-events: auto; }

        /* Navigation Pill Styles */
        .nav-pill-list {
          display: flex;
          align-items: center;
          gap: 32px;
          background: var(--white-subtle);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid var(--border-subtle);
          padding: 0 44px;
          height: 56px;
          border-radius: 100px;
          list-style: none;
          margin: 0;
          box-shadow: 0 20px 40px rgba(var(--color-black-rgb), 0.1);
          transition: all 0.4s ease;
        }

        .nav-pill-link {
          text-decoration: none;
          font-size: 16.5px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          font-family: var(--font-space-grotesk), sans-serif;
        }

        .navbar-hamburger {
          display: none;
          pointer-events: auto;
          background: var(--white-subtle);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          width: 44px;
          height: 44px;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.3s ease;
        }

        .navbar-hamburger span {
          display: block;
          width: 18px;
          height: 1.5px;
          background: var(--color-white);
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          border-radius: 1px;
        }

        .navbar-hamburger.is-open span:nth-child(1) {
          transform: rotate(45deg) translate(4.5px, 4.5px);
        }
        .navbar-hamburger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .navbar-hamburger.is-open span:nth-child(3) {
          transform: rotate(-45deg) translate(4.5px, -4.5px);
        }

        /* ── Mobile Fullscreen Overlay ── */
        .mobile-nav-overlay {
          position: fixed;
          inset: 0;
          z-index: 999;
          background: rgba(var(--color-black-rgb), 0.97);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .mobile-nav-overlay.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .mobile-nav-overlay a {
          text-decoration: none;
          color: var(--text-secondary);
          font-size: 1.875rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: var(--font-space-grotesk), sans-serif;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
        }

        .mobile-nav-overlay.is-open a {
          opacity: 1;
          transform: translateY(0);
        }

        .mobile-nav-overlay a:nth-child(1) { transition-delay: 0.1s; }
        .mobile-nav-overlay a:nth-child(2) { transition-delay: 0.15s; }
        .mobile-nav-overlay a:nth-child(3) { transition-delay: 0.2s; }
        .mobile-nav-overlay a:nth-child(4) { transition-delay: 0.25s; }
        .mobile-nav-overlay a:nth-child(5) { transition-delay: 0.3s; }
        .mobile-nav-overlay a:nth-child(6) { transition-delay: 0.35s; }
        .mobile-nav-overlay a:nth-child(7) { transition-delay: 0.4s; }
        .mobile-nav-overlay a:nth-child(8) { transition-delay: 0.45s; }

        .mobile-nav-overlay a.is-active-link {
          color: var(--text-primary);
          text-shadow: 0 0 15px var(--white-strong);
        }

        .mobile-nav-overlay a:hover {
          color: var(--text-primary);
          text-shadow: 0 0 15px var(--white-strong);
        }

        .mobile-nav-portal {
          margin-top: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          transition-delay: 0.5s;
        }

        .mobile-nav-overlay.is-open .mobile-nav-portal {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Responsive Breakpoints ── */
        @media (max-width: 1300px) {
          .navbar-header {
            padding: 20px 30px;
          }
        }

        @media (max-width: 1250px) {
          .navbar-header {
            padding: 16px 20px;
          }
          .logo-text-wrap {
            display: none;
          }
          .nav-pill-list {
            gap: 12px;
            padding: 0 20px;
          }
          .nav-pill-link {
            font-size: 13px;
            letter-spacing: 0.05em;
          }
        }

        @media (max-width: 1024px) {
          .navbar-center { display: none; }
          .navbar-right { display: none; }
          .navbar-hamburger { display: flex; }
        }

        @media (min-width: 1025px) {
          .mobile-nav-overlay {
            display: none !important;
          }
        }
      `}} />

      <header className="navbar-header">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link href="/" className="flex items-center gap-4" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--white-subtle) 0%, transparent 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'var(--text-primary)'
          }}>
              TK
            </div>
            <div style={{ textAlign: 'left' }} className="hidden sm:block logo-text-wrap">
              <p style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px', color: 'var(--text-primary)' }}>TechKriti</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>IIT Kanpur</p>
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
                  className="nav-pill-link"
                  style={{
                    color: (mounted && item.href === pathname) ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textShadow: (mounted && item.href === pathname) ? '0 0 15px var(--white-strong)' : 'none'
                  }}
                  onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.textShadow = '0 0 15px var(--white-strong)';
                  }}
                  onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!(mounted && item.href === pathname)) {
                      e.currentTarget.style.color = 'var(--text-secondary)';
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
