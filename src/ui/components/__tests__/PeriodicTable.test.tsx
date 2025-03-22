import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

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
    const elementContainer = screen.getByRole('button', { name: 'Hydrogen (upcoming)' });
    expect(elementContainer.className).toContain('bg-[#252731]');
    expect(elementContainer.className).toContain('text-gray-500');
    expect(elementContainer.className).toContain('border-dashed');
    expect(elementContainer).toBeDisabled();
  });

  it('should apply "locked" state styling', () => {
    const elements = [
      {
        id: '1',
        symbol: 'H',
        name: 'Hydrogen',
        row: 1,
        column: 1,
        state: 'locked' as const,
        gemCost: 100,
      },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('button', { name: 'Hydrogen (locked)' });
    expect(elementContainer.className).toContain('bg-[#2D2E3A]');
    expect(elementContainer.className).toContain('text-gray-400');
    expect(elementContainer).toBeDisabled();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should apply "current" state styling', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'current' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('button', { name: 'Hydrogen (current)' });
    expect(elementContainer.className).toContain('bg-[#2D9CDB]');
    expect(elementContainer.className).toContain('text-white');
    expect(elementContainer.className).toContain('ring-2');
    expect(elementContainer).not.toBeDisabled();
  });

  it('should apply "completed" state styling', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'completed' as const },
    ];
    render(<MiniPeriodicTable elements={elements} />);
    const elementContainer = screen.getByRole('button', { name: 'Hydrogen (completed)' });
    expect(elementContainer.className).toContain('bg-[#2D9CDB]');
    expect(elementContainer.className).toContain('text-white');
    expect(elementContainer.className).toContain('shadow-lg');
    expect(elementContainer).not.toBeDisabled();
  });

  it('should render elements with path as links', () => {
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
    const elementContainer = screen.getByRole('link', { name: 'Hydrogen (completed)' });
    expect(elementContainer.className).toContain('bg-[#2D9CDB]');
    expect(elementContainer.className).toContain('text-white');
    expect(elementContainer.className).toContain('shadow-lg');
    expect(elementContainer).toHaveAttribute('href', '/element/1');
  });

  it('should render connections between adjacent elements', () => {
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'completed' as const },
      { id: '2', symbol: 'He', name: 'Helium', row: 1, column: 2, state: 'current' as const },
      { id: '3', symbol: 'Li', name: 'Lithium', row: 2, column: 1, state: 'upcoming' as const },
    ];
    const { container } = render(<MiniPeriodicTable elements={elements} />);

    // Find horizontal connection
    const horizontalConnection = container.querySelector('.w-2.h-0\\.5');
    expect(horizontalConnection).toBeInTheDocument();

    // Find vertical connection
    const verticalConnection = container.querySelector('.h-2.w-0\\.5');
    expect(verticalConnection).toBeInTheDocument();
  });

  it('should handle element click events', () => {
    const handleClick = vi.fn();
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'current' as const },
    ];
    render(<MiniPeriodicTable elements={elements} onElementClick={handleClick} />);

    const elementButton = screen.getByRole('button', { name: 'Hydrogen (current)' });
    elementButton.click();
    expect(handleClick).toHaveBeenCalledWith(elements[0]);
  });

  it('should not trigger click events for locked or upcoming elements', () => {
    const handleClick = vi.fn();
    const elements = [
      { id: '1', symbol: 'H', name: 'Hydrogen', row: 1, column: 1, state: 'locked' as const },
      { id: '2', symbol: 'He', name: 'Helium', row: 1, column: 2, state: 'upcoming' as const },
    ];
    render(<MiniPeriodicTable elements={elements} onElementClick={handleClick} />);

    const lockedButton = screen.getByRole('button', { name: 'Hydrogen (locked)' });
    const upcomingButton = screen.getByRole('button', { name: 'Helium (upcoming)' });

    lockedButton.click();
    upcomingButton.click();

    expect(handleClick).not.toHaveBeenCalled();
  });
});
