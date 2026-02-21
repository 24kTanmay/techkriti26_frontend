'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import '@/components/ui/TerminalEvent.css'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'track', label: 'Competition Track' },
  { id: 'contacts', label: 'Contacts' },
] as const

interface Contact {
  name: string
  number: string
}

const CONTACTS: Contact[] = [
  { name: 'Vikram', number: '+91 66554 33221' },
  { name: 'Niti', number: '+91 55443 22110' },
]

export default function FinsearchPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const indicatorRef = useRef<HTMLDivElement>(null)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const updateIndicator = useCallback((targetId: string) => {
    if (!indicatorRef.current || !tabsContainerRef.current) return
    const activeBtn = tabsContainerRef.current.querySelector(
      `[data-target="${targetId}"]`
    ) as HTMLElement | null
    if (!activeBtn) return

    requestAnimationFrame(() => {
      if (indicatorRef.current) {
        indicatorRef.current.style.width = `${activeBtn.offsetWidth}px`
        indicatorRef.current.style.left = `${activeBtn.offsetLeft}px`
      }
    })
  }, [])

  useEffect(() => {
    updateIndicator(activeTab)
  }, [activeTab, updateIndicator])

  useEffect(() => {
    const container = tabsContainerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => updateIndicator(activeTab))
    observer.observe(container)
    return () => observer.disconnect()
  }, [activeTab, updateIndicator])

  return (
    <div className="terminal-page-container">
      <StarBackgroundViewport mode="rise" count={180} canvasId="terminal-star-canvas-finsearch" />
      <div className="noise-terminal" />
      <div className="ambient-core-terminal" style={{ background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 60%)' }} />

      <Navbar />

      <div className="terminal-main-container">
        <div className="header-section-terminal">
          <span className="breadcrumb-terminal">Entrepreneurial / Finsearch / EN-06</span>
          <h1 className="page-title-terminal"><span>FINSEARCH</span></h1>
        </div>

        <div className="terminal-panel">
          <div className="panel-image-terminal">
            <div className="image-bg-terminal" style={{ background: 'linear-gradient(45deg, #78350f 0%, #92400e 100%)' }} />
            <div className="image-overlay-terminal" />
          </div>

          <div className="panel-content-terminal">
            <div className="tabs-wrapper-terminal">
              <div className="tab-indicator-terminal" ref={indicatorRef} />
              <div className="tabs-list-terminal" ref={tabsContainerRef}>
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn-terminal ${activeTab === tab.id ? 'active' : ''}`}
                    data-target={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="panes-container-terminal" role="tabpanel">
              <div className={`tab-pane-terminal ${activeTab === 'overview' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    Finsearch is a challenge for the numerically gifted and the financially savvy. Dive into the world of algorithmic trading, derivatives, and systemic risk analysis.
                  </p>
                  <p className="pane-text-terminal">
                    Whether you are a math enthusiast or an aspiring quant, this competition tests your ability to find patterns and value in the <span className="pane-highlight-terminal">Financial Entropy</span>.
                  </p>
                  <div className="meta-data-terminal">
                    <div className="meta-label-terminal">Focus Areas</div>
                    <div className="meta-value-terminal">Quant Finance // Data Alpha</div>
                    <div className="meta-label-terminal" style={{ marginTop: '1rem' }}>Total Prize Pool</div>
                    <div className="meta-value-terminal">INR 50,000</div>
                  </div>
                </div>

                <div className="action-group-terminal">
                  <button className="btn-action-terminal primary" aria-label="Register as Individual">Individual</button>
                  <button className="btn-action-terminal" aria-label="Create a new team">Create Team</button>
                  <button className="btn-action-terminal" aria-label="Join an existing team">Join Team</button>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'track' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">
                    The competition consists of a preliminary quantitative test followed by a 24-hour backtesting hackathon.
                  </p>
                  <div className="download-card-terminal" role="button" tabIndex={0} aria-label="Download Finsearch problem set">
                    <div className="down-text-terminal">
                      <h4>Finsearch_Alpha_v1.pdf</h4>
                      <p>Encrypted Quant Set • 0.9 MB</p>
                    </div>
                    <div className="down-icon-terminal">↓</div>
                  </div>
                </div>
              </div>

              <div className={`tab-pane-terminal ${activeTab === 'contacts' ? 'active' : ''}`}>
                <div>
                  <p className="pane-text-terminal">For theoretical clarifications or data-access issues, reach out to our quant desk.</p>
                  <div className="contacts-grid-terminal">
                    {CONTACTS.map(contact => (
                      <div key={contact.name} className="contact-card-terminal">
                        <div className="c-name-terminal">{contact.name}</div>
                        <div className="c-number-terminal">{contact.number}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
