import React from 'react';

export default function MsnLogo({ className = 'h-10' }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 100 80"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Laptop Screen Frame */}
        <rect
          x="18"
          y="6"
          width="64"
          height="40"
          rx="5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
        />

        {/* MSN Text Inside Screen */}
        <text
          x="50"
          y="32"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="18"
          fontWeight="900"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="1"
        >
          MSN
        </text>

        {/* Laptop Base Stand */}
        <path
          d="M10 46 L90 46 A 2 2 0 0 1 92 48 L92 50 L8 50 L8 48 A 2 2 0 0 1 10 46 Z"
          fill="#FFFFFF"
        />

        {/* Red Swoosh accent under screen / on base */}
        <path
          d="M42 45 L88 34 L82 50 Z"
          fill="#C8102E"
        />

        {/* Arc Underneath Base */}
        <path
          d="M32 50 A 20 12 0 0 0 68 50"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* "Academy" Text Below */}
        <text
          x="50"
          y="74"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="18"
          fontWeight="500"
          fontFamily="Inter, system-ui, sans-serif"
        >
          Academy
        </text>
      </svg>
    </div>
  );
}
