import React from "react";

const Illustration: React.FC<{ width?: number; height?: number }> = ({ width = 420, height = 260 }) => (
  <svg width={width} height={height} viewBox="0 0 840 520" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vessel illustration">
    <rect x="0" y="0" width="840" height="520" rx="16" fill="#f6f7fb"/>
    <g transform="translate(40,50)">
      <rect x="0" y="150" width="760" height="60" rx="18" fill="#283655"/>
      <rect x="80" y="90" width="600" height="80" rx="10" fill="#6c8ebf"/>
      <circle cx="120" cy="190" r="14" fill="#ffd166"/>
      <circle cx="680" cy="190" r="14" fill="#ffd166"/>
      <rect x="120" y="50" width="100" height="40" rx="6" fill="#0b5cff"/>
      <rect x="240" y="60" width="280" height="24" rx="6" fill="#9fb3e1"/>
    </g>
    <text x="60" y="36" fill="#0b5cff" fontSize="22" fontFamily="Segoe UI, Roboto, sans-serif">Exzing EnergyX</text>
  </svg>
);

export default Illustration;
