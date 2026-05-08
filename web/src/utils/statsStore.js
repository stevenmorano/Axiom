const STATS_KEY = 'axiom_player_stats';

const defaultStats = {
  lastPlayedDate: null,
  stats: {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalRating: 0
  },
  history: {} // Map of YYYY-MM-DD to { status, rating, timeMs, lives }
};

export const loadStats = () => {
  const saved = localStorage.getItem(STATS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migrate old data if necessary (simple clear if missing new fields)
      if (parsed.stats && parsed.stats.wins === undefined) {
        return JSON.parse(JSON.stringify(defaultStats));
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse saved stats", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultStats));
};

export const calculateAxiomRating = (totalTimeMs, livesRemaining) => {
  if (livesRemaining <= 0) return 0;

  const baseScore = 1000;
  const mistakes = 10 - livesRemaining;
  const mistakePenalty = mistakes * 50; 
  
  const timeSeconds = Math.floor(totalTimeMs / 1000);
  const timePenalty = timeSeconds * 2; // Lose 2 points per second
  
  return Math.max(0, baseScore - mistakePenalty - timePenalty);
};

export const saveGameResult = (times, livesRemaining) => {
  const state = loadStats();
  
  const totalTimeMs = times.reduce((a, b) => a + b, 0);
  const rating = calculateAxiomRating(totalTimeMs, livesRemaining);
  
  const today = new Date();
  const dateString = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.getFullYear() + '-' + 
                         String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(yesterday.getDate()).padStart(2, '0');

  if (state.lastPlayedDate !== dateString) {
    state.stats.gamesPlayed += 1;
    state.stats.wins += 1;
    
    if (state.lastPlayedDate === yesterdayString) {
      if (state.history[yesterdayString] && state.history[yesterdayString].status === 'win') {
        state.stats.currentStreak += 1;
      } else {
        state.stats.currentStreak = 1;
      }
    } else {
      state.stats.currentStreak = 1;
    }
    
    if (state.stats.currentStreak > state.stats.maxStreak) {
      state.stats.maxStreak = state.stats.currentStreak;
    }
    
    state.stats.totalRating += rating;
  } else {
    // Development/Testing fallback: allow overwriting today's score
    if (state.history[dateString] && state.history[dateString].status === 'win') {
        state.stats.totalRating = state.stats.totalRating - state.history[dateString].rating + rating;
    } else {
        state.stats.wins += 1;
        state.stats.totalRating += rating;
    }
  }

  state.lastPlayedDate = dateString;
  state.history[dateString] = {
    status: 'win',
    timeMs: totalTimeMs,
    lives: livesRemaining,
    rating: rating
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(state));
  return state;
};

export const saveGameFailure = (timeMs) => {
  const state = loadStats();
  
  const today = new Date();
  const dateString = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');

  if (state.lastPlayedDate !== dateString) {
    state.stats.gamesPlayed += 1;
    state.stats.currentStreak = 0;
  } else {
    // Development fallback
    if (state.history[dateString] && state.history[dateString].status === 'win') {
        state.stats.wins -= 1;
        state.stats.totalRating -= state.history[dateString].rating;
    }
    state.stats.currentStreak = 0;
  }

  state.lastPlayedDate = dateString;
  state.history[dateString] = {
    status: 'fail',
    timeMs: timeMs,
    lives: 0,
    rating: 0
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(state));
  return state;
};

export const getRatingDistribution = () => {
  const state = loadStats();
  const distribution = {
    '900+': 0,
    '800-899': 0,
    '700-799': 0,
    '600-699': 0,
    '<600': 0
  };
  
  Object.values(state.history).forEach(record => {
    if (record.status === 'win') {
      if (record.rating >= 900) distribution['900+']++;
      else if (record.rating >= 800) distribution['800-899']++;
      else if (record.rating >= 700) distribution['700-799']++;
      else if (record.rating >= 600) distribution['600-699']++;
      else distribution['<600']++;
    }
  });
  
  return distribution;
};
