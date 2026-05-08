
import React, { useState, useEffect, useRef } from 'react';
import { SYMBOLS, generateAxiomPuzzle, checkWin, getRuleDescription } from './axiomLogic';
import { saveGameResult, saveGameFailure, loadStats } from './utils/statsStore';
import StatsModal from './components/StatsModal';
import RulesModal from './components/RulesModal';
import { SymbolIcon } from './components/SymbolIcon';

// --- Helper Functions ---
const formatTime = (ms) => {
  if (ms === null) return "--:--.--";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};

const getEmojiColor = (ms) => {
  if (ms < 15000) return '🟩';
  if (ms < 25000) return '🟨';
  return '🟥';
};

const MAIN_SCREEN = 'home';
const PRE_PUZZLE = 'pre_puzzle';
const PLAYING = 'playing';
const PUZZLE_COMPLETE = 'puzzle_complete';
const DAILY_COMPLETE = 'daily_complete';
const SYSTEM_FAILURE = 'system_failure';

function App() {
  const [status, setStatus] = useState(MAIN_SCREEN);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [board, setBoard] = useState([null, null, null, null, null]);
  const [puzzle, setPuzzle] = useState(null);
  const [times, setTimes] = useState([null, null, null, null, null]);
  const [mistakes, setMistakes] = useState([0, 0, 0, 0, 0]);
  const [lives, setLives] = useState(10);
  const [timer, setTimer] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Drag State
  const [draggedSymbol, setDraggedSymbol] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [targetSlot, setTargetSlot] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(0);
  const lastInteractionRef = useRef(Date.now());

  const handleSystemFailure = () => {
    setStatus(SYSTEM_FAILURE);
    if (timerRef.current) clearInterval(timerRef.current);
    saveGameFailure(timer);
  };

  // --- State Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('axiom_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setStatus(state.status);
        setCurrentIdx(state.currentIdx);
        setBoard(state.board);
        setPuzzle(state.puzzle);
        setTimes(state.times);
        setMistakes(state.mistakes || [0,0,0,0,0]);
        setLives(state.lives !== undefined ? state.lives : 10);
        startTimeRef.current = state.startTime || Date.now();
        lastInteractionRef.current = state.lastInteraction || Date.now();
        
        if (state.status === PLAYING) {
          timerRef.current = setInterval(() => {
            const now = Date.now();
            setTimer(now - startTimeRef.current);
            // 15 minutes = 900000 ms
            if (now - lastInteractionRef.current > 900000) {
                handleSystemFailure();
            }
          }, 47);
        }
      } catch (e) {
        console.error("Failed to parse saved state");
      }
    }
    
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (status !== MAIN_SCREEN) {
      localStorage.setItem('axiom_state', JSON.stringify({
        status, currentIdx, board, puzzle, times, mistakes, lives,
        lastInteraction: lastInteractionRef.current, startTime: startTimeRef.current
      }));
    }
  }, [status, currentIdx, board, puzzle, times, mistakes, lives]);

  // --- Game Loop Handlers ---
  const startDaily = () => {
    localStorage.removeItem('axiom_state');
    setCurrentIdx(0);
    setTimes([null, null, null, null, null]);
    setMistakes([0, 0, 0, 0, 0]);
    setLives(10);
    lastInteractionRef.current = Date.now();
    preparePuzzle(0);
  };

  const preparePuzzle = (idx) => {
    const counts = [3, 4, 4, 5, 5]; // Reliable rule counts for logic uniqueness
    const newPuzzle = generateAxiomPuzzle(counts[idx]);
    setPuzzle(newPuzzle);
    setBoard([null, null, null, null, null]);
    setIsSuccess(false);

    if (idx === 0) {
      setStatus(PRE_PUZZLE);
      setTimer(0);
    } else {
      setStatus(PLAYING);
      setTimer(0);
      startTimeRef.current = Date.now();
      lastInteractionRef.current = Date.now();
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setTimer(now - startTimeRef.current);
        if (now - lastInteractionRef.current > 900000) handleSystemFailure();
      }, 47);
    }
  };

  const startPuzzle = () => {
    setStatus(PLAYING);
    startTimeRef.current = Date.now();
    lastInteractionRef.current = Date.now();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const now = Date.now();
      setTimer(now - startTimeRef.current);
      if (now - lastInteractionRef.current > 900000) handleSystemFailure();
    }, 47);
  };

  const handleWin = (finalTime) => {
    setIsSuccess(true);
    const newTimes = [...times];
    newTimes[currentIdx] = finalTime;
    setTimes(newTimes);
    
    setTimeout(() => {
        if (currentIdx < 4) {
            setCurrentIdx(currentIdx + 1);
            preparePuzzle(currentIdx + 1);
        } else {
            setStatus(DAILY_COMPLETE);
            clearInterval(timerRef.current);
            saveGameResult(newTimes, lives);
            setTimeout(() => setShowStats(true), 1500);
        }
    }, 300);
  };

  const handleSubmit = () => {
    if (board.includes(null)) return;
    
    lastInteractionRef.current = Date.now();
    
    if (checkWin(board, puzzle.rules)) {
        handleWin(Date.now() - startTimeRef.current);
    } else {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 400);
        
        const newMistakes = [...mistakes];
        newMistakes[currentIdx]++;
        setMistakes(newMistakes);
        
        const newLives = lives - 1;
        setLives(newLives);
        
        if (newLives <= 0) {
            handleSystemFailure();
        }
    }
  };

  const nextPuzzle = () => {
    if (currentIdx < 4) {
      setCurrentIdx(currentIdx + 1);
      preparePuzzle(currentIdx + 1);
    } else {
      setStatus(DAILY_COMPLETE);
    }
  };

  const shareResults = async () => {
    const total = times.reduce((a, b) => a + b, 0);
    const totalMistakes = mistakes.reduce((a, b) => a + b, 0);
    const flawless = totalMistakes === 0 ? ' 🌟 FLAWLESS' : '';
    
    const lines = times.map((t, i) => {
      const timeStr = formatTime(t).slice(0, 5); // MM:SS
      const missCount = mistakes[i];
      const missStr = missCount === 0 ? '🎯 Perfect' : `❌ ${missCount} ${missCount === 1 ? 'miss' : 'misses'}`;
      return `${i+1}️⃣ ${getEmojiColor(t)} ${timeStr} | ${missStr}`;
    }).join('\n');

    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    
    const stats = loadStats();
    const streakStr = stats.stats.currentStreak > 1 ? `\n🔥 Streak: ${stats.stats.currentStreak}` : '';
    
    const shareText = `Axiom #1 - ${dateStr}\n⏱️ ${formatTime(total).slice(0, 5)}${flawless}${streakStr}\n\n${lines}\n\nPlay at: axiom.game`;
    
    // Always attempt to copy to clipboard behind the scenes just in case
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (e) {
      console.warn("Silent copy failed", e);
    }
    
    // Windows Desktop share sheet notoriously lacks a 'Copy' button.
    // iOS and Android share sheets always have a 'Copy' button.
    // So, we only trigger native share on mobile devices.
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: 'Axiom Daily Results',
          text: shareText
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Desktop fallback: just alert since we already copied it
      alert("Result Copied to Clipboard!");
    }
  };

  const resetGame = () => {
    clearInterval(timerRef.current);
    localStorage.removeItem('axiom_state');
    setStatus(MAIN_SCREEN);
    setBoard([null, null, null, null, null]);
    setMistakes([0, 0, 0, 0, 0]);
    setTimes([null, null, null, null, null]);
    setLives(10);
    setTimer(0);
  };

  // --- Interaction Logic ---
  const onPointerDown = (e, symbol, fromSlot = -1) => {
    e.preventDefault();
    lastInteractionRef.current = Date.now();
    setDraggedSymbol(symbol);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDragPos({ x: e.clientX, y: e.clientY });
    
    // If pulling from board, clear that slot
    if (fromSlot !== -1) {
        const newBoard = [...board];
        newBoard[fromSlot] = null;
        setBoard(newBoard);
    }
  };

  useEffect(() => {
    const onPointerMove = (e) => {
        if (!draggedSymbol) return;
        setDragPos({ x: e.clientX, y: e.clientY });

        // Check for slots
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const slotEl = elements.find(el => el.classList.contains('slot'));
        if (slotEl) {
            setTargetSlot(parseInt(slotEl.dataset.index));
        } else {
            setTargetSlot(null);
        }
    };

    const onPointerUp = () => {
        if (!draggedSymbol) return;
        
        if (targetSlot !== null) {
            const newBoard = [...board];
            newBoard[targetSlot] = draggedSymbol;
            setBoard(newBoard);
        }

        setDraggedSymbol(null);
        setTargetSlot(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggedSymbol, targetSlot, board, puzzle]);

  // --- Render Sections ---
  if (status === MAIN_SCREEN) {
    const stats = loadStats();
    
    return (
      <div className="screen animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Concept 1: Command Center Header */}
        <div className="main-header glass">
           <span className="main-logo">AXIOM</span>
           <div className="main-actions">
              <button className="icon-btn" onClick={() => setShowRules(true)} title="How to Play">❓</button>
              <button className="icon-btn" onClick={() => setShowStats(true)} title="Statistics">📊</button>
           </div>
        </div>

        {/* Content Centered */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 className="game-title" style={{ fontSize: '4rem', marginBottom: '8px' }}>AXIOM</h1>
            <p style={{ color: 'var(--text-dim)', marginBottom: '32px' }}>Daily Logic Sequence #01</p>
            
            {/* Concept 2: Habit Driver */}
            {stats.stats.gamesPlayed > 0 ? (
                <div className="habit-driver">
                    {stats.stats.currentStreak > 0 ? (
                        <span>🔥 {stats.stats.currentStreak} Day Streak - Keep it going!</span>
                    ) : (
                        <span>Your logic is rusty. Start a new streak today.</span>
                    )}
                </div>
            ) : (
                <div className="habit-driver">
                    <span>0 Games Played. Begin your journey.</span>
                </div>
            )}

            <button className="button-primary" onClick={startDaily}>PLAY TODAY</button>
        </div>
        
        <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
        <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
      </div>
    );
  }

  if (status === PRE_PUZZLE) {
    if (!puzzle) return <div>Generating...</div>;
    return (
      <div className="screen" style={{ position: 'relative' }}>
         {/* Background content blurred */}
         <div className="blur" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0, background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="slots-container" style={{opacity: 0.5}}>
               <div className="slot"></div><div className="slot"></div><div className="slot"></div><div className="slot"></div><div className="slot"></div>
            </div>
         </div>
         
         <div className="overlay" style={{ zIndex: 50 }}>
            <div className="ready-box glass animate-fade-in">
                <h2 style={{ marginBottom: '16px' }}>Puzzle {currentIdx + 1}</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: '24px' }}>Symbols are hidden. Timer starts when you press start.</p>
                <button className="button-primary" onClick={startPuzzle}>START PUZZLE</button>
            </div>
         </div>
         
         <button 
            onClick={resetGame}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-dim)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', zIndex: 100 }}
         >
            Reset (Test)
         </button>
      </div>
    );
  }

  if (status === PLAYING || status === PUZZLE_COMPLETE) {
    if (!puzzle || !puzzle.rules) return <div>Error: No puzzle</div>;
    const symbolsInPool = SYMBOLS.filter(s => !board.includes(s));
    
    return (
      <div className={`screen ${isSuccess ? 'success-overlay' : ''}`}>
        <div className="header" style={{ marginBottom: '12px' }}>
          <span className="game-title">AXIOM {currentIdx + 1}/5</span>
          <span className="timer">{formatTime(timer)}</span>
        </div>

        <div className="integrity-container">
            <div className="integrity-label">INTEGRITY</div>
            <div className="integrity-bar">
               {[...Array(10)].map((_, i) => (
                   <div key={i} className={`integrity-segment ${i < lives ? (lives <= 3 ? 'critical' : 'active') : 'drained'}`}></div>
               ))}
            </div>
        </div>

        <div className="rules-container glass">
          {puzzle.rules.map((rule, i) => (
            <div key={i} className="rule-card">
              {getRuleDescription(rule)}
            </div>
          ))}
        </div>

        <div className={`slots-container ${isShaking ? 'shake error-flash' : ''}`}>
          {board.map((sym, i) => (
            <div 
              key={i} 
              data-index={i}
              className={`slot ${targetSlot === i ? 'active' : ''}`}
            >
               {sym && (
                 <div 
                   className="draggable-symbol" 
                   onPointerDown={(e) => onPointerDown(e, sym, i)}
                 >
                   <SymbolIcon type={sym} />
                 </div>
               )}
            </div>
          ))}
        </div>

        <div className="symbol-container glass">
           {symbolsInPool.map((sym, i) => (
             <div 
                key={sym} 
                className="draggable-symbol" 
                onPointerDown={(e) => onPointerDown(e, sym)}
                style={{ visibility: draggedSymbol === sym ? 'hidden' : 'visible' }}
            >
               <SymbolIcon type={sym} />
             </div>
           ))}
        </div>
        
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
            <button 
                className="button-primary" 
                style={{ width: '100%', opacity: board.includes(null) ? 0.5 : 1 }}
                onClick={handleSubmit}
                disabled={board.includes(null)}
            >
                SUBMIT
            </button>
        </div>

        {draggedSymbol && (
            <div 
                style={{
                    position: 'fixed',
                    left: dragPos.x - dragOffset.x,
                    top: dragPos.y - dragOffset.y,
                    pointerEvents: 'none',
                    zIndex: 1000,
                    transform: 'scale(1.2)'
                }}
                className="draggable-symbol"
            >
                <SymbolIcon type={draggedSymbol} />
            </div>
        )}

        <button 
            onClick={resetGame}
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-dim)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', zIndex: 100 }}
        >
            Reset (Test)
        </button>
      </div>
    );
  }

  if (status === DAILY_COMPLETE) {
    const totalTime = times.reduce((a, b) => a + b, 0);
    const totalMistakes = mistakes.reduce((a, b) => a + b, 0);
    
    return (
        <div className="screen animate-fade-in daily-complete-screen" style={{ padding: 0 }}>
            {/* Scrollable Content */}
            <div className="daily-complete-content">
                <button 
                  onClick={() => setShowStats(true)}
                  style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 100 }}
                  title="Statistics"
                >
                  📊
                </button>
                <h1 className="game-title title-margin">DAILY COMPLETE</h1>
                <p className="subtitle-margin" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                    Axiom #1 - {new Date().toLocaleDateString()}
                    {totalMistakes === 0 && <span style={{ color: 'var(--success)', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>🌟 FLAWLESS RUN</span>}
                </p>

                <div className="glass daily-stats-glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span>Total Time</span>
                        <span className="timer" style={{ fontSize: '1.8rem' }}>{formatTime(totalTime)}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {times.map((t, i) => (
                            <div key={i} className="stat-row">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-dim)' }}>{i+1}</span>
                                    <div style={{ fontSize: '0.9rem', color: mistakes[i] === 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>
                                        {mistakes[i] === 0 ? '🎯 Perfect' : `❌ ${mistakes[i]} ${mistakes[i] === 1 ? 'miss' : 'misses'}`}
                                    </div>
                                </div>
                                <span className={getEmojiColor(t) === '🟩' ? 'tag-green' : getEmojiColor(t) === '🟨' ? 'tag-yellow' : 'tag-red'} style={{ fontWeight: '600' }}>
                                    {formatTime(t)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <h3 style={{ marginBottom: '12px' }}>Global Leaderboard</h3>

                <div className="leaderboard-item">
                    <span>1. ZenMaster</span>
                    <span>00:48.12</span>
                </div>
                <div className="leaderboard-item me">
                    <span>{Math.floor(Math.random() * 50) + 12}. YOU</span>
                    <span>{formatTime(totalTime)}</span>
                </div>
                <div className="leaderboard-item" style={{ marginBottom: '0' }}>
                    <span>Avg Player</span>
                    <span>01:15.44</span>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="daily-complete-footer glass">
                <button 
                    className="button-primary share-btn" 
                    onClick={shareResults}
                >
                    SHARE RESULTS
                </button>
                <button 
                    onClick={resetGame}
                    className="start-over-btn"
                >
                    Start Over
                </button>
            </div>
            
            <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
        </div>
    );
  }

  if (status === SYSTEM_FAILURE) {
      return (
          <div className="screen animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
              <div className="glitch-overlay"></div>
              <div className="glass" style={{ padding: '40px 24px', width: '100%', border: '1px solid rgba(239, 68, 68, 0.3)', position: 'relative', zIndex: 10 }}>
                  <h1 className="game-title glitch-text" data-text="SYSTEM FAILURE" style={{ color: 'var(--danger)', fontSize: '2.5rem', letterSpacing: '2px', marginBottom: '8px' }}>
                     SYSTEM FAILURE
                  </h1>
                  <p style={{ color: 'var(--text-dim)', marginBottom: '32px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    &gt; INTEGRITY COMPROMISED<br/>
                    &gt; CONNECTION TERMINATED
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', textAlign: 'left', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                      <div style={{ color: 'var(--text-dim)' }}>
                         PUZZLES SOLVED:<br/>
                         TIME ELAPSED:
                      </div>
                      <div style={{ color: 'var(--text)', textAlign: 'right' }}>
                         {currentIdx}/5<br/>
                         {formatTime(timer)}
                      </div>
                  </div>

                  <button className="button-primary" onClick={resetGame} style={{ background: 'transparent', border: '2px solid var(--danger)', color: 'var(--danger)', width: '100%' }}>
                     REBOOT SYSTEM
                  </button>
              </div>
          </div>
      );
  }

  return null;
}

export default App;
