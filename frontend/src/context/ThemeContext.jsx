import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    light: {
      primary: '#3B82F6', // Light blue
      primaryDark: '#2563EB',
      primaryLight: '#60A5FA',
      background: '#F0F9FF',
      surface: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      card: '#FFFFFF',
      hover: '#E0F2FE'
    },
    dark: {
      primary: '#60A5FA',
      primaryDark: '#3B82F6',
      primaryLight: '#93C5FD',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      border: '#334155',
      card: '#1E293B',
      hover: '#1E3A8A'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

