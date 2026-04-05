const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export const HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-access": "true",
};

export const MODEL = "claude-opus-4-5";
