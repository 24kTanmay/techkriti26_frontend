"use client"

import React from 'react';

// 1. The Microchip Icon Component (SVG)
interface IconProps {
  style?: React.CSSProperties;
}

const ChipIcon: React.FC<IconProps> = ({ style }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="square" 
      style={style}
    >
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <path d="M9 2V5 M15 2V5" />
      <path d="M9 19V22 M15 19V22" />
      <path d="M2 9H5 M2 15H5" />
      <path d="M19 9H22 M19 15H22" />
      <rect x="7" y="14" width="3" height="3" fill="currentColor" stroke="none" />
      <line x1="14" y1="9" x2="16" y2="9" />
    </svg>
  );
};

// 2. The Main Mission Card Component
const MissionCard: React.FC = () => {
  return (
    <div className="flex justify-center items-center font-sans p-4">
      {/* Card Container */}
      <div 
        style={{
          background: 'linear-gradient(145deg, #13132b 0%, #0a0a16 100%)',
          width: '100%',
          maxWidth: '480px',
          padding: '48px',
          borderRadius: '40px',
          color: '#ffffff',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          boxSizing: 'border-box',
          isolation: 'isolate'
        }}
      >
        {/* Inner Highlight Border Effect (::after replacement) */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '40px',
            padding: '1px',
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Header: Title + Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 500, margin: 0, letterSpacing: '-1.5px', lineHeight: 1 }}>
            Mission
          </h2>
          <ChipIcon style={{ width: '42px', height: '42px' }} />
        </div>

        {/* Body Text */}
        <p style={{ fontSize: '1.35rem', lineHeight: 1.3, fontWeight: 400, margin: 0, color: '#f0f0f0', letterSpacing: '-0.3px' }}>
          At GenRevive, we blend cutting-edge genetics, synthetic biology, and ancient DNA sequencing to achieve what was once only science fiction: the resurrection of extinct species.
        </p>
      </div>
    </div>
  );
};

export default MissionCard;
