import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates a modal backdrop and content container on mount using GSAP.
 */
export function useGsapModal(
  backdropRef: React.RefObject<HTMLElement | null>,
  panelRef: React.RefObject<HTMLElement | null>,
  direction: 'up' | 'right' | 'scale' = 'up'
) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: 'power2.out' }
        );
      }

      if (panelRef.current) {
        const fromVars: gsap.TweenVars =
          direction === 'up'
            ? { y: 36, opacity: 0, scale: 0.98 }
            : direction === 'right'
            ? { x: 48, opacity: 0 }
            : { scale: 0.92, opacity: 0, y: 12 };

        gsap.fromTo(panelRef.current, fromVars, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.32,
          ease: direction === 'scale' ? 'back.out(1.35)' : 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, [backdropRef, panelRef, direction]);
}

/**
 * Stagger-animates child elements matching `selector` inside `containerRef`
 * whenever `deps` change, and attaches smooth scroll reveal animations.
 */
export function useGsapStagger(
  containerRef: React.RefObject<HTMLElement | null>,
  selector: string = '.gsap-stagger-item',
  deps: React.DependencyList = []
) {
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(selector);
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 16, opacity: 0, scale: 0.99 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.032,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Smoothly tweens a numeric value using GSAP.
 */
export function useGsapNumber(targetValue: number, duration: number = 0.45): number {
  const valRef = useRef({ value: targetValue });
  const displayRef = useRef(targetValue);

  useEffect(() => {
    gsap.to(valRef.current, {
      value: targetValue,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        displayRef.current = valRef.current.value;
      },
    });
  }, [targetValue, duration]);

  return displayRef.current;
}

/**
 * Tactile GSAP micro-interaction for button presses.
 */
export function animateButtonPress(element: HTMLElement | null) {
  if (!element) return;
  gsap.fromTo(
    element,
    { scale: 0.95 },
    { scale: 1, duration: 0.25, ease: 'back.out(2)' }
  );
}
