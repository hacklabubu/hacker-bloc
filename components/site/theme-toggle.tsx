"use client";

import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function getTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerTheme() {
  return "dark" as const;
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  return () => observer.disconnect();
}

function toggleTheme() {
  const theme = getTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The switch still works when browser storage is unavailable.
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const targetTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.isComposing ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.key !== "d" && event.key !== "D")
      ) {
        return;
      }

      const isEditing = event.composedPath().some(
        (element) =>
          element instanceof HTMLElement &&
          (element.isContentEditable || element.matches("input, textarea, select")),
      );

      if (isEditing) return;

      event.preventDefault();
      toggleTheme();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <button
      type="button"
      className="terminal-theme-toggle"
      onClick={toggleTheme}
      aria-label={`[d] ${targetTheme === "light" ? "Light" : "Dark"}: switch to the ${targetTheme} theme`}
      aria-keyshortcuts="D"
      title="Switch theme (D)"
    >
      [d] {targetTheme === "light" ? "Light" : "Dark"}
    </button>
  );
}
