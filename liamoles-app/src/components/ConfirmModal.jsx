import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConfirmModal.css';

export default function ConfirmModal({ prize, balance, onConfirm, onCancel }) {
  if (!prize) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="modal-box"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-emoji">🛒</div>
          <h2 className="modal-title">Redeem Prize?</h2>
          <div className="modal-prize-name">{prize.name}</div>
          <img src={prize.image} alt={prize.name} className="modal-img" />
          <div className="modal-cost-line">
            <span>Costs</span>
            <span className="modal-cost">🪙 {prize.cost.toLocaleString()} liamoles</span>
          </div>
          <div className="modal-balance-line">
            <span>You have</span>
            <span className="modal-balance">🪙 {balance.toLocaleString()} liamoles</span>
          </div>
          <div className="modal-remaining">
            After: <strong>🪙 {(balance - prize.cost).toLocaleString()}</strong> remaining
          </div>
          <div className="modal-actions">
            <button className="modal-btn modal-cancel" onClick={onCancel}>Nope</button>
            <button className="modal-btn modal-confirm" onClick={onConfirm}>Yes, get it! 🎉</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
