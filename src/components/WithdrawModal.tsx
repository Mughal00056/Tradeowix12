import React, { useState, useRef } from 'react';
import { X, ArrowDownLeft, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { useGsapModal } from '../utils/gsapAnimations';

interface WithdrawModalProps {
  realBalance: number;
  demoBalance: number;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  realBalance,
  demoBalance,
  onClose,
}) => {
  const [method, setMethod] = useState<'usdt' | 'bank'>('usdt');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('50');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGsapModal(backdropRef, panelRef, 'up');

  const handleWithdraw = () => {
    playClickSound();
    const num = Number(amount);
    if (!num || num <= 0) {
      setStatus({ type: 'error', message: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (num > realBalance) {
      setStatus({
        type: 'error',
        message: `Withdrawal exceeds real balance ($${realBalance.toFixed(2)}). Note: Demo funds ($${demoBalance.toFixed(2)}) are for training simulation.`,
      });
      return;
    }
    if (!address.trim()) {
      setStatus({ type: 'error', message: 'Please enter your receiving address or account number.' });
      return;
    }
    setStatus({ type: 'info', message: 'Processing withdrawal request via automated gateway...' });
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: 'Withdrawal submitted! Transaction ID: #TX-' + Math.floor(100000 + Math.random() * 900000),
      });
    }, 1000);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl select-none overflow-hidden"
    >
      {/* Full Screen Glass Container */}
      <div
        ref={panelRef}
        className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-slate-900">Withdrawals</span>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full space-y-4 overflow-y-auto">
          {/* Real balance card */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl">
            <span className="text-[11px] text-slate-400 font-medium">Available Real Balance</span>
            <div className="text-2xl font-black font-mono-numbers mt-1">
              ${realBalance.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Instant automated payout with 0% commission</span>
            </div>
          </div>

          {/* Method selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Payout Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  setMethod('usdt');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  method === 'usdt'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                USDT (TRC20 / BEP20)
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setMethod('bank');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  method === 'bank'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Local Bank / Wire
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold font-mono-numbers text-slate-800"
              placeholder="Min $10"
            />
          </div>

          {/* Destination input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              {method === 'usdt' ? 'USDT TRC-20 Wallet Address' : 'Bank Account / IBAN'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#f8fafc] border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono-numbers text-slate-800"
              placeholder={method === 'usdt' ? 'T...' : 'PK... or account number'}
            />
          </div>

          {status && (
            <div
              className={`p-3 rounded-xl text-xs font-medium flex items-start gap-2 border ${
                status.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : status.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              {status.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          <button
            onClick={handleWithdraw}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            Submit Withdrawal Request
          </button>
        </div>
      </div>
    </div>
  );
};
