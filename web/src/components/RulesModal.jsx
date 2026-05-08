import React from 'react';
import './StatsModal.css'; // Reusing the exact same glass modal classes
import { SymbolIcon } from './SymbolIcon';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="stats-overlay animate-fade-in" onClick={onClose}>
      <div className="stats-modal glass" onClick={e => e.stopPropagation()} style={{ overflowY: 'auto', maxHeight: '90vh' }}>
        <div className="stats-header">
          <h2>HOW TO PLAY</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="stats-section" style={{ color: 'var(--text)' }}>
          <p style={{ lineHeight: '1.5', fontSize: '0.95rem' }}>
            Decode the daily sequence. Every day brings 5 new logic puzzles to solve. Your goal is to place all 5 symbols in the correct order.
          </p>
        </div>

        <div className="stats-section">
          <h3 style={{ color: 'var(--accent)' }}>1. THE AXIOMS</h3>
          <p style={{ lineHeight: '1.5', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            Read the provided rules (axioms). Every rule is absolute.
            <br/><br/>
            <span style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontStyle: 'italic' }}>
              "The <SymbolIcon type="triangle" size={16} /> is immediately left of the <SymbolIcon type="square" size={16} />."
            </span>
          </p>
        </div>

        <div className="stats-section">
          <h3 style={{ color: 'var(--accent)' }}>2. THE MECHANICS</h3>
          <p style={{ lineHeight: '1.5', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            Drag and drop the symbols from the bottom pool into the 5 empty slots. Once all 5 slots are filled, press <strong style={{ color: 'var(--text)' }}>SUBMIT</strong>.
          </p>
        </div>

        <div className="stats-section">
          <h3 style={{ color: 'var(--accent)' }}>3. FEEDBACK</h3>
          <ul style={{ paddingLeft: '20px', lineHeight: '1.6', fontSize: '0.9rem', color: 'var(--text-dim)', margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>
              <strong style={{ color: 'var(--danger)' }}>Board Shakes?</strong> Incorrect sequence. You earn a "miss" and lose time.
            </li>
            <li>
              <strong style={{ color: 'var(--success)' }}>Green Flash?</strong> Correct! You'll immediately move to the next puzzle.
            </li>
          </ul>
        </div>

        <div className="stats-section">
          <h3 style={{ color: 'var(--accent)' }}>4. THE LEADERBOARD</h3>
          <p style={{ lineHeight: '1.5', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
            Your final rank is based on <strong style={{ color: 'var(--text)' }}>Total Time</strong> and <strong style={{ color: 'var(--text)' }}>Misses</strong>. Play carefully—a <strong style={{ color: 'var(--success)' }}>FLAWLESS RUN</strong> (0 misses) is the key to dominating the Global Leaderboard.
          </p>
        </div>

      </div>
    </div>
  );
};

export default RulesModal;
