import React, { createContext, useContext, useState } from 'react';

export enum Theme {
  Dark = 'dark',
  Light = 'light',
  Standard = 'standard',
}

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Standard);

  const setAndStoreTheme = (theme: Theme) => {
    localStorage.setItem('theme', theme);
    setTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setAndStoreTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
