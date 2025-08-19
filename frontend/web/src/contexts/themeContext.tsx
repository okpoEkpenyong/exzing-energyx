// frontend/web/src/contexts/themeContext.tsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@fluentui/react";
import { DarkTheme as ImportedDarkTheme } from "../ux/theme"; // relative import to your existing theme file (optional)

type ThemeContextValue = {
  isDark: boolean;
  toggle: () => void;
};

export const ThemeToggleContext = createContext<ThemeContextValue>({
  isDark: true,
  toggle: () => {},
});

/**
 * ThemeProviderWrapper
 * - Wrap the app with this. Uses stored preference in localStorage.
 * - Falls back to a small generated dark theme if your ux/theme doesn't export DarkTheme.
 */
export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("energyx:isDark");
      return v ? v === "1" : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("energyx:isDark", isDark ? "1" : "0");
    } catch {}
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((v) => !v), []);

  // prefer existing DarkTheme (if present), otherwise fall back
  const darkTheme = ImportedDarkTheme ? (ImportedDarkTheme as any) : createTheme({
    palette: {
      themePrimary: "#bf9b30",
      neutralLighterAlt: "#2b2b2b",
      neutralLighter: "#262626",
      neutralLight: "#1f1f1f",
      neutralQuaternaryAlt: "#2a2a2a",
      neutralQuaternary: "#2a2a2a",
      neutralTertiaryAlt: "#3a3a3a",
      neutralTertiary: "#c8c8c8",
      neutralSecondary: "#a6a6a6",
      neutralPrimaryAlt: "#8a8a8a",
      neutralPrimary: "#ffffff",
      neutralDark: "#000000",
      black: "#000000",
      white: "#121212",
    },
  });

  const lightTheme = useMemo(() => createTheme({
    palette: {
      themePrimary: "#0b5cff",
      neutralLighterAlt: "#f8f8f8",
      neutralLighter: "#f3f2f1",
      neutralLight: "#edebe9",
      neutralQuaternaryAlt: "#e1dfdd",
      neutralQuaternary: "#d0d0d0",
      neutralTertiaryAlt: "#c8c8c8",
      neutralTertiary: "#69707a",
      neutralSecondary: "#605e5c",
      neutralPrimaryAlt: "#3b3a3a",
      neutralPrimary: "#201f1e",
      neutralDark: "#0b0b0b",
      black: "#000000",
      white: "#ffffff",
    },
  }), []);

  const activeTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeToggleContext.Provider value={{ isDark, toggle }}>
      <ThemeProvider applyTo="body" theme={activeTheme}>
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
};
