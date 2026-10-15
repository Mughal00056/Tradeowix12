import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BarChart2, Radio, Wallet, Menu } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { animateButtonPress } from '../utils/gsapAnimations';

interface BottomNavProps {
  activeTab: 'trade' | 'trades' | 'signals' | 'deposit' | 'more';
  onSelectTab: (tab: 'trade' | 'trades' | 'signals' | 'deposit' | 'more') => void;
  openTradesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  openTradesCount,
}) => {
  const navRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (navRef.current) {
        gsap.fromTo(
          navRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (openTradesCount > 0 && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.4 },
        { scale: 1, duration: 0.35, ease: 'elastic.out(1.2, 0.4)' }
      );
    }
  }, [openTradesCount]);

  return (
    <nav
      ref={navRef}
      className="h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around px-2 select-none shrink-0 z-30"
    >
      {/* 1. Trade (Active) */}
      <button
        onClick={(e) => {
          playClickSound();
          animateButtonPress(e.currentTarget);
          onSelectTab('trade');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors cursor-pointer ${
          activeTab === 'trade' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'trade' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <BarChart2 className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">Trade</span>
      </button>

      {/* 2. Portfolio / Orders with purple badge */}
      <button
        onClick={(e) => {
          playClickSound();
          animateButtonPress(e.currentTarget);
          onSelectTab('trades');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors cursor-pointer ${
          activeTab === 'trades' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'trades' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <div className="relative">
          <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {openTradesCount > 0 && (
            <span
              ref={badgeRef}
              className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#6366f1] text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono-numbers shadow-xs"
            >
              {openTradesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight whitespace-nowrap">Portfolio</span>
      </button>

      {/* 3. Signals */}
      <button
        onClick={(e) => {
          playClickSound();
          animateButtonPress(e.currentTarget);
          onSelectTab('signals');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors cursor-pointer ${
          activeTab === 'signals' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'signals' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <div className="relative">
          <Radio className="w-5 h-5 mb-0.5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
        </div>
        <span className="text-[10px] tracking-tight whitespace-nowrap">Signals</span>
      </button>

      {/* 4. Top Up / Deposit */}
      <button
        onClick={(e) => {
          playClickSound();
          animateButtonPress(e.currentTarget);
          onSelectTab('deposit');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors cursor-pointer ${
          activeTab === 'deposit' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'deposit' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <Wallet className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">Top Up</span>
      </button>

      {/* 5. More */}
      <button
        onClick={(e) => {
          playClickSound();
          animateButtonPress(e.currentTarget);
          onSelectTab('more');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors cursor-pointer ${
          activeTab === 'more' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'more' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] tracking-tight whitespace-nowrap">More</span>
      </button>
    </nav>
  );
};
