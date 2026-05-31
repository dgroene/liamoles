import React from 'react';
import { motion } from 'framer-motion';
import './PrizeCard.css';

export default function PrizeCard({ prize, balance, onBuy, todaysHoliday, luckyPrize }) {
  const isLucky = luckyPrize?.id === prize.id;
  const isOnSale = !isLucky && todaysHoliday && prize.saleHolidays?.includes(todaysHoliday.id);

  const effectiveCost = isLucky
    ? Math.round(prize.cost * 0.25)
    : isOnSale
    ? Math.round(prize.cost * (1 - prize.salePercent / 100))
    : prize.cost;

  const canAfford = balance >= effectiveCost;

  function handleBuy() {
    if (!canAfford) return;
    onBuy(isLucky || isOnSale ? { ...prize, cost: effectiveCost } : prize);
  }

  return (
    <motion.div
      className={`prize-card ${canAfford ? 'affordable' : 'locked'} ${isOnSale ? 'on-sale' : ''} ${isLucky ? 'lucky-day' : ''}`}
      whileHover={canAfford ? { scale: 1.04, y: -4 } : { scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      layout
    >
      {isLucky && <div className="lucky-tag">🍀 Lucky Day! 75% OFF</div>}
      {!isLucky && isOnSale && <div className="sale-tag">{prize.salePercent}% OFF</div>}

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
            {(isLucky || isOnSale) ? (
              <span className="cost-prices">
                <span className="cost-num cost-original">{prize.cost.toLocaleString()}</span>
                <span className={`cost-num ${isLucky ? 'cost-lucky' : 'cost-sale'}`}>{effectiveCost.toLocaleString()}</span>
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
