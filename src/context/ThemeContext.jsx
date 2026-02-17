import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themeColors = {
    cosmic: {
        primary: 'bg-purple-600',
        secondary: 'bg-black-600',
        accent: 'bg-gold-500',
        gradient: 'bg-gradient-to-br from-purple-600 to-blue-600',
        text: 'text-purple-600',
        border: 'border-purple-500',
        hover: 'hover:bg-purple-700'
  },
  garden: {
    primary: 'bg-green-500',
    secondary: 'bg-lime-500',
    accent: 'bg-yellow-400',
    gradient: 'bg-gradient-to-br from-green-500 to-lime-500',
    text: 'text-green-600',
    border: 'border-green-500',
    hover: 'hover:bg-green-600'
  },
  neon: {
    primary: 'bg-pink-500',
    secondary: 'bg-purple-600',
    accent: 'bg-cyan-400',
    gradient: 'bg-gradient-to-br from-pink-500 to-purple-600',
    text: 'text-pink-600',
    border: 'border-pink-500',
    hover: 'hover:bg-pink-600'
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

  const value = {
    theme: currentTheme,
    changeTheme,
    colors: themeColors[currentTheme],
    agentName: agentNames[currentTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};