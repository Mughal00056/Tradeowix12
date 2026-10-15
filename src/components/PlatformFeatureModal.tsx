import React, { useState, useRef } from 'react';
import { Asset } from '../types/trading';
import {
  X,
  Bell,
  Clock,
  Send,
  HelpCircle,
  AlertTriangle,
  Settings,
  ChevronLeft,
  Plus,
  Trash2,
  Copy,
  Check,
  Volume2,
  Maximize2,
  Zap,
} from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { useGsapModal, useGsapStagger } from '../utils/gsapAnimations';

export type FeatureViewType = 'alerts' | 'pending' | 'telegram' | 'help' | 'report' | 'settings';

interface PlatformFeatureModalProps {
  view: FeatureViewType;
  currentAsset: Asset;
  currentPrice: number;
  isFullWidth: boolean;
  onToggleFullWidth: () => void;
  onClose: () => void;
}

export const PlatformFeatureModal: React.FC<PlatformFeatureModalProps> = ({
  view,
  currentAsset,
  currentPrice,
  isFullWidth,
  onToggleFullWidth,
  onClose,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGsapModal(backdropRef, panelRef, 'up');
  useGsapStagger(bodyRef, '.gsap-stagger-item', [view]);

  // Price Alerts state
  const [alerts, setAlerts] = useState([
    {
      id: 'al-1',
      symbol: currentAsset.symbol,
      targetPrice: Number((currentPrice * 1.001).toFixed(currentAsset.decimals)),
      condition: 'Above',
    },
    {
      id: 'al-2',
      symbol: 'BTC/USD (OTC)',
      targetPrice: 68500.0,
      condition: 'Above',
    },
  ]);
  const [newAlertPrice, setNewAlertPrice] = useState(
    (currentPrice * 1.0005).toFixed(currentAsset.decimals)
  );

  // Telegram copy state
  const [copiedLink, setCopiedLink] = useState(false);

  // Issue report state
  const [issueTopic, setIssueTopic] = useState('Execution / Chart Feed');
  const [issueMessage, setIssueMessage] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);

  // Settings toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [oneClickTrade, setOneClickTrade] = useState(true);

  const metaMap: Record<
    FeatureViewType,
    { title: string; subtitle: string; icon: React.ElementType; color: string }
  > = {
    alerts: {
      title: 'Price Alerts',
      subtitle: 'Instant notifications when target levels hit',
      icon: Bell,
      color: 'bg-purple-50 text-purple-600 border-purple-200/60',
    },
    pending: {
      title: 'Pending Orders',
      subtitle: 'Scheduled limit & clock-triggered positions',
      icon: Clock,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200/60',
    },
    telegram: {
      title: 'Official Telegram Channel',
      subtitle: 'VIP signals, market analysis & community',
      icon: Send,
      color: 'bg-sky-50 text-sky-600 border-sky-200/60',
    },
    help: {
      title: 'Help & Knowledge Center',
      subtitle: 'Trading guides, execution rules & FAQs',
      icon: HelpCircle,
      color: 'bg-sky-50 text-sky-600 border-sky-200/60',
    },
    report: {
      title: 'Report an Issue',
      subtitle: 'Direct 24/7 technical support ticket',
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600 border-amber-200/60',
    },
    settings: {
      title: 'Platform Settings',
      subtitle: 'Customize terminal workspace & audio',
      icon: Settings,
      color: 'bg-slate-100 text-slate-700 border-slate-200/60',
    },
  };

  const activeMeta = metaMap[view];
  const IconComp = activeMeta.icon;

  const handleAddAlert = () => {
    playClickSound();
    const num = Number(newAlertPrice);
    if (!num || num <= 0) return;
    setAlerts((prev) => [
      {
        id: `al-${Date.now()}`,
        symbol: currentAsset.symbol,
        targetPrice: num,
        condition: num >= currentPrice ? 'Above' : 'Below',
      },
      ...prev,
    ]);
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-2xl select-none overflow-hidden"
    >
      <div
        ref={panelRef}
        className="w-full h-full flex flex-col bg-white/92 backdrop-blur-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Header */}
        <div className="h-16 px-4 sm:px-8 border-b border-slate-200/70 flex items-center justify-between bg-white/75 backdrop-blur-xl shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="w-10 h-10 rounded-xl bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-xs border border-slate-200/60"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center ${activeMeta.color}`}
              >
                <IconComp className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {activeMeta.title}
                </h1>
                <p className="text-xs text-slate-400 font-medium">{activeMeta.subtitle}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-3xl mx-auto w-full space-y-4 custom-scrollbar"
        >
          {view === 'alerts' && (
            <>
              <div className="gsap-stagger-item p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    Create Alert for {currentAsset.symbol}
                  </span>
                  <span className="text-xs font-mono-numbers text-slate-400">
                    Current: {currentPrice.toFixed(currentAsset.decimals)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    value={newAlertPrice}
                    onChange={(e) => setNewAlertPrice(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono-numbers font-bold text-slate-800"
                  />
                  <button
                    onClick={handleAddAlert}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Alert</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {alerts.map((al) => (
                  <div
                    key={al.id}
                    className="gsap-stagger-item p-3.5 bg-white/80 rounded-2xl border border-slate-200/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">{al.symbol}</div>
                      <div className="text-xs text-slate-500 font-mono-numbers">
                        Trigger {al.condition}: {al.targetPrice}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        playClickSound();
                        setAlerts((prev) => prev.filter((item) => item.id !== al.id));
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === 'pending' && (
            <div className="gsap-stagger-item p-8 bg-white rounded-2xl border border-slate-200/80 text-center space-y-3">
              <Clock className="w-10 h-10 text-indigo-500 mx-auto" />
              <h3 className="text-sm font-extrabold text-slate-900">No Pending Limit Orders</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Toggle the &ldquo;Pending&rdquo; switch in the bottom Trade Dock before clicking HIGHER or LOWER to schedule automated entry orders at target price levels.
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Go to Trade Dock
              </button>
            </div>
          )}

          {view === 'telegram' && (
            <div className="gsap-stagger-item p-6 bg-white rounded-2xl border border-slate-200/80 space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200/70 text-sky-500 flex items-center justify-center mx-auto">
                <Send className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">TradoWix VIP Signal Community</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Join 48,000+ active traders receiving daily OTC & Forex session signals, payout boosts, and promo codes.
                </p>
              </div>
              <div className="flex items-center gap-2 max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <span className="font-mono-numbers text-xs text-slate-700 flex-1 text-left truncate">
                  https://t.me/tradowix_official
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    navigator.clipboard.writeText('https://t.me/tradowix_official');
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          )}

          {view === 'help' && (
            <div className="space-y-3">
              {[
                {
                  q: 'How are fixed-time trades settled on TradoWix?',
                  a: 'When you open a HIGHER or LOWER contract, the current market quote is locked as your opening strike price. At expiry, if the closing quote matches your direction, the investment plus up to 92% profit is credited immediately.',
                },
                {
                  q: 'How can I refill my Demo Practice balance?',
                  a: 'Click your balance pill in the top header and select "Reset to $10,000" anytime to restore your virtual practice balance.',
                },
                {
                  q: 'What is the difference between OTC and regular Forex pairs?',
                  a: 'Over-The-Counter (OTC) pairs provide continuous 24/7 algorithmic liquidity including weekends, with fixed payouts up to 92%.',
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="gsap-stagger-item p-4 bg-white rounded-2xl border border-slate-200/80 space-y-1.5"
                >
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{faq.q}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          )}

          {view === 'report' && (
            <div className="gsap-stagger-item p-5 bg-white rounded-2xl border border-slate-200/80 space-y-4">
              {issueSubmitted ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900">Support Ticket Logged</h3>
                  <p className="text-xs text-slate-500">
                    Our engineering desk has received your report and attached session diagnostics.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Category</label>
                    <select
                      value={issueTopic}
                      onChange={(e) => setIssueTopic(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      <option>Execution / Chart Feed</option>
                      <option>Deposit / Blockchain Confirmation</option>
                      <option>Withdrawal Request</option>
                      <option>Account Verification (KYC)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={issueMessage}
                      onChange={(e) => setIssueMessage(e.target.value)}
                      placeholder="Describe the issue or trade ID..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800"
                    />
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      setIssueSubmitted(true);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Submit Support Report
                  </button>
                </>
              )}
            </div>
          )}

          {view === 'settings' && (
            <div className="space-y-3">
              <div className="gsap-stagger-item p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      Trading Sound Effects
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Audio cues for trade execution and settlement
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    setSoundEnabled(!soundEnabled);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    soundEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="gsap-stagger-item p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      1-Click Instant Execution
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Open positions immediately without confirmation dialog
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    setOneClickTrade(!oneClickTrade);
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    oneClickTrade ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      oneClickTrade ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="gsap-stagger-item p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900">
                      Full-Screen Desktop Terminal
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Expand container across wide desktop viewports
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    playClickSound();
                    onToggleFullWidth();
                  }}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                    isFullWidth ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isFullWidth ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
