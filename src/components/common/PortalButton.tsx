'use client'

import React from 'react'
import Link from 'next/link'
import { PortalArrowIcon } from './Icons'

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
        <PortalArrowIcon size={20} stroke="var(--color-black)" />
      </div>
    </Link>
  )
}
