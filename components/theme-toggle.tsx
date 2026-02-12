"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg z-50 rounded-full"
    >
      <Moon className="w-6 h-6 dark:hidden" />
      <Sun className="w-6 h-6 hidden dark:block" />
    </button>
  );
}
