import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminPanel.css';

const ADMIN_PIN = '1234'; // Change this before deploying!

export default function AdminPanel({ onAdd, onSubtract }) {
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState(null);

  function handlePinSubmit(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setPinError(false);
      setPin('');
    } else {
      setPinError(true);
      setPin('');
    }
  }

  async function handleAction(action) {
    const n = parseInt(amount, 10);
    if (!n || n <= 0) return;
    setBusy(true);
    try {
      if (action === 'add') {
        await onAdd(n);
        setFlash(`+${n} liamoles added!`);
      } else {
        await onSubtract(n);
        setFlash(`−${n} liamoles removed!`);
      }
      setAmount('');
      setTimeout(() => setFlash(null), 2500);
    } catch (err) {
      setFlash(err.message === 'insufficient' ? 'Not enough liamoles!' : 'Error — try again.');
      setTimeout(() => setFlash(null), 2500);
    } finally {
      setBusy(false);
    }
  }

  function close() {
    setOpen(false);
    setUnlocked(false);
    setPin('');
    setAmount('');
    setFlash(null);
    setPinError(false);
  }

  return (
    <>
      {/* Small gear trigger — bottom-right corner */}
      <button className="admin-trigger" onClick={() => setOpen(true)} title="Admin">
        ⚙️
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="admin-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="admin-box"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="admin-title">⚙️ Admin</h3>

              {!unlocked ? (
                <form onSubmit={handlePinSubmit} className="admin-form">
                  <label className="admin-label">Enter PIN</label>
                  <input
                    type="password"
                    className={`admin-input ${pinError ? 'admin-input-error' : ''}`}
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                    placeholder="••••"
                    autoFocus
                  />
                  {pinError && <div className="admin-error">Wrong PIN</div>}
                  <button type="submit" className="admin-btn">Unlock</button>
                </form>
              ) : (
                <div className="admin-form">
                  <label className="admin-label">Amount</label>
                  <input
                    type="number"
                    className="admin-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 50"
                    min="1"
                    autoFocus
                  />
                  {flash && (
                    <div className={`admin-flash ${flash.startsWith('−') || flash.startsWith('Not') || flash.startsWith('Error') ? 'admin-flash-red' : ''}`}>
                      {flash}
                    </div>
                  )}
                  <div className="admin-btn-row">
                    <button
                      className="admin-btn admin-btn-add"
                      onClick={() => handleAction('add')}
                      disabled={busy}
                    >
                      {busy ? '…' : '+ Add 🪙'}
                    </button>
                    <button
                      className="admin-btn admin-btn-sub"
                      onClick={() => handleAction('subtract')}
                      disabled={busy}
                    >
                      {busy ? '…' : '− Remove'}
                    </button>
                  </div>
                </div>
              )}

              <button className="admin-close" onClick={close}>✕ Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
