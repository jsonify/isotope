import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ProgressBarsModal } from '../ProgressBarsModal';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  progressData: {
    anProgress: number;
    awProgress: number;
    glProgress: number;
  };
}

const mockProgressData = {
  anProgress: 50,
  awProgress: 25,
  glProgress: 75,
};

const noop = (): void => {};

const renderModal = (props: ModalProps): void => {
  render(
    <ProgressBarsModal
      open={props.open}
      onOpenChange={props.onOpenChange}
      progressData={props.progressData}
    />
  );
};

describe('ProgressBarsModal Component', (): void => {
  it('should render without errors when closed', (): void => {
    renderModal({
      open: false,
      onOpenChange: noop,
      progressData: mockProgressData,
    });
    expect(document.body).toBeInTheDocument();
  });

  it('should display progress bars for AN, AW, and GL when open', (): void => {
    renderModal({
      open: true,
      onOpenChange: noop,
      progressData: mockProgressData,
    });

    // Check for progress labels
    expect(screen.getByText('Atomic Number (AN)')).toBeInTheDocument();
    expect(screen.getByText('Atomic Weight (AW)')).toBeInTheDocument();
    expect(screen.getByText('Game Lab (GL)')).toBeInTheDocument();

    // Check for progress bars
    expect(screen.getByRole('progressbar', { name: /atomic number/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /atomic weight/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /game lab/i })).toBeInTheDocument();
  });

  it('should display correct progress values', (): void => {
    renderModal({
      open: true,
      onOpenChange: noop,
      progressData: mockProgressData,
    });

    // Check progress bar values
    expect(screen.getByRole('progressbar', { name: /atomic number/i })).toHaveValue(50);
    expect(screen.getByRole('progressbar', { name: /atomic weight/i })).toHaveValue(25);
    expect(screen.getByRole('progressbar', { name: /game lab/i })).toHaveValue(75);

    // Check percentage text display
    const percentageTexts = screen
      .getAllByText(/(25|50|75)%/)
      .filter((element): boolean => element.tagName.toLowerCase() === 'span');
    expect(percentageTexts).toHaveLength(3);
    expect(percentageTexts[0].textContent).toBe('50%');
    expect(percentageTexts[1].textContent).toBe('25%');
    expect(percentageTexts[2].textContent).toBe('75%');
  });

  it('should handle close button click', (): void => {
    const handleOpenChange = vi.fn();
    renderModal({
      open: true,
      onOpenChange: handleOpenChange,
      progressData: mockProgressData,
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('should be accessible', (): void => {
    renderModal({
      open: true,
      onOpenChange: noop,
      progressData: mockProgressData,
    });

    // Check dialog accessibility attributes
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Check progress bars have accessible names
    expect(screen.getByRole('progressbar', { name: /atomic number/i })).toHaveAttribute(
      'aria-label'
    );
    expect(screen.getByRole('progressbar', { name: /atomic weight/i })).toHaveAttribute(
      'aria-label'
    );
    expect(screen.getByRole('progressbar', { name: /game lab/i })).toHaveAttribute('aria-label');
  });
});
