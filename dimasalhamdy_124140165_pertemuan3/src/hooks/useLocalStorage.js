import { useEffect, useState } from 'react';

function readStorage(key, initialValue) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch {
    return initialValue;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStorage(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Gagal menyimpan data ke localStorage:', error);
    }
  }, [key, value]);

  return [value, setValue];
}
