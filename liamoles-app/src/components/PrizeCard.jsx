import React from 'react';
import { motion } from 'framer-motion';
import './PrizeCard.css';

export default function PrizeCard({ prize, balance, onBuy, todaysHoliday }) {
  const isOnSale = todaysHoliday && prize.saleHolidays?.includes(todaysHoliday.id);
  const salePrice = isOnSale
    ? Math.round(prize.cost * (1 - prize.salePercent / 100))
    : prize.cost;
  const effectiveCost = isOnSale ? salePrice : prize.cost;
  const canAfford = balance >= effectiveCost;

  function handleBuy() {
    if (!canAfford) return;
    // Pass along the effective (possibly discounted) cost so the purchase uses the right amount.
    onBuy(isOnSale ? { ...prize, cost: effectiveCost } : prize);
  }

  return (
    <motion.div
      className={`prize-card ${canAfford ? 'affordable' : 'locked'} ${isOnSale ? 'on-sale' : ''}`}
      whileHover={canAfford ? { scale: 1.04, y: -4 } : { scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      {isOnSale && (
        <div className="sale-tag">{prize.salePercent}% OFF</div>
      )}

      <div className="prize-img-wrap">
        {prize.link ? (
          <a href={prize.link} target="_blank" rel="noopener noreferrer">
            <img src={prize.image} alt={prize.name} className="prize-img" />
          </a>
        ) : (
          <img src={prize.image} alt={prize.name} className="prize-img" />
        )}
        {!canAfford && <div className="prize-lock-overlay">🔒</div>}
      </div>

      <div className="prize-body">
        <div className="prize-name">
          {prize.link ? (
            <a href={prize.link} target="_blank" rel="noopener noreferrer" className="prize-link">
              {prize.name}
            </a>
          ) : (
            prize.name
          )}
        </div>
        <div className="prize-desc">{prize.description}</div>
        <div className="prize-footer">
          <div className="prize-cost">
            <span className="cost-coin">🪙</span>
            {isOnSale ? (
              <span className="cost-prices">
                <span className="cost-num cost-original">{prize.cost.toLocaleString()}</span>
                <span className="cost-num cost-sale">{salePrice.toLocaleString()}</span>
              </span>
            ) : (
              <span className="cost-num">{prize.cost.toLocaleString()}</span>
            )}
            <span className="cost-label"> liamoles</span>
          </div>
          <motion.button
            className={`buy-btn ${canAfford ? 'buy-btn-active' : 'buy-btn-disabled'}`}
            onClick={handleBuy}
            disabled={!canAfford}
            whileTap={canAfford ? { scale: 0.93 } : {}}
          >
            {canAfford ? 'Get It! 🎉' : 'Not yet…'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
