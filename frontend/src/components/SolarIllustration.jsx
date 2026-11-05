import React from 'react';

export function SolarHeroIllustration({ className = "w-full h-auto max-w-md" }) {
  return (
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Sky backdrop */}
      <rect x="10" y="10" width="480" height="380" rx="24" fill="url(#skyGrad)" />

      {/* Sun with pulsing ray glow */}
      <circle cx="390" cy="110" r="50" fill="url(#sunGrad)" opacity="0.9" />
      <circle cx="390" cy="110" r="65" stroke="#FDE68A" strokeWidth="2" strokeDasharray="6 6" />
      <line x1="390" y1="40" x2="390" y2="20" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <line x1="390" y1="180" x2="390" y2="200" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <line x1="320" y1="110" x2="300" y2="110" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <line x1="460" y1="110" x2="480" y2="110" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <line x1="340" y1="60" x2="325" y2="45" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <line x1="440" y1="160" x2="455" y2="175" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

      {/* Sun Ray Beams hitting panels */}
      <path d="M350 140 L230 220" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      <path d="M370 160 L280 230" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />

      {/* Modern Building / Villa Structure */}
      <path d="M90 280 L250 160 L410 280 V370 H90 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
      
      {/* Front door & glass windows */}
      <rect x="225" y="310" width="50" height="60" rx="4" fill="#0F172A" />
      <circle cx="265" cy="340" r="3" fill="#34D399" />
      
      <rect x="130" y="300" width="60" height="40" rx="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="160" y1="300" x2="160" y2="340" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="130" y1="320" x2="190" y2="320" stroke="#94A3B8" strokeWidth="1.5" />

      <rect x="310" y="300" width="60" height="40" rx="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="340" y1="300" x2="340" y2="340" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="310" y1="320" x2="370" y2="320" stroke="#94A3B8" strokeWidth="1.5" />

      {/* Rooftop Solar Arrays (Left pitch) */}
      <g transform="rotate(-3, 250, 200)">
        <polygon points="120,260 230,175 240,185 130,270" fill="url(#panelGrad)" stroke="#064E3B" strokeWidth="1.5" />
        <line x1="145" y1="238" x2="155" y2="248" stroke="#A7F3D0" strokeWidth="1" />
        <line x1="175" y1="215" x2="185" y2="225" stroke="#A7F3D0" strokeWidth="1" />
        <line x1="205" y1="192" x2="215" y2="202" stroke="#A7F3D0" strokeWidth="1" />
      </g>

      {/* Rooftop Solar Arrays (Right pitch) */}
      <g transform="rotate(3, 250, 200)">
        <polygon points="265,185 375,265 365,275 255,195" fill="url(#panelGrad)" stroke="#064E3B" strokeWidth="1.5" />
        <line x1="290" y1="205" x2="280" y2="215" stroke="#A7F3D0" strokeWidth="1" />
        <line x1="320" y1="228" x2="310" y2="238" stroke="#A7F3D0" strokeWidth="1" />
        <line x1="350" y1="250" x2="340" y2="260" stroke="#A7F3D0" strokeWidth="1" />
      </g>

      {/* Bi-directional Inverter & Smart Meter Node */}
      <rect x="60" y="325" width="22" height="35" rx="3" fill="#10B981" />
      <circle cx="71" cy="336" r="3" fill="#FFFFFF" />
      <path d="M66 348 H76" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

      {/* Clean Energy Badge */}
      <g transform="translate(320, 20)">
        <rect width="140" height="40" rx="20" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
        <circle cx="22" cy="20" r="12" fill="#10B981" />
        <path d="M17 20 L21 24 L27 16" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="42" y="18" fill="#0F172A" fontSize="11" fontWeight="700">100% CLEAN</text>
        <text x="42" y="30" fill="#059669" fontSize="10" fontWeight="600">ZERO CARBON</text>
      </g>

      {/* Ground Grass Line */}
      <path d="M30 370 H470" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
      <circle cx="70" cy="370" r="14" fill="#34D399" opacity="0.3" />
      <circle cx="430" cy="370" r="18" fill="#34D399" opacity="0.3" />
    </svg>
  );
}

export function SolarPanelsIllustration({ className = "w-24 h-24" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="15" y="20" width="70" height="55" rx="4" fill="#047857" stroke="#064E3B" strokeWidth="2" transform="skewX(-8)" />
      <line x1="38" y1="20" x2="30" y2="75" stroke="#34D399" strokeWidth="1.5" />
      <line x1="62" y1="20" x2="54" y2="75" stroke="#34D399" strokeWidth="1.5" />
      <line x1="12" y1="48" x2="80" y2="48" stroke="#34D399" strokeWidth="1.5" />
      {/* Stand legs */}
      <line x1="25" y1="75" x2="25" y2="90" stroke="#475569" strokeWidth="3" />
      <line x1="65" y1="75" x2="65" y2="90" stroke="#475569" strokeWidth="3" />
      <line x1="15" y1="90" x2="75" y2="90" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function EcoLeafIllustration({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="40" cy="40" r="36" fill="#ECFDF5" />
      <path d="M40 18C28 18 20 28 20 42C20 54 30 62 42 62C56 62 62 50 62 38C62 26 52 18 40 18Z" fill="#10B981" />
      <path d="M26 44C36 44 48 34 56 24" stroke="#D1FAE5" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M38 44C44 48 48 54 52 58" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
