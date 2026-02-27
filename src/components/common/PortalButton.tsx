'use client'

import React from 'react'
import Link from 'next/link'

export default function PortalButton() {
  return (
    <Link 
      href="/signin" 
      className="btn btn-secondary"
      style={{
        height: '56px',
        padding: '0 8px 0 32px',
        borderRadius: '100px',
        fontSize: '16px',
        pointerEvents: 'auto',
        borderWidth: '1px'
      }}
    >
      <span style={{ marginRight: '24px' }}>Sign in</span>
      <div 
        style={{
          backgroundColor: 'var(--color-white)',
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
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="var(--color-black)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </Link>
  )
}
