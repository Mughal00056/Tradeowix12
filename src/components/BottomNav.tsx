import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { BarChart2, History, Wallet, Menu } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export type BottomNavTab = 'trade' | 'history' | 'deposit' | 'more';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onSelectTab: (tab: BottomNavTab) => void;
  openTradesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  openTradesCount,
}) => {
  const badgeRef = useRef<HTMLSpanElement>(null);

  // Bounce badge on trade count change using GSAP
  useEffect(() => {
    if (openTradesCount > 0 && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    }
  }, [openTradesCount]);

  return (
    <nav className="h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around px-2 select-none shrink-0 z-30">
      {/* 1. Trade (Active) */}
      <button
        onClick={() => {
          playClickSound();
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
        <span className="text-[10px] tracking-tight">Trade</span>
      </button>

      {/* 2. Trade History (replaces trading signals / portfolio with dedicated trade history) */}
      <button
        onClick={() => {
          playClickSound();
          onSelectTab('history');
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors cursor-pointer ${
          activeTab === 'history' ? 'text-[#6366f1] font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        {activeTab === 'history' && (
          <span className="absolute top-0 inset-x-5 h-1 bg-[#6366f1] rounded-b-full shadow-xs" />
        )}
        <div className="relative">
          <History className="w-5 h-5 mb-0.5" />
          {openTradesCount > 0 && (
            <span
              ref={badgeRef}
              className="absolute -top-1 -right-2.5 w-4 h-4 bg-[#6366f1] text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono-numbers shadow-xs"
            >
              {openTradesCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight">Trade History</span>
      </button>

      {/* 3. Top Up / Deposit */}
      <button
        onClick={() => {
          playClickSound();
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
        <span className="text-[10px] tracking-tight">Top Up</span>
      </button>

      {/* 4. More */}
      <button
        onClick={() => {
          playClickSound();
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
        <span className="text-[10px] tracking-tight">More</span>
      </button>
    </nav>
  );
};
