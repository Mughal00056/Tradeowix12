import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topArrowRef = useRef<SVGPathElement>(null);
  const bottomArrowRef = useRef<SVGPathElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const finishLoading = () => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.03,
        duration: 0.28,
        ease: 'power2.inOut',
        onComplete: () => {
          onComplete();
        },
      });
    } else {
      onComplete();
    }
  };

  useEffect(() => {
    const progressObj = { val: 0 };

    const ctx = gsap.context(() => {
      // Initial states
      if (topArrowRef.current && bottomArrowRef.current) {
        gsap.set([topArrowRef.current, bottomArrowRef.current], {
          strokeDasharray: 260,
          strokeDashoffset: 260,
        });
      }

      if (logoWrapRef.current) {
        gsap.fromTo(
          logoWrapRef.current,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' }
        );
      }

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, delay: 0.15, ease: 'power3.out' }
        );
      }

      // Main GSAP timeline for SVG path drawing + progress counter
      const tl = gsap.timeline({
        onComplete: () => {
          finishLoading();
        },
      });

      tl.to(
        [topArrowRef.current, bottomArrowRef.current],
        {
          strokeDashoffset: 0,
          duration: 0.95,
          ease: 'power2.inOut',
        },
        0
      );

      tl.to(
        progressObj,
        {
          val: 100,
          duration: 0.95,
          ease: 'power2.inOut',
          onUpdate: () => {
            setProgress(Math.round(progressObj.val));
          },
        },
        0
      );

      if (barRef.current) {
        tl.fromTo(
          barRef.current,
          { width: '0%' },
          { width: '100%', duration: 0.95, ease: 'power2.inOut' },
          0
        );
      }
    }, containerRef);

    // Hard fallback safety timeout - guaranteed to never get stuck!
    const safetyTimer = setTimeout(() => {
      finishLoading();
    }, 1250);

    return () => {
      ctx.revert();
      clearTimeout(safetyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={finishLoading}
      onTouchStart={finishLoading}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white cursor-pointer select-none"
    >
      {/* Container for GSAP Drawing Animation */}
      <div ref={logoWrapRef} className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Path Draw of TradoWix dual-arrow loop logo */}
        <svg
          viewBox="0 0 100 100"
          className="w-28 h-28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle faint background path for outline guide */}
          <path
            d="M 38 46 L 56 46 C 68 46 76 52 76 62 C 76 72 68 80 56 80 L 46 80 L 58 66 L 36 66 L 36 78 C 36 82 40 85 46 85 L 58 85 C 72 85 82 75 82 62 C 82 48 71 40 56 40 L 38 40 Z"
            stroke="#e2e8f0"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M 62 54 L 44 54 C 32 54 24 48 24 38 C 24 28 32 20 44 20 L 54 20 L 42 34 L 64 34 L 64 22 C 64 18 60 15 54 15 L 42 15 C 28 15 18 25 18 38 C 18 52 29 60 44 60 L 62 60 Z"
            stroke="#e2e8f0"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Active GSAP drawing stroke top arrow */}
          <path
            ref={topArrowRef}
            d="M 38 46 L 56 46 C 68 46 76 52 76 62 C 76 72 68 80 56 80 L 46 80 L 58 66 L 36 66 L 36 78 C 36 82 40 85 46 85 L 58 85 C 72 85 82 75 82 62 C 82 48 71 40 56 40 L 38 40 Z"
            stroke="#0f172a"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Active GSAP drawing stroke bottom arrow */}
          <path
            ref={bottomArrowRef}
            d="M 62 54 L 44 54 C 32 54 24 48 24 38 C 24 28 32 20 44 20 L 54 20 L 42 34 L 64 34 L 64 22 C 64 18 60 15 54 15 L 42 15 C 28 15 18 25 18 38 C 18 52 29 60 44 60 L 62 60 Z"
            stroke="#0f172a"
            strokeWidth="2.6"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        {/* Subtle static ring */}
        <div className="absolute inset-0 rounded-full border border-slate-200/60 pointer-events-none" />
      </div>

      {/* Brand title */}
      <div
        ref={titleRef}
        className="mt-4 flex items-center gap-1.5 font-extrabold text-lg tracking-tight text-slate-900 font-sans"
      >
        <span>Trado</span>
        <span className="text-indigo-600">Wix</span>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mt-4 w-44 flex flex-col items-center">
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div ref={barRef} className="h-full bg-slate-900 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between w-full text-[11px] font-mono-numbers text-slate-400 font-semibold">
          <span>Loading market...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Subtle skip indicator */}
      <div className="mt-8 text-[11px] text-slate-400 hover:text-slate-600 font-medium transition-colors">
        Tap anywhere to enter
      </div>
    </div>
  );
};
