import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Asset, TradeDirection } from '../types/trading';
import { Clock, ArrowUpDown, Plus, Minus } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { animateButtonPress } from '../utils/gsapAnimations';

interface TradeDockProps {
  asset: Asset;
  onInitiateTrade: (direction: TradeDirection, amount: number, durationSeconds: number) => void;
  userBalance: number;
  durationSeconds: number;
  setDurationSeconds: (duration: number) => void;
}

export const TradeDock: React.FC<TradeDockProps> = ({
  asset,
  onInitiateTrade,
  userBalance,
  durationSeconds,
  setDurationSeconds,
}) => {
  const [amount, setAmount] = useState<number>(1);
  const [pendingTrade, setPendingTrade] = useState(false);
  const [showExpirationPicker, setShowExpirationPicker] = useState(false);
  const [showAmountQuickPicker, setShowAmountQuickPicker] = useState(false);

  const dockRef = useRef<HTMLDivElement>(null);
  const lowerBtnRef = useRef<HTMLButtonElement>(null);
  const higherBtnRef = useRef<HTMLButtonElement>(null);
  const profitTextRef = useRef<HTMLDivElement>(null);
  const quickPickerRef = useRef<HTMLDivElement>(null);
  const expPickerRef = useRef<HTMLDivElement>(null);

  // Profit calculation
  const profitAmount = amount * (asset.payoutPercent / 100);

  // GSAP entrance animation for dock
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (dockRef.current) {
        gsap.fromTo(
          dockRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.42, ease: 'power3.out' }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  // Animate profit text when amount or asset payout changes
  useEffect(() => {
    if (profitTextRef.current) {
      gsap.fromTo(
        profitTextRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 0.25, ease: 'back.out(2)' }
      );
    }
  }, [profitAmount]);

  // Animate quick amount picker popup with GSAP
  useEffect(() => {
    if (showAmountQuickPicker && quickPickerRef.current) {
      gsap.fromTo(
        quickPickerRef.current,
        { y: 10, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(1.5)' }
      );
    }
  }, [showAmountQuickPicker]);

  // Animate expiration picker popup with GSAP
  useEffect(() => {
    if (showExpirationPicker && expPickerRef.current) {
      gsap.fromTo(
        expPickerRef.current,
        { y: 10, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.22, ease: 'back.out(1.5)' }
      );
    }
  }, [showExpirationPicker]);

  const handleButtonClick = (direction: TradeDirection, btnEl: HTMLButtonElement | null) => {
    if (amount <= 0) return;
    playClickSound();
    if (btnEl) {
      gsap.fromTo(
        btnEl,
        { scale: 0.94 },
        { scale: 1, duration: 0.32, ease: 'elastic.out(1.2, 0.5)' }
      );
    }
    onInitiateTrade(direction, amount, durationSeconds);
  };

  const expirationOptions = [
    { label: '5s', value: 5 },
    { label: '15s', value: 15 },
    { label: '30s', value: 30 },
    { label: '1m', value: 60 },
    { label: '2m', value: 120 },
    { label: '5m', value: 300 },
  ];

  // Format current expiration clock
  const now = new Date();
  const expireDate = new Date(now.getTime() + durationSeconds * 1000);
  const formattedTime = `${expireDate.getHours().toString().padStart(2, '0')}:${expireDate.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div
      ref={dockRef}
      className="bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3.5 pt-2 pb-3.5 shadow-xs select-none relative z-20 shrink-0"
    >
      {/* Row 1: Investment & Expiration Inputs */}
      <div className="grid grid-cols-2 gap-2.5 mb-2">
        {/* Investments Input Box */}
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1 px-0.5">
            <span>Investments</span>
            <button
              onClick={(e) => {
                playClickSound();
                animateButtonPress(e.currentTarget);
                setShowAmountQuickPicker(!showAmountQuickPicker);
                setShowExpirationPicker(false);
              }}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-0.5 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <ArrowUpDown className="w-3 h-3 text-[#6366f1]" />
              <span>$</span>
            </button>
          </div>

          <div className="relative flex items-center bg-[#f1f5f9] rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <button
              onClick={(e) => {
                playClickSound();
                animateButtonPress(e.currentTarget);
                setAmount((prev) => Math.max(1, prev - 1));
              }}
              className="w-8 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="number"
              min="1"
              max={Math.max(1, Math.floor(userBalance))}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
              className="w-full bg-transparent text-center font-extrabold text-base text-slate-800 focus:outline-hidden py-2 font-mono-numbers"
            />

            <span className="text-slate-400 font-bold text-sm pr-1">$</span>

            <button
              onClick={(e) => {
                playClickSound();
                animateButtonPress(e.currentTarget);
                setAmount((prev) => prev + 1);
              }}
              className="w-8 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800 active:bg-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Amount Chooser popup */}
          {showAmountQuickPicker && (
            <div
              ref={quickPickerRef}
              className="absolute bottom-full left-0 mb-1.5 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-2 z-30 grid grid-cols-4 gap-1 text-center font-mono-numbers text-xs font-bold text-slate-700"
            >
              {[1, 5, 10, 25, 50, 100, 250, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    playClickSound();
                    setAmount(val);
                    setShowAmountQuickPicker(false);
                  }}
                  className={`py-1.5 rounded-lg border transition-all cursor-pointer ${
                    amount === val
                      ? 'bg-[#6366f1] text-white border-[#6366f1]'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expiration Input Box */}
        <div className="relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1 px-0.5">
            <span>Expiration</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                Pending
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  setPendingTrade(!pendingTrade);
                }}
                className={`w-6 h-3.5 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                  pendingTrade ? 'bg-[#6366f1]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                    pendingTrade ? 'translate-x-2.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowExpirationPicker(!showExpirationPicker);
              setShowAmountQuickPicker(false);
            }}
            className="w-full flex items-center justify-between bg-[#f1f5f9] rounded-xl border border-slate-200 px-3 py-2 text-slate-800 font-bold text-base font-mono-numbers hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>{durationSeconds < 60 ? `00:${durationSeconds.toString().padStart(2, '0')}` : formattedTime}</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </button>

          {/* Expiration Picker Dropdown */}
          {showExpirationPicker && (
            <div
              ref={expPickerRef}
              className="absolute bottom-full right-0 mb-1.5 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-2 z-30 flex flex-col gap-1 text-xs font-semibold"
            >
              <div className="text-[10px] text-slate-400 px-1 py-0.5 font-bold uppercase">
                Trade Expiry
              </div>
              <div className="grid grid-cols-2 gap-1">
                {expirationOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      playClickSound();
                      setDurationSeconds(opt.value);
                      setShowExpirationPicker(false);
                    }}
                    className={`flex items-center justify-between px-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      durationSeconds === opt.value
                        ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200/70'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="font-mono-numbers text-[10px] text-slate-400">
                      +{opt.value}s
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Profit Line */}
      <div className="flex items-center justify-between text-xs font-semibold px-1 mb-2.5">
        <div className="text-emerald-600 font-bold">
          Profit: <span className="font-mono-numbers">+{asset.payoutPercent}%</span>
        </div>
        <div ref={profitTextRef} className="text-emerald-600 font-mono-numbers font-bold text-sm">
          +${profitAmount.toFixed(2)}
        </div>
      </div>

      {/* Row 3: Action Buttons (LOWER & HIGHER - Authentic TradoWix Buttons) */}
      <div className="grid grid-cols-2 gap-3">
        {/* LOWER (Red) */}
        <button
          ref={lowerBtnRef}
          onClick={() => handleButtonClick('LOWER', lowerBtnRef.current)}
          className="group relative flex items-center justify-between bg-linear-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white px-4 py-3 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-red-500/25 transition-colors cursor-pointer overflow-hidden border border-red-400/30"
        >
          <div className="flex flex-col text-left">
            <span className="tracking-wider text-sm font-black drop-shadow-xs">LOWER</span>
            <span className="text-[10px] font-mono-numbers font-bold text-red-100 opacity-90">
              ${amount.toFixed(0)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg font-black leading-none">↘</span>
          </div>
        </button>

        {/* HIGHER (Green) */}
        <button
          ref={higherBtnRef}
          onClick={() => handleButtonClick('HIGHER', higherBtnRef.current)}
          className="group relative flex items-center justify-between bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white px-4 py-3 rounded-2xl font-black text-sm tracking-wide shadow-lg shadow-emerald-500/25 transition-colors cursor-pointer overflow-hidden border border-emerald-400/30"
        >
          <div className="flex flex-col text-left">
            <span className="tracking-wider text-sm font-black drop-shadow-xs">HIGHER</span>
            <span className="text-[10px] font-mono-numbers font-bold text-emerald-100 opacity-90">
              +${profitAmount.toFixed(2)}
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-lg font-black leading-none">↗</span>
          </div>
        </button>
      </div>
    </div>
  );
};
