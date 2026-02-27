'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import StarBackground from '@/components/common/StarBackground'
import AmbientAurora from '@/components/common/AmbientAurora'
import Preloader from '@/components/common/Preloader'
import { ArrowLeftIcon, ErrorIcon, LoadingIcon, GoogleIcon } from '@/components/common/Icons'
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
            <ArrowLeftIcon size={20} />
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
                    <ErrorIcon size={16} strokeWidth={2} />
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
                     <LoadingIcon className="loading-spinner" style={{ marginRight: '10px' }} />
                     Connecting...
                   </span>
                ) : (
                  <>
                    <div className="google-icon-wrapper">
                      <GoogleIcon size={24} />
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
