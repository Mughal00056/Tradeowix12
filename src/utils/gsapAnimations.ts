import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Animates a modal backdrop and content container on mount using GSAP.
 */
export function useGsapModal(isOpen: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Backdrop fade in
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.22, ease: 'power2.out' }
      );

      // Card scale & slide up
      const modalBox = containerRef.current?.querySelector('.modal-content-box');
      if (modalBox) {
        gsap.fromTo(
          modalBox,
          { opacity: 0, scale: 0.94, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: 'back.out(1.4)' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  return containerRef;
}

/**
 * Staggers items entrance on mount using GSAP.
 */
export function useGsapStagger(selector: string, deps: unknown[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll(selector);
    if (!items || items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}

/**
 * Animate button micro-press with GSAP
 */
export function animateButtonPress(element: HTMLElement | null) {
  if (!element) return;
  gsap.timeline()
    .to(element, { scale: 0.94, duration: 0.07, ease: 'power2.in' })
    .to(element, { scale: 1, duration: 0.15, ease: 'elastic.out(1.2, 0.4)' });
}

/**
 * Smoothly tween a numerical value in a text element using GSAP
 */
export function tweenNumber(
  element: HTMLElement | null,
  from: number,
  to: number,
  prefix: string = '$',
  decimals: number = 2
) {
  if (!element) return;
  const obj = { val: from };
  gsap.to(obj, {
    val: to,
    duration: 0.45,
    ease: 'power2.out',
    onUpdate: () => {
      if (element) {
        element.innerText = `${prefix}${obj.val.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
    },
  });
}
