import React, { useMemo } from "react";
import { useTheme } from "@fluentui/react";

const BackgroundCanvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  // detect dark by sampling the theme's neutralLighter color luminance if available
  const isDark = useMemo(() => {
    try {
      const bg = theme.palette?.neutralPrimary || "#071029";
      // simple luminance test on hex color
      const hex = bg.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return lum < 0.55;
    } catch {
      return true;
    }
  }, [theme]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    minHeight: "100vh",
    width: "100%",
    // background: isDark
    //   ? "linear-gradient(180deg, #071029 0%, #041526 60%, #031021 100%)"
    //   : "linear-gradient(180deg, #f6fbff 0%, #e9f2ff 60%, #ffffff 100%)",
    // color: isDark ? "#fff" : "#111",
  };

  const blobStyle = (x: string, y: string, w: number, h: number, color: string) => ({
    position: "absolute" as const,
    top: y,
    left: x,
    width: w,
    height: h,
    background: color,
    borderRadius: 300,
    opacity: isDark ? 0.08 : 0.12,
    filter: "blur(36px)",
    transform: "translateZ(0)",
    pointerEvents: "none" as const,
  });

  return (
    <div style={containerStyle}>
      <div style={blobStyle("-10%", "-6%", 680, 420, isDark ? "radial-gradient(circle at 20% 20%, #39a0ed, transparent 40%)" : "radial-gradient(circle at 20% 20%, #60a5fa, transparent 45%)")} />
      <div style={blobStyle("70%", "10%", 520, 360, isDark ? "radial-gradient(circle at 80% 80%, #ffd166, transparent 35%)" : "radial-gradient(circle at 80% 80%, #ffdd99, transparent 35%)")} />
      <div style={blobStyle("40%", "20%", 360, 260, isDark ? "radial-gradient(circle at 50% 50%, #6c8ebf, transparent 40%)" : "radial-gradient(circle at 50% 50%, #9fb3e1, transparent 40%)")} />
      {/* faint grid / texture */}
      <svg style={{ position: "absolute", inset: 0, zIndex: 0, opacity: isDark ? 0.04 : 0.06 }} preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="p" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0 L0 0 0 10" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeOpacity="0.04" strokeWidth="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p)" />
      </svg>

      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundCanvas;
