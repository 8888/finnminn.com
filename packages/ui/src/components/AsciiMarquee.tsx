import { useState, useEffect } from 'react';

const SYMBOLS = ['*', '~', '♡', '†', '☾', '⚡', '·', '°', '+', 'x', '?', '!', '^', 'bat'];
const DENSITY = 0.15; // Chance of a symbol appearing in a new column
const WIDTH = 60;
const HEIGHT = 4;
const SPEED_MS = 150;

export const AsciiMarquee = () => {
  // Initialize grid with spaces
  const [grid, setGrid] = useState<string[][]>(
    Array(HEIGHT).fill(null).map(() => Array(WIDTH).fill(' '))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(row => [...row]); // Deep copy

        // Shift everything left
        for (let y = 0; y < HEIGHT; y++) {
          for (let x = 0; x < WIDTH - 1; x++) {
            newGrid[y][x] = newGrid[y][x + 1];
          }
        }

        // Generate new rightmost column
        for (let y = 0; y < HEIGHT; y++) {
             // Clear the cell first
             newGrid[y][WIDTH - 1] = ' ';
        }

        // Randomly place a symbol in the new column
        if (Math.random() < DENSITY) {
            const randomY = Math.floor(Math.random() * HEIGHT);
            const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            
            // Special case for "bat" - keeping it simple for now, maybe just a char
            // actually, let's keep it to single chars for now to maintain alignment
            const char = randomSymbol === 'bat' ? '🦇' : randomSymbol;
            newGrid[randomY][WIDTH - 1] = char;
        }

        return newGrid;
      });
    }, SPEED_MS);

    return () => clearInterval(interval);
  }, []);

  // Render grid to string
  const rendered = grid.map(row => row.join('')).join('\n');

  return (
    <pre className="text-xs leading-none text-ectoplasm font-mono whitespace-pre text-left inline-block hidden md:block overflow-hidden select-none">
      {rendered}
    </pre>
  );
};
