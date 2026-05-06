import { useState, useEffect, useRef } from 'react';

export function useTypewriter(text: string, speed = 12) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); idx.current = 0; return; }
    setDisplayed('');
    setDone(false);
    idx.current = 0;

    interval.current = setInterval(() => {
      idx.current += 3; // chars per tick — increase for faster typing
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval.current);
      }
    }, speed);

    return () => clearInterval(interval.current);
  }, [text, speed]);

  // Skip to end immediately
  const skip = () => {
    clearInterval(interval.current);
    setDisplayed(text);
    setDone(true);
  };

  return { displayed, done, skip };
}
