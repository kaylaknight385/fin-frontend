import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const themeColors = {
    cosmic: {
        primary: 'bg-purple-600',
        secondary: 'bg-black-600',
        accent: 'bg-gold-500',
        
    }
}