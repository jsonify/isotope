'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Brain, Puzzle, HomeIcon, Trophy, Settings, Gem, Flame, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('Logic');

  return (
    <main className="min-h-screen bg-[#1E1F25] text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#252731] border-b border-gray-800 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#2D2E3A] rounded-full px-3 py-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">3</span>
                <span className="text-xs text-gray-400 ml-1">days</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-[#2D2E3A] rounded-full px-3 py-1">
                <Gem className="h-4 w-4 text-[#2D9CDB]" />
                <span className="text-sm font-medium">240</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-md mx-auto">
          {/* Category Selection */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {['Logic', 'Memory', 'Speed'].map(category => (
              <button
                key={category}
                className={`p-4 rounded-xl text-center transition-all ${
                  category === selectedCategory
                    ? 'bg-[#2D9CDB] text-white'
                    : 'bg-[#252731] text-gray-400 hover:bg-[#2D2E3A]'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {selectedCategory === 'Memory' ? (
            <div className="bg-[#252731] rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Memory Games</h2>
              <Link href="/periodic-table" className="block">
                <Button className="w-full bg-[#2D9CDB] hover:bg-[#2D9CDB]/90 text-white">
                  Periodic Table Challenge
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium">Section 1</h2>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <span className="text-[#2D9CDB]">2</span>/3 completed
                </div>
              </div>

              {/* Journey Path */}
              <div className="relative">
                {/* Connection Lines */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2D2E3A] -translate-x-1/2" />

                {/* Completed Puzzle */}
                <div className="relative z-10 mb-12">
                  <div className="flex flex-col items-center">
                    <Link
                      href="/puzzles/sliding"
                      className="block w-16 h-16 rounded-full bg-[#2D9CDB] flex items-center justify-center mb-2 shadow-lg shadow-[#2D9CDB]/20"
                    >
                      <Puzzle className="h-8 w-8 text-white" />
                    </Link>
                    <div className="flex gap-1 mb-1">
                      <div className="w-4 h-4 text-yellow-400">★</div>
                      <div className="w-4 h-4 text-yellow-400">★</div>
                      <div className="w-4 h-4 text-yellow-400">★</div>
                    </div>
                    <span className="text-sm font-medium">Basic Sliding</span>
                    <span className="text-xs text-gray-400">Completed</span>
                  </div>
                </div>

                {/* Current Puzzle */}
                <div className="relative z-10 mb-12">
                  <div className="flex flex-col items-center">
                    <Link
                      href="/puzzles/sliding-advanced"
                      className="block relative w-16 h-16 rounded-full bg-[#2D9CDB] flex items-center justify-center mb-2 shadow-lg shadow-[#2D9CDB]/20"
                    >
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#252731] border-4 border-[#1E1F25] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#2D9CDB] animate-pulse" />
                      </div>
                      <Puzzle className="h-8 w-8 text-white" />
                    </Link>
                    <span className="text-sm font-medium">Advanced Sliding</span>
                    <span className="text-xs text-[#2D9CDB]">In Progress</span>
                  </div>
                </div>

                {/* Locked Puzzle */}
                <div className="relative z-10 mb-12">
                  <div className="flex flex-col items-center opacity-75">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-[#2D2E3A] flex items-center justify-center mb-2">
                        <Brain className="h-8 w-8 text-gray-600" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#2D2E3A] rounded-full px-2 py-0.5 border border-gray-700">
                        <Gem className="h-3 w-3 text-[#2D9CDB]" />
                        <span className="text-xs font-medium">100</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-400">Expert Sliding</span>
                    <span className="text-xs text-gray-500">Locked</span>
                  </div>
                </div>

                {/* Next Section Preview */}
                <div className="relative z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#252731] border-2 border-dashed border-gray-600 flex items-center justify-center mb-2">
                      <ChevronRight className="h-8 w-8 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">Section 2</span>
                    <span className="text-xs text-gray-500">Coming Soon</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#252731] border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-4">
            <Button variant="ghost" className="text-[#2D9CDB]">
              <HomeIcon className="h-6 w-6" />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-[#2D9CDB]">
              <Trophy className="h-6 w-6" />
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-[#2D9CDB]">
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    </main>
  );
}
