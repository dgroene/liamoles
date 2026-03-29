import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LiamoleBalance from './components/LiamoleBalance';
import PrizeCard from './components/PrizeCard';
import ConfirmModal from './components/ConfirmModal';
import PurchaseAnimation from './components/PurchaseAnimation';
import AdminPanel from './components/AdminPanel';
import prizes from './data/prizes';
import { fetchBalance, addLiamoles, subtractLiamoles } from './api/liamoles';
import './App.css';

export default function App() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(null);   // prize being confirmed
  const [celebrating, setCelebrating] = useState(null); // prize being animated

  const loadBalance = useCallback(async () => {
    try {
      const amount = await fetchBalance();
      setBalance(amount);
      setError(null);
    } catch {
      setError('Could not reach the server. Is the API URL set?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBalance(); }, [loadBalance]);

  function handleBuy(prize) {
    setConfirming(prize);
  }

  async function handleConfirm() {
    const prize = confirming;
    setConfirming(null);
    setCelebrating(prize);
    try {
      const newBalance = await subtractLiamoles(prize.cost);
      setBalance(newBalance);
    } catch (err) {
      if (err.message === 'insufficient') {
        setError('Not enough liamoles!');
      } else {
        setError('Something went wrong. Try again.');
      }
      setCelebrating(null);
    }
  }

  async function handleAdd(amount) {
    const newBalance = await addLiamoles(amount);
    setBalance(newBalance);
  }

  async function handleSubtract(amount) {
    const newBalance = await subtractLiamoles(amount);
    setBalance(newBalance);
  }

  // Sort: affordable first, then by cost descending
  const sorted = [...prizes].sort((a, b) => {
    const aAfford = balance >= a.cost ? 1 : 0;
    const bAfford = balance >= b.cost ? 1 : 0;
    if (aAfford !== bAfford) return bAfford - aAfford;
    return b.cost - a.cost;
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🪙 LIAMOLES</h1>
        <p className="app-subtitle">Earn 'em. Spend 'em. Live the dream.</p>
        <LiamoleBalance balance={balance} loading={loading} />
        {error && <div className="app-error">{error}</div>}
      </header>

      <main className="prize-grid">
        {sorted.map((prize) => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            balance={balance}
            onBuy={handleBuy}
          />
        ))}
      </main>

      <AnimatePresence>
        {confirming && (
          <ConfirmModal
            prize={confirming}
            balance={balance}
            onConfirm={handleConfirm}
            onCancel={() => setConfirming(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {celebrating && (
          <PurchaseAnimation
            prize={celebrating}
            onDone={() => setCelebrating(null)}
          />
        )}
      </AnimatePresence>

      <AdminPanel onAdd={handleAdd} onSubtract={handleSubtract} />
    </div>
  );
}
