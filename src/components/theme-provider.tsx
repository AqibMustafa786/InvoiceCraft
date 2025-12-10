"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


type ColorContextType = {
  color: string;
  setColor: (color: string) => void;
};

const ColorContext = React.createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [color, setColor] = React.useState("#ffffff"); // Default to white

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (color) {
      root.style.setProperty('--background', color);
    }
  }, [color]);

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export const useColor = () => {
  const context = React.useContext(ColorContext);
  if (context === undefined) {
    throw new Error("useColor must be used within a ColorProvider");
  }
  return context;
};

// Re-export useTheme from next-themes
export { useTheme } from "next-themes";
