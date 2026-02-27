'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import StarBackground from '@/components/common/StarBackground'
import AmbientAurora from '@/components/common/AmbientAurora'
import Preloader from '@/components/common/Preloader'
import './signin.css'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.remove('no-scroll')
      document.body.classList.remove('no-scroll')
    } else {
      document.documentElement.classList.add('no-scroll')
      document.body.classList.add('no-scroll')
    }
  }, [isLoading])

  const handleGoogleSignIn = () => {
    setIsSigningIn(true)
    setError(null)

    // Mock the sign in process (simulating a failure to demonstrate error state)
    setTimeout(() => {
      setIsSigningIn(false)
      setError("Unable to connect to Google Auth servers. Please check your connection or try again.")
    }, 1500)
  }

  return (
    <main className="signin-container">
      <Preloader onComplete={() => setIsLoading(false)} />
      <StarBackground mode="drift" count={200} />
      <AmbientAurora />
      
      {!isLoading && (
        <div className="signin-content">
          <Link href="/" className="back-link animate-fade-in" style={{ 
            position: 'absolute', 
            top: '-60px', 
            left: '0', 
            color: 'var(--text-muted)', 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '0.9rem',
            fontFamily: 'var(--font-ui)',
            transition: 'color 0.3s ease'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <div className="signin-card animate-fade-in">
            <div className="signin-header">
              <h1 className="signin-title">
                Welcome <span style={{ fontStyle: 'italic', fontWeight: 'var(--fw-light)' }}>Back</span>
              </h1>
              <p className="signin-subtitle">Access your TechKriti '26 Portal</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.8rem', lineHeight: '1.5' }}>
                Sign in to register for events and manage your teams
              </p>
            </div>

            <div className="signin-actions">
              {error && (
                <div style={{ 
                  color: '#ef4444', 
                  fontSize: '0.85rem', 
                  marginBottom: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(239, 68, 68, 0.05)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Authentication Failed
                  </div>
                  {error}
                  <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(239, 68, 68, 0.1)', color: 'var(--text-muted)' }}>
                    Alternate sign-in methods exist. Please try reloading or contact support if the issue persists.
                  </div>
                </div>
              )}
              <button 
                className={`btn btn-google btn-shine ${isSigningIn ? 'loading' : ''}`}
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                style={{ opacity: isSigningIn ? 0.7 : 1, position: 'relative' }}
              >
                {isSigningIn ? (
                   <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                     <svg style={{ marginRight: '10px', height: '18px', width: '18px', animation: 'ctSpin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Connecting...
                   </span>
                ) : (
                  <>
                    <div className="google-icon-wrapper">
                      <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>

            <div className="signin-footer">
              <p className="terms-text">
                By entering, you agree to our <br />
                <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
