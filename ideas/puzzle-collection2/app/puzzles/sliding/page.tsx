'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shuffle, Trophy, Star, Gem } from 'lucide-react';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [stars, setStars] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    shuffleTiles();
  }, []);

  useEffect(() => {
    checkCompletion();
  }, [tiles]);

  const calculateStars = (moves: number) => {
    if (moves <= 20) return 3;
    if (moves <= 30) return 2;
    return 1;
  };

  const shuffleTiles = () => {
    const newTiles = Array.from({ length: CELL_COUNT - 1 }, (_, i) => i + 1);
    newTiles.push(0);
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    setTiles(newTiles);
    setIsComplete(false);
    setMoves(0);
    setShowReward(false);
  };

  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    if (isAdjacent(index, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
    }
  };

  const isAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / GRID_SIZE);
    const col1 = index1 % GRID_SIZE;
    const row2 = Math.floor(index2 / GRID_SIZE);
    const col2 = index2 % GRID_SIZE;
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) ||
      (Math.abs(col1 - col2) === 1 && row1 === row2)
    );
  };

  const checkCompletion = () => {
    const complete = tiles.every((tile, index) => tile === (index + 1) % CELL_COUNT);
    if (complete && !isComplete) {
      setIsComplete(true);
      const earnedStars = calculateStars(moves);
      setStars(earnedStars);
      setShowReward(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#2D9CDB]">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-white">
              <span className="text-gray-400">Moves: </span>
              {moves}
            </div>
            <div className="flex items-center gap-1 bg-[#2D2E3A] rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Best: 3</span>
            </div>
          </div>
        </div>

        <div className="bg-[#252731] rounded-2xl p-6 shadow-lg mb-6">
          <div className="grid grid-cols-4 gap-2">
            {tiles.map((tile, index) => (
              <button
                key={index}
                className={`w-full aspect-square text-xl font-bold rounded-xl transition-all duration-300 ${
                  tile === 0 ? 'bg-[#1E1F25]' : 'bg-[#2D9CDB] text-white hover:bg-[#2D9CDB]/90'
                }`}
                onClick={() => moveTile(index)}
                disabled={tile === 0}
              >
                {tile !== 0 && tile}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={shuffleTiles}
          className="w-full bg-[#252731] hover:bg-[#2D2E3A] text-white rounded-xl h-14"
        >
          <Shuffle className="mr-2 h-5 w-5" /> New Game
        </Button>

        {showReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#252731] rounded-2xl p-8 max-w-sm mx-4 text-center">
              <Trophy className="h-16 w-16 text-[#2D9CDB] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Puzzle Complete!</h2>
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 ${i < stars ? 'text-yellow-400' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <div className="flex justify-center items-center gap-2 mb-6">
                <Gem className="h-5 w-5 text-[#2D9CDB]" />
                <span className="text-xl font-bold">+{stars * 10}</span>
              </div>
              <Button
                onClick={() => setShowReward(false)}
                className="w-full bg-[#2D9CDB] hover:bg-[#2D9CDB]/90 text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
