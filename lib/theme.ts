export const THEME_STORAGE_KEY = "hacker-bloc-theme";

// Applied in the document head so saved preferences are ready before first paint.
export const THEME_INIT_SCRIPT = `(function(){var theme="dark";try{var saved=localStorage.getItem("${THEME_STORAGE_KEY}");if(saved==="light"||saved==="dark")theme=saved;}catch{}document.documentElement.setAttribute("data-theme",theme);})();`;
