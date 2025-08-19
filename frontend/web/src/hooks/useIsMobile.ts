// frontend/web/src/hooks/useIsMobile.ts
import { useEffect, useState } from "react";

/**
 * Simple hook to detect mobile based on window width.
 * Default breakpoint: 768px (change if you prefer a different breakpoint).
 */
export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    // run once in case the initial render happened before layout
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}
