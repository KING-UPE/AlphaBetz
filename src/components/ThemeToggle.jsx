import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        p-2 rounded-full transition-all duration-300 transform
        ${isDark
          ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600 hover:scale-110'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-110'}
        shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      `}
    >
      {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );
}
