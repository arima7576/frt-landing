import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useReveal<T extends HTMLElement>(options?: RevealOptions) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(reducedMotion);

  const threshold = options?.threshold ?? 0.12;
  const rootMargin = options?.rootMargin ?? '0px 0px -48px 0px';

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [reducedMotion, threshold, rootMargin]);

  return [ref, isVisible] as const;
}
