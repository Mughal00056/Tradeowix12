/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTradingEngine } from './hooks/useTradingEngine';
import { LoadingScreen } from './components/LoadingScreen';
import { Header } from './components/Header';
import { TradingChart } from './components/TradingChart';
import { TradeDock } from './components/TradeDock';
import { BottomNav } from './components/BottomNav';
import { AssetSelectorModal } from './components/AssetSelectorModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MoreMenuModal } from './components/MoreMenuModal';
import { DepositModal } from './components/DepositModal';
import { TradesDrawer } from './components/TradesDrawer';
import { SignalsModal } from './components/SignalsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { StatsModal } from './components/StatsModal';
import { WithdrawModal } from './components/WithdrawModal';
import { KycModal } from './components/KycModal';
import { BonusModal } from './components/BonusModal';
import { TradeResultModal } from './components/TradeResultModal';
import { AssetInfoModal } from './components/AssetInfoModal';
import { AccountModal } from './components/AccountModal';
import { PlatformFeatureModal, FeatureViewType } from './components/PlatformFeatureModal';
import { TradeDirection, TradeOrder } from './types/trading';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trade' | 'trades' | 'signals' | 'deposit' | 'more'>('trade');
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Modals state
  const [showAssetSelector, setShowAssetSelector] = useState(false);
  const [showAssetInfo, setShowAssetInfo] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTradesDrawer, setShowTradesDrawer] = useState(false);
  const [showSignals, setShowSignals] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [featureView, setFeatureView] = useState<FeatureViewType | null>(null);
  const [inspectedTrade, setInspectedTrade] = useState<TradeOrder | null>(null);

  const shellRef = useRef<HTMLDivElement>(null);

  const {
    assets,
    currentAsset,
    currentAssetId,
    setCurrentAssetId,
    currentPrice,
    candles,
    pricesMap,
    timeframeSeconds,
    setTimeframeSeconds,
    durationSeconds,
    setDurationSeconds,
    countdownSeconds,
    user,
    openTrades,
    closedTrades,
    lastFinishedTrade,
    setLastFinishedTrade,
    placeTrade,
    toggleFavorite,
    switchAccountType,
    resetDemoBalance,
    handleDepositSuccess,
    verifyUser,
    signals,
  } = useTradingEngine();

  // Hard safety timeout: guaranteed to never stay stuck on loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // GSAP smooth layout transition when toggling Mobile Frame vs Full Screen
  useEffect(() => {
    if (shellRef.current) {
      gsap.fromTo(
        shellRef.current,
        { opacity: 0.92, scale: 0.99 },
        { opacity: 1, scale: 1, duration: 0.28, ease: 'power2.out' }
      );
    }
  }, [isFullWidth]);

  // Handle trade button click from dock: Instant 1-click execution!
  const handleInitiateTrade = (direction: TradeDirection, amount: number, durationSec: number) => {
    placeTrade(direction, amount, durationSec);
  };

  // Handle bottom navigation tabs
  const handleSelectBottomTab = (tab: 'trade' | 'trades' | 'signals' | 'deposit' | 'more') => {
    setActiveTab(tab);
    if (tab === 'trade') {
      setShowTradesDrawer(false);
      setShowSignals(false);
      setShowDeposit(false);
      setShowMoreMenu(false);
      setFeatureView(null);
    } else if (tab === 'trades') {
      setShowTradesDrawer(true);
    } else if (tab === 'signals') {
      setShowSignals(true);
    } else if (tab === 'deposit') {
      setShowDeposit(true);
    } else if (tab === 'more') {
      setShowMoreMenu(true);
    }
  };

  // Handle navigation from Profile and More menu
  const handleNavigateFromMenu = (view: string) => {
    setShowMoreMenu(false);
    setShowProfile(false);
    setActiveTab('trade');
    switch (view) {
      case 'deposit':
      case 'finance':
        setShowDeposit(true);
        break;
      case 'withdraw':
        setShowWithdraw(true);
        break;
      case 'trades':
      case 'transactions':
        setShowTradesDrawer(true);
        break;
      case 'signals':
        setShowSignals(true);
        break;
      case 'stats':
        setShowStats(true);
        break;
      case 'leaderboard':
        setShowLeaderboard(true);
        break;
      case 'bonus':
      case 'rewards':
        setShowBonus(true);
        break;
      case 'kyc':
      case 'verification':
        setShowKyc(true);
        break;
      case 'profile':
        setShowProfile(true);
        break;
      case 'account':
        setShowAccountModal(true);
        break;
      case 'alerts':
      case 'pending':
      case 'telegram':
      case 'help':
      case 'report':
      case 'settings':
        setFeatureView(view as FeatureViewType);
        break;
      default:
        break;
    }
  };

  // Calculate user total profit for leaderboard
  const userProfit =
    closedTrades.filter((t) => t.status === 'WON').reduce((acc, t) => acc + t.profit, 0) -
    closedTrades.filter((t) => t.status === 'LOST').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="flex justify-center bg-slate-900 min-h-screen text-slate-800">
      {/* Loading Screen on Initial Load */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Main Responsive Device Container (Supports both authentic TradoWix Mobile Frame & Full-Screen Desktop Terminal) */}
      <div
        ref={shellRef}
        className={`w-full ${
          isFullWidth ? 'max-w-full' : 'max-w-md'
        } mx-auto bg-white min-h-screen flex flex-col shadow-2xl relative overflow-hidden transition-all duration-300`}
      >
        {/* Top Header */}
        <Header
          currentAsset={currentAsset}
          user={user}
          openTrades={openTrades}
          currentPrice={currentPrice}
          onOpenAssetSelector={() => setShowAssetSelector(true)}
          onOpenAssetInfo={() => setShowAssetInfo(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenAccountModal={() => setShowAccountModal(true)}
          onSwitchAccountType={switchAccountType}
          onResetDemoBalance={resetDemoBalance}
          isFullWidth={isFullWidth}
          onToggleFullWidth={() => setIsFullWidth(!isFullWidth)}
        />

        {/* Main Chart Canvas */}
        <main className="flex-1 relative flex flex-col overflow-hidden bg-white min-h-[360px]">
          <TradingChart
            asset={currentAsset}
            candles={candles}
            currentPrice={currentPrice}
            openTrades={openTrades.filter((t) => t.assetId === currentAsset.id)}
            closedTrades={closedTrades.filter((t) => t.assetId === currentAsset.id)}
            inspectedTrade={inspectedTrade}
            onSelectTrade={setInspectedTrade}
            timeframeSeconds={timeframeSeconds}
            setTimeframeSeconds={setTimeframeSeconds}
            countdownSeconds={countdownSeconds}
            onOpenAssetInfo={() => setShowAssetInfo(true)}
          />
        </main>

        {/* Bottom Trade Execution Dock */}
        <TradeDock
          asset={currentAsset}
          onInitiateTrade={handleInitiateTrade}
          userBalance={user.accountType === 'DEMO' ? user.demoBalance : user.realBalance}
          durationSeconds={durationSeconds}
          setDurationSeconds={setDurationSeconds}
        />

        {/* Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectBottomTab}
          openTradesCount={openTrades.length}
        />

        {/* MODAL: Asset Selector Modal */}
        {showAssetSelector && (
          <AssetSelectorModal
            assets={assets}
            currentAssetId={currentAssetId}
            onSelectAsset={(asset) => {
              setCurrentAssetId(asset.id);
              setShowAssetSelector(false);
            }}
            onClose={() => setShowAssetSelector(false)}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* MODAL: User Profile Popover / Drawer */}
        {showProfile && (
          <UserProfileModal
            user={user}
            onClose={() => setShowProfile(false)}
            onNavigate={handleNavigateFromMenu}
          />
        )}

        {/* MODAL: More Menu Drawer */}
        {showMoreMenu && (
          <MoreMenuModal
            onClose={() => {
              setShowMoreMenu(false);
              setActiveTab('trade');
            }}
            onNavigate={handleNavigateFromMenu}
          />
        )}

        {/* MODAL: Deposit / Top Up Page */}
        {showDeposit && (
          <DepositModal
            onClose={() => {
              setShowDeposit(false);
              setActiveTab('trade');
            }}
            onTradeNow={() => {
              setShowDeposit(false);
              setActiveTab('trade');
            }}
            onDepositSuccess={handleDepositSuccess}
          />
        )}

        {/* MODAL: Portfolio / Trades Drawer */}
        {showTradesDrawer && (
          <TradesDrawer
            openTrades={openTrades}
            closedTrades={closedTrades}
            assets={assets}
            currentPrices={pricesMap}
            onSelectTrade={(trade) => {
              if (trade.assetId !== currentAssetId) {
                setCurrentAssetId(trade.assetId);
              }
              setInspectedTrade(trade);
              setShowTradesDrawer(false);
              setActiveTab('trade');
            }}
            onClose={() => {
              setShowTradesDrawer(false);
              setActiveTab('trade');
            }}
          />
        )}

        {/* MODAL: Account Switcher & Overview */}
        <AccountModal
          user={user}
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onSwitchAccountType={switchAccountType}
          onResetDemoBalance={resetDemoBalance}
          onNavigate={handleNavigateFromMenu}
        />

        {/* MODAL: Live Trading Signals */}
        {showSignals && (
          <SignalsModal
            signals={signals}
            assets={assets}
            onSelectSignal={(assetId, direction) => {
              setCurrentAssetId(assetId);
              placeTrade(direction, 10, 60);
              setActiveTab('trade');
            }}
            onClose={() => {
              setShowSignals(false);
              setActiveTab('trade');
            }}
          />
        )}

        {/* MODAL: Weekly Leaderboard */}
        {showLeaderboard && (
          <LeaderboardModal
            userName={user.name}
            userTradesCount={closedTrades.length + openTrades.length}
            userProfit={userProfit}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        {/* MODAL: Trading Stats */}
        {showStats && (
          <StatsModal
            trades={closedTrades}
            demoBalance={user.demoBalance}
            realBalance={user.realBalance}
            onClose={() => setShowStats(false)}
          />
        )}

        {/* MODAL: Withdrawals */}
        {showWithdraw && (
          <WithdrawModal
            realBalance={user.realBalance}
            demoBalance={user.demoBalance}
            onClose={() => setShowWithdraw(false)}
          />
        )}

        {/* MODAL: KYC Verification */}
        {showKyc && (
          <KycModal
            isVerified={user.isVerified}
            onVerify={verifyUser}
            onClose={() => setShowKyc(false)}
          />
        )}

        {/* MODAL: First Deposit Bonus +70% */}
        {showBonus && (
          <BonusModal
            onClose={() => setShowBonus(false)}
            onOpenDeposit={() => setShowDeposit(true)}
          />
        )}

        {/* MODAL: Trade Result Settlement Card */}
        {lastFinishedTrade && (
          <TradeResultModal
            trade={lastFinishedTrade}
            onClose={() => setLastFinishedTrade(null)}
          />
        )}

        {/* MODAL: Full Screen Asset Information & Trading Conditions */}
        {showAssetInfo && (
          <AssetInfoModal
            asset={currentAsset}
            currentPrice={currentPrice}
            onClose={() => setShowAssetInfo(false)}
          />
        )}

        {/* MODAL: Additional Platform Features (Alerts, Pending, Telegram, Help, Report, Settings) */}
        {featureView && (
          <PlatformFeatureModal
            view={featureView}
            currentAsset={currentAsset}
            currentPrice={currentPrice}
            isFullWidth={isFullWidth}
            onToggleFullWidth={() => setIsFullWidth(!isFullWidth)}
            onClose={() => setFeatureView(null)}
          />
        )}
      </div>
    </div>
  );
}
