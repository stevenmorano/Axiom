import React, { useState, useEffect } from 'react';
import { loadStats } from '../utils/statsStore';
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
  const winPercent = stats.gamesPlayed > 0 ? 100 : 0; // Win rate is 100% since we only log wins

  // Mock distribution curve data for MVP
  const distribution = [5, 12, 28, 45, 80, 55, 25, 10, 4];
  const userTierIndex = 4; // Mock user falling in the median

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
            <div className="stat-value">{stats.maxStreak}</div>
            <div className="stat-label">Max</div>
          </div>
        </div>

        {/* Global Distribution */}
        <div className="stats-section">
          <h3>GLOBAL DISTRIBUTION</h3>
          <div className="distribution-chart">
            {distribution.map((val, idx) => (
              <div key={idx} className="dist-bar-container">
                <div 
                  className={`dist-bar ${idx === userTierIndex ? 'dist-bar-active' : ''}`}
                  style={{ height: showAnimation ? `${(val / 80) * 100}%` : '0%' }}
                ></div>
              </div>
            ))}
          </div>
          {stats.gamesPlayed > 0 && (
            <div className="percentile-text">
              You beat <span className="highlight-text">82%</span> of players today.
            </div>
          )}
        </div>

        {/* Calendar Heatmap */}
        <div className="stats-section">
          <h3>LAST 30 DAYS</h3>
          <div className="heatmap-grid">
            {heatmapDays.map((day, i) => {
              let cellClass = 'heatmap-cell empty';
              if (day.record) {
                if (day.record.mistakes === 0) cellClass = 'heatmap-cell flawless';
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
