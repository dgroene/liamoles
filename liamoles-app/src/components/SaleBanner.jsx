import React from 'react';
import { motion } from 'framer-motion';
import './SaleBanner.css';

export default function SaleBanner({ holiday }) {
  if (!holiday) return null;

  return (
    <motion.div
      className="sale-banner"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <span className="sale-banner-emoji">{holiday.emoji}</span>
      <span className="sale-banner-text">{holiday.name} Sale!</span>
      <span className="sale-banner-emoji">{holiday.emoji}</span>
    </motion.div>
  );
}
