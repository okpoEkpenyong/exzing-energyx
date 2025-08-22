import React from "react";
// import { useTheme } from "@fluentui/react";

const HeroIllustration: React.FC<{ width?: number; height?: number }> = ({ width = 420, height = 300 }) => {
  // const theme = useTheme();
  // const isDark = !!theme.palette?.themeDark;
  const primary = "#0b5cff";
  const accent =  "#ffb703";

  return (
    <svg width={width} height={height} viewBox="0 0 840 600" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vessel illustration">
      <rect x="0" y="0" width="840" height="600" rx="12" fill={"#f7fbff"} />
      <g transform="translate(60,280)">
        <path d="M0 80 Q120 10 380 25 Q640 40 760 78 L760 120 L0 120 Z" fill={"#283655"} />
        <rect x="80" y="-30" width="520" height="72" rx="10" fill={primary} />
        <circle cx="110" cy="92" r="10" fill={accent} />
        <circle cx="690" cy="92" r="10" fill={accent} />
      </g>
      <g transform="translate(160,180)">
        <rect x="0" y="0" width="120" height="64" rx="8" fill={"#0b5cff"} />
        <rect x="140" y="10" width="300" height="36" rx="6" fill={"#9fb3e1"} />
      </g>
      <text x="166" y="58" fill={"#394b6b"} fontSize="25">Maritime Carbon Intelligence</text>
    </svg>
  );
};

export default HeroIllustration
