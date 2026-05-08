import React, { useState, useEffect } from 'react';
import { loadStats, getRatingDistribution } from '../utils/statsStore';
import './StatsModal.css';

const StatsModal = ({ isOpen, onClose }) => {
  const [statsData, setStatsData] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatsData(loadStats());
      // Trigger animations slightly after mount
      setTimeout(() => setShowAnimation(true), 50);
    } else {
      setShowAnimation(false);
    }
  }, [isOpen]);

  if (!isOpen || !statsData) return null;

  const { stats, history } = statsData;
  const winPercent = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const avgRating = stats.wins > 0 ? Math.round(stats.totalRating / stats.wins) : 0;

  const distObj = getRatingDistribution();
  const distLabels = ['<600', '600-699', '700-799', '800-899', '900+'];
  const distData = distLabels.map(k => distObj[k]);
  const maxVal = Math.max(...distData, 1);

  // Generate last 30 days for heatmap
  const heatmapDays = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.getFullYear() + '-' + 
                    String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(d.getDate()).padStart(2, '0');
    
    heatmapDays.push({
      dateStr,
      record: history[dateStr] || null
    });
  }

  return (
    <div className="stats-overlay animate-fade-in" onClick={onClose}>
      <div className="stats-modal glass" onClick={e => e.stopPropagation()}>
        <div className="stats-header">
          <h2>STATISTICS</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Tale of the Tape */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-value">{stats.gamesPlayed}</div>
            <div className="stat-label">Played</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{winPercent}</div>
            <div className="stat-label">Win %</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">Streak</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">Avg Rating</div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="stats-section">
          <h3>RATING DISTRIBUTION</h3>
          <div className="distribution-chart">
            {distLabels.map((label, idx) => {
              const val = distData[idx];
              const isMostFrequent = val === Math.max(...distData) && val > 0;
              return (
                <div key={idx} className="dist-bar-container">
                  <div className="dist-bar-wrapper">
                    <div 
                      className={`dist-bar ${isMostFrequent ? 'dist-bar-active' : ''}`}
                      style={{ height: showAnimation ? `${(val / maxVal) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <div className="dist-bar-value">{val}</div>
                  <div className="dist-bar-label">{label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="stats-section">
          <h3>LAST 30 DAYS</h3>
          <div className="heatmap-grid">
            {heatmapDays.map((day, i) => {
              let cellClass = 'heatmap-cell empty';
              if (day.record) {
                if (day.record.status === 'fail') cellClass = 'heatmap-cell failed';
                else if (day.record.lives === 10) cellClass = 'heatmap-cell flawless';
                else cellClass = 'heatmap-cell finished';
              }
              return <div key={i} className={cellClass} title={day.dateStr}></div>;
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatsModal;
