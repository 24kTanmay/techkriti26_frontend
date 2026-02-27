'use client'

import React from 'react'
import Link from 'next/link'
import { PortalArrowIcon } from './Icons'
import './PortalButton.css'

export default function PortalButton() {
  return (
    <>
      <Link 
        href="/signin" 
        className="btn btn-secondary portal-btn-container"
      >
        <span className="portal-btn-text">Sign in</span>
        <div className="portal-btn-icon-wrap">
          <PortalArrowIcon size={20} stroke="var(--color-black)" />
        </div>
      </Link>
    </>
  )
}
