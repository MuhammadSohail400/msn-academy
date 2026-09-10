import { useState, useEffect } from 'react';

// LocalStorage sync utility — used for guest cart persistence, remembered filters, etc.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage unavailable (private browsing, quota exceeded) — fail silently
    }
  }, [key, value]);

  return [value, setValue];
}
