import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import './LiamoleBalance.css';

function AnimatedNumber({ value }) {
  const spring = useSpring(value, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export default function LiamoleBalance({ balance, loading }) {
  return (
    <div className="balance-wrap">
      <div className="balance-label">YOUR LIAMOLES</div>
      <div className="balance-value">
        {loading ? (
          <span className="balance-loading">…</span>
        ) : (
          <>
            <span className="balance-coin">🪙</span>
            <AnimatedNumber value={balance} />
          </>
        )}
      </div>
      <div className="balance-sub">Spend them on awesome stuff below</div>
    </div>
  );
}
