import { useEffect, useRef, type DependencyList, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAP(
  callback: (ctx: gsap.Context) => void,
  deps: DependencyList = [],
  scope?: RefObject<HTMLElement | null>
) {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(() => {
      callback(ctx.current!);
    }, scope?.current || undefined);

    return () => {
      ctx.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctx;
}

export { gsap, ScrollTrigger };
