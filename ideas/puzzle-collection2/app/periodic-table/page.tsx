'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gem, Lock } from 'lucide-react';

const elements = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, category: 'nonmetal', unlocked: true },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, category: 'noble-gas', unlocked: true },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, category: 'alkali-metal', unlocked: false },
  {
    symbol: 'Be',
    name: 'Beryllium',
    atomicNumber: 4,
    category: 'alkaline-earth-metal',
    unlocked: false,
  },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, category: 'metalloid', unlocked: false },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, category: 'nonmetal', unlocked: true },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, category: 'nonmetal', unlocked: true },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, category: 'nonmetal', unlocked: true },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, category: 'halogen', unlocked: false },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, category: 'noble-gas', unlocked: false },
  // Add more elements as needed
];

const categoryColors = {
  nonmetal: 'bg-green-500',
  'noble-gas': 'bg-purple-500',
  'alkali-metal': 'bg-red-500',
  'alkaline-earth-metal': 'bg-orange-500',
  metalloid: 'bg-yellow-500',
  halogen: 'bg-blue-500',
  // Add more categories and colors as needed
};

export default function PeriodicTable() {
  const [selectedElement, setSelectedElement] = useState<(typeof elements)[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#1E1F25] text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#2D9CDB]">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Back to Puzzles
            </Button>
          </Link>
          <div className="flex items-center gap-1 bg-[#2D2E3A] rounded-full px-3 py-1">
            <Gem className="h-4 w-4 text-[#2D9CDB]" />
            <span className="text-sm font-medium">240</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">Periodic Table of Elements</h1>

        <div className="grid grid-cols-10 gap-2 mb-8">
          {elements.map(element => (
            <button
              key={element.symbol}
              className={`aspect-square p-2 rounded-lg ${
                element.unlocked
                  ? `${categoryColors[element.category]} text-white`
                  : 'bg-gray-700 text-gray-400'
              } flex flex-col items-center justify-center transition-all hover:scale-105`}
              onClick={() => setSelectedElement(element)}
            >
              <div className="text-xs">{element.atomicNumber}</div>
              <div className="text-2xl font-bold">{element.symbol}</div>
              {!element.unlocked && <Lock className="h-4 w-4 mt-1" />}
            </button>
          ))}
        </div>

        {selectedElement && (
          <div className="bg-[#252731] rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{selectedElement.name}</h2>
            <p className="mb-2">Symbol: {selectedElement.symbol}</p>
            <p className="mb-2">Atomic Number: {selectedElement.atomicNumber}</p>
            <p className="mb-4">Category: {selectedElement.category}</p>
            {!selectedElement.unlocked && (
              <Button className="bg-[#2D9CDB] hover:bg-[#2D9CDB]/90">
                <Gem className="h-4 w-4 mr-2" />
                Unlock for 50 gems
              </Button>
            )}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Element Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(categoryColors).map(([category, color]) => (
              <div key={category} className="flex items-center">
                <div className={`w-6 h-6 rounded-full ${color} mr-2`}></div>
                <span className="capitalize">{category.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
