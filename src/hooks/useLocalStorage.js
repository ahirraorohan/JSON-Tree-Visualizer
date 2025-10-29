import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initialValue;
    } catch (e) {
      return initialValue;
    }
  });

  const setLocal = (val) => {
    try {
      setState(val);
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  };

  return [state, setLocal];
}
