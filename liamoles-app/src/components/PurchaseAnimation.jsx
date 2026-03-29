import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PurchaseAnimation.css';

// Confetti particle
function Particle({ x, y, color, delay }) {
  return (
    <motion.div
      className="particle"
      style={{ left: x, top: y, background: color }}
      initial={{ scale: 0, opacity: 1, y: 0, x: 0, rotate: 0 }}
      animate={{
        scale: [0, 1.5, 0.8],
        opacity: [1, 1, 0],
        y: [0, -(80 + Math.random() * 120)],
        x: [(Math.random() - 0.5) * 200],
        rotate: [0, (Math.random() - 0.5) * 720],
      }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    />
  );
}

const COLORS = ['#FFD700', '#7c3aed', '#ec4899', '#10b981', '#60a5fa', '#f97316', '#fff'];

function makeParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: `${25 + Math.random() * 50}%`,
    y: `${20 + Math.random() * 40}%`,
    color: COLORS[i % COLORS.length],
    delay: Math.random() * 0.4,
  }));
}

export default function PurchaseAnimation({ prize, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  const particles = makeParticles(40);

  return (
    <AnimatePresence>
      <motion.div
        className="purchase-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Confetti */}
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}

        {/* Prize fly-in */}
        <motion.div
          className="purchase-card"
          initial={{ scale: 0, rotate: -15, opacity: 0, y: 60 }}
          animate={{ scale: 1, rotate: [-15, 5, -3, 0], opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <motion.div
            className="purchase-burst"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.4, 1] }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          <motion.img
            src={prize.image}
            alt={prize.name}
            className="purchase-img"
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.15, 1] }}
            transition={{ duration: 0.5, delay: 0.25 }}
          />
          <motion.div
            className="purchase-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {prize.name}
          </motion.div>
          <motion.div
            className="purchase-label"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 300 }}
          >
            🎉 REDEEMED! 🎉
          </motion.div>
          <motion.div
            className="purchase-cost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            −{prize.cost.toLocaleString()} 🪙
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
