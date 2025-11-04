'use client';

import React from "react";
import { ThemeContext } from "./theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="p-2 rounded-md">
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}