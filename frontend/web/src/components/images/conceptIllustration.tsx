import React from "react";
// import { useTheme } from "@fluentui/react";

const ConceptIllustration: React.FC<{ width?: number; height?: number }> = ({ width = 420, height = 300 }) => {

  const nodeA = "#0b5cff";
  const nodeB = "#ffb703";
  const nodeC = "#61c48a";

  return (
    <svg width={width} height={height} viewBox="0 0 840 600" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Carbon intelligence illustration">
      <rect x="0" y="0" width="840" height="600" rx="12" fill={ "#fbfdff"} />
      <g stroke={"#dfefff"} strokeWidth="2" strokeLinecap="round">
        <path d="M120 440 C160 320, 280 280, 360 240" fill="none" />
        <path d="M380 120 C420 160, 540 180, 640 240" fill="none" />
        <path d="M200 220 C280 200, 360 200, 460 160" fill="none" />
        <path d="M520 460 C580 410, 680 380, 740 360" fill="none" />
      </g>
      <g>
        <circle cx="120" cy="440" r="12" fill={nodeA} />
        <circle cx="360" cy="240" r="10" fill={nodeB} />
        <circle cx="640" cy="240" r="14" fill={nodeC} />
        <circle cx="460" cy="160" r="8"  fill={nodeA} />
        <circle cx="740" cy="360" r="10" fill={nodeB} />
      </g>
      <g transform="translate(120,40)">
        <ellipse cx="540" cy="360" rx="120" ry="90" fill={"rgba(255,183,3,0.12)"} />
        <path d="M520 330 C 540 300, 620 300, 640 330 C 620 310, 560 290, 520 330 Z" fill={"#61c48a"} stroke={"#3ca56a"} strokeWidth="2" />
      </g>
      <text x="166" y="58" fill={"#394b6b"} fontSize="26">Carbon intelligence · sequestration · credits</text>
    </svg>
  );
};

export default ConceptIllustration;
