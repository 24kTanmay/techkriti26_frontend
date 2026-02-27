'use client'

import React, { useState } from 'react'
import { StarBackgroundViewport } from '@/components/common/StarBackground'
import Navbar from '@/components/common/Navbar'
import { useTabIndicator } from '@/hooks/useTabIndicator'
import type { EventDetailData } from '@/types/event'
import '@/components/ui/EventDetailPage.css'
import Confirmation from '@/components/ui/Confirmation'
import CreateTeam from '@/components/ui/CreateTeam'
import JoinTeam from '@/components/ui/JoinTeam'
import AbstractUpload from '@/components/ui/AbstractUpload'

/**
 * Shared template for all competition detail pages.
 * Each page only needs to pass in its unique data — all layout, tab logic,
 * and animations are handled here.
 */
export default function EventDetailPage({ data }: { data: EventDetailData }) {
  const {
    title,
    breadcrumb,
    canvasId,
    tabs,
    contacts,
    overview,
    secondTab,
    abstract,
    ambientGradient,
    imageFallbackGradient,
  } = data

  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 'overview')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showJoinTeam, setShowJoinTeam] = useState(false)
  const { indicatorRef, tabsContainerRef } = useTabIndicator(activeTab)

  return (
    <div className="event-detail-page">
      <StarBackgroundViewport mode="rise" count={200} canvasId={canvasId} />
      <div className="event-noise" />
      <div
        className="event-ambient-core"
        style={ambientGradient ? { background: ambientGradient } : undefined}
      />

      <Navbar />

      <div className="event-main-container">
        <div className="event-header-section">
          <span className="event-breadcrumb">{breadcrumb}</span>
          <h1 className="event-page-title">
            <span>{title}</span>
          </h1>
        </div>

        <div className="event-panel">
          {/* Left: Image */}
          <div className="event-panel-image">
            <div
              className="event-image-bg"
              style={imageFallbackGradient ? { background: imageFallbackGradient } : undefined}
            />
            <div className="event-image-overlay" />
          </div>

          {/* Right: Content */}
          <div className="event-panel-content">
            {/* Tab Bar */}
            <div className="event-tabs-wrapper">
              <div className="event-tab-indicator" ref={indicatorRef} />
              <div className="event-tabs-list" ref={tabsContainerRef}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`event-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
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

            {/* Tab Panes */}
            <div className="event-panes-container" role="tabpanel">
              {/* Overview */}
              <div className={`event-tab-pane ${activeTab === tabs[0]?.id ? 'active' : ''}`}>
                <div>
                  {overview.paragraphs.map((text, i) => (
                    <p key={i} className="event-pane-text">
                      {overview.highlight && text.includes(overview.highlight) ? (
                        <>
                          {text.split(overview.highlight)[0]}
                          <span className="event-pane-highlight">{overview.highlight}</span>
                          {text.split(overview.highlight)[1]}
                        </>
                      ) : (
                        text
                      )}
                    </p>
                  ))}
                  <div className="event-meta-data">
                    {overview.meta.map((item, i) => (
                      <React.Fragment key={i}>
                        <div
                          className="event-meta-label"
                          style={i > 0 ? { marginTop: '1rem' } : undefined}
                        >
                          {item.label}
                        </div>
                        <div className="event-meta-value">{item.value}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="event-action-group">
                  <button 
                    className="btn btn-primary btn-shine" 
                    aria-label="Register as Individual"
                    onClick={() => setShowConfirmation(true)}
                  >
                    Individual
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    aria-label="Create a new team"
                    onClick={() => setShowCreateTeam(true)}
                  >
                    Create Team
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    aria-label="Join an existing team"
                    onClick={() => setShowJoinTeam(true)}
                  >
                    Join Team
                  </button>
                </div>
              </div>

              {/* Second Tab (Problem Statement / Rules) */}
              {secondTab && tabs[1] && (
                <div className={`event-tab-pane ${activeTab === tabs[1].id ? 'active' : ''}`}>
                  <div>
                    <p className="event-pane-text">{secondTab.description}</p>
                    {secondTab.download && (
                      <div
                        className="event-download-card"
                        role="button"
                        tabIndex={0}
                        aria-label={`Download ${secondTab.download.title}`}
                      >
                        <div className="event-down-text">
                          <h4>{secondTab.download.title}</h4>
                          <p>{secondTab.download.subtitle}</p>
                        </div>
                        <div className="event-down-icon">↓</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Abstract */}
              {abstract && (
                <div className={`event-tab-pane ${activeTab === 'abstract' ? 'active' : ''}`}>
                  <AbstractUpload eventTitle={title} />
                </div>
              )}

              {/* Contacts */}
              {tabs.find((tab) => tab.id === 'contacts') && (
                <div className={`event-tab-pane ${activeTab === 'contacts' ? 'active' : ''}`}>
                  <div>
                    <p className="event-pane-text">
                      For technical queries or event-related questions, reach out to the coordinators.
                    </p>
                    <div className="event-contacts-grid">
                      {contacts.map((contact) => (
                        <div key={contact.name} className="event-contact-card">
                          <div className="event-c-name">{contact.name}</div>
                          <div className="event-c-number">{contact.number}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <Confirmation onClose={() => setShowConfirmation(false)} />
      )}

      {showCreateTeam && (
        <CreateTeam onClose={() => setShowCreateTeam(false)} />
      )}

      {showJoinTeam && (
        <JoinTeam onClose={() => setShowJoinTeam(false)} />
      )}
    </div>
  )
}

