import React from "react";

export const FeatureIcon: React.FC<{ name?: string; size?: number }> = ({ name="analytics", size=40 }) => {
  // simple icon switch — expand as needed
  if (name === "analytics") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="9" width="3" height="12" rx="1" fill="#0b5cff" />
        <rect x="9" y="5" width="3" height="16" rx="1" fill="#39a0ed" />
        <rect x="15" y="1" width="3" height="20" rx="1" fill="#ffd166" />
      </svg>
    );
  }
  // fallback
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#bf9b30"/>
    </svg>
  );
};
