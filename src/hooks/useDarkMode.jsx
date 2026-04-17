import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('shophub-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('shophub-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('shophub-theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle };
};

export default useDarkMode;