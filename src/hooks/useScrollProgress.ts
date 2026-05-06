import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? y / docHeight : 0;
      setScrollY(y);
      setProgress(Math.min(1, Math.max(0, p)));
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress, scrollY };
}
