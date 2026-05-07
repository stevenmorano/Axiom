const STATS_KEY = 'axiom_player_stats';

const defaultStats = {
  lastPlayedDate: null,
  stats: {
    gamesPlayed: 0,
    currentStreak: 0,
    maxStreak: 0,
    flawlessGames: 0,
    fastestSolveMs: null,
    totalTimePlayedMs: 0
  },
  history: {}
};

export const loadStats = () => {
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse saved stats", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultStats));
};

export const saveGameResult = (times, mistakes) => {
  const state = loadStats();
  
  const totalTimeMs = times.reduce((a, b) => a + b, 0);
  const totalMistakes = mistakes.reduce((a, b) => a + b, 0);
  const isFlawless = totalMistakes === 0;
  
  // Format today's date as YYYY-MM-DD
  const today = new Date();
  const dateString = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');

  // Calculate yesterday's date string for streak logic
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.getFullYear() + '-' + 
                         String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(yesterday.getDate()).padStart(2, '0');

  // Only increment core stats if it's a new day (assuming 1 daily puzzle)
  if (state.lastPlayedDate !== dateString) {
    state.stats.gamesPlayed += 1;
    
    // Streak logic
    if (state.lastPlayedDate === yesterdayString) {
      state.stats.currentStreak += 1;
    } else {
      state.stats.currentStreak = 1;
    }
    
    if (state.stats.currentStreak > state.stats.maxStreak) {
      state.stats.maxStreak = state.stats.currentStreak;
    }
    
    if (isFlawless) {
      state.stats.flawlessGames += 1;
    }
  }

  // Always check for a new personal best, even on replays/testing
  if (state.stats.fastestSolveMs === null || totalTimeMs < state.stats.fastestSolveMs) {
    state.stats.fastestSolveMs = totalTimeMs;
  }
  
  state.stats.totalTimePlayedMs += totalTimeMs;
  state.lastPlayedDate = dateString;

  // Save the historical record
  state.history[dateString] = {
    timeMs: totalTimeMs,
    mistakes: totalMistakes,
    percentile: Math.floor(Math.random() * 20) + 80 // Mock percentile 80-99% for MVP
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(state));
  return state;
};
