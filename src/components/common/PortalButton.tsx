'use client'

import React from 'react'
import Link from 'next/link'
import { PortalArrowIcon } from './Icons'

export default function PortalButton() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .portal-btn-container {
          height: 56px;
          padding: 0 8px 0 32px;
          border-radius: 100px;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          pointer-events: auto;
          transition: all 0.4s ease;
        }

        .portal-btn-text {
          margin-right: 24px;
          white-space: nowrap;
        }

        .portal-btn-icon-wrap {
          background-color: var(--color-white);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (max-width: 1200px) {
          .portal-btn-container {
            padding: 0 6px 0 20px;
            font-size: 14px;
            height: 48px;
          }
          .portal-btn-text {
            margin-right: 12px;
          }
          .portal-btn-icon-wrap {
            width: 36px;
            height: 36px;
          }
        }
      `}} />
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
