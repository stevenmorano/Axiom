import React from 'react';

export const SymbolIcon = ({ type, size = 32 }) => {
  const colors = {
    circle: '#38bdf8',
    triangle: '#fb923c',
    square: '#a78bfa',
    star: '#facc15',
    hexagon: '#2dd4bf',
  };

  const color = colors[type];

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="symbol-svg">
      {type === 'circle' && <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="8" fill="none" />}
      {type === 'triangle' && <path d="M50 15 L15 85 L85 85 Z" stroke={color} strokeWidth="8" strokeLinejoin="round" fill="none" />}
      {type === 'square' && <rect x="15" y="15" width="70" height="70" rx="8" stroke={color} strokeWidth="8" fill="none" />}
      {type === 'star' && <path d="M50 5 L61 39 L97 39 L68 60 L79 94 L50 73 L21 94 L32 60 L3 39 L39 39 Z" stroke={color} strokeWidth="8" strokeLinejoin="round" fill="none" />}
      {type === 'hexagon' && <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" stroke={color} strokeWidth="8" strokeLinejoin="round" fill="none" />}
    </svg>
  );
};
