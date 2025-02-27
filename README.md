# Isotope: React. Solve. Evolve.

An educational puzzle game that uses the periodic table as a theme for progression.

## Features

- Progress through the periodic table as you solve puzzles
- Multiple game modes that unlock as you advance
- Earn electrons as currency to unlock features and power-ups
- Educational content that makes learning chemistry fun

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/isotope.git
   cd isotope
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Start the development server

   ```
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Architecture

The project follows Domain-Driven Design principles with clear separation of concerns:

- **Player Domain**: Handles progression system and player profiles
- **Puzzle Domain**: Manages puzzle generation and evaluation
- **Economy Domain**: Controls electron currency and store items
- **UI Layer**: Presents the game state and handles user interaction

## License

This project is licensed under the MIT License - see the LICENSE file for details.
