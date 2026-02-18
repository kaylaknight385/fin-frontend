import { createContext, useState, useEffect } from "react";
import { THEMES } from "../utils/constants";

export const ThemeContext = createContext();

const themeColors = {
    cosmic: {
        primary: 'bg-indigo-900',
        secondary: 'bg-purple-900',
        accent: 'bg-amber-400',
        gradient: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950',
        text: 'text-indigo-600',
        border: 'border-indigo-500',
        hover: 'hover:bg-indigo-800',
        cardBg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950',
        cardText: 'text-white'
  },
  garden: {
    primary: 'bg-green-500',
    secondary: 'bg-lime-500',
    accent: 'bg-yellow-400',
    gradient: 'bg-gradient-to-br from-green-500 to-lime-500',
    text: 'text-green-600',
    border: 'border-green-500',
    hover: 'hover:bg-green-600',
    cardBg: 'bg-pink-300/95',
    cardText: 'text-green-800'
  },
  neon: {
    primary: 'bg-pink-500',
    secondary: 'bg-purple-600',
    accent: 'bg-cyan-400',
    gradient: 'bg-gradient-to-br from-pink-500 to-purple-600',
    text: 'text-pink-600',
    border: 'border-pink-500',
    hover: 'hover:bg-pink-600',
    cardBg: 'bg-pink-100/90',
    cardText: 'text-gray-800'
  }
};

//my ai agennnnnts omg
const agentNames = {
  cosmic: 'Nova',
  garden: 'Bloom',
  neon: 'Pixel'
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('cosmic');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.theme) {
        setCurrentTheme(user.theme);
      }
    }
  }, []);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
  };

  // Get current theme config from THEMES
  const currentThemeConfig = THEMES.find(t => t.id === currentTheme) || THEMES[0];

  const value = {
    theme: currentTheme,
    changeTheme,
    colors: themeColors[currentTheme],
    agentName: agentNames[currentTheme],
    background: currentThemeConfig.background,
    font: currentThemeConfig.font,
    cursor: currentThemeConfig.cursor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};