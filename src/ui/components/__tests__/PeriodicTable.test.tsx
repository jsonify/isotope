import { render, screen } from '@testing-library/react';

import { MiniPeriodicTable } from '../PeriodicTable';

describe('PeriodicTable Component', () => {
  it('should render without errors', () => {
    render(<MiniPeriodicTable elements={[]} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should render basic grid structure', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'upcoming' as const },
      { id: '2', symbol: 'He', name: 'Helium', row: 1, column: 18, state: 'upcoming' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const grid = screen.getByRole('grid');
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBeGreaterThanOrEqual(2); // Should render at least 2 elements
  });

  it('should display element data (symbol and name)', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'upcoming' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    expect(screen.getByText('H')).toBeInTheDocument(); // Check for symbol
    expect(screen.getByText('Hydrogen')).toBeInTheDocument(); // Check for name
  });

  it('should apply "upcoming" state styling', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'upcoming' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    // Look for the button containing the element (since no path is provided)
    const elementContainer = screen.getByRole('button', { name: /H.*Hydrogen/i });
    expect(elementContainer.className).toContain('bg-[#252731]');
    expect(elementContainer.className).toContain('text-gray-500');
    expect(elementContainer.className).toContain('border-dashed');
  });

  it('should apply "locked" state styling', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'locked' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('button', { name: /H.*Hydrogen/i });
    expect(elementContainer.className).toContain('bg-[#2D2E3A]');
    expect(elementContainer.className).toContain('text-gray-400');
  });

  it('should apply "current" state styling', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'current' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('button', { name: /H.*Hydrogen/i });
    expect(elementContainer.className).toContain('bg-[#2D9CDB]');
    expect(elementContainer.className).toContain('text-white');
    expect(elementContainer.className).toContain('ring-2');
  });

  it('should apply "completed" state styling', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'completed' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('button', { name: /H.*Hydrogen/i });
    expect(elementContainer.className).toContain('bg-[#2D9CDB]');
    expect(elementContainer.className).toContain('text-white');
    expect(elementContainer.className).toContain('shadow-lg');
  });

  // Add test for elements with path (Link variant)
  it('should apply styling to elements with path', () => {
    const elements = [
      {
        id: '1',
        symbol: 'H',
        name: 'Hydrogen',
        row: 1,
        column: 1,
        state: 'completed' as const,
        path: '/element/1',
      },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('link', { name: /H.*Hydrogen/i });
    expect(elementContainer.className).toContain('bg-[#2D9CDB]');
    expect(elementContainer.className).toContain('text-white');
    expect(elementContainer.className).toContain('shadow-lg');
  });
});
