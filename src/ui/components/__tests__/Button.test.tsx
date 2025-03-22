import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { Button } from '../Button';

describe('Button Component', () => {
  it('should render children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });

  it('should handle onClick event', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply default variant style', () => {
    render(<Button>Default Button</Button>);
    expect(screen.getByRole('button').className).toContain('bg-primary');
  });

  it('should apply primary variant style', () => {
    render(<Button variant="default">Primary Button</Button>);
    expect(screen.getByRole('button').className).toContain('bg-primary');
  });

  it('should apply secondary variant style', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    expect(screen.getByRole('button').className).toContain('bg-secondary');
  });

  it('should apply outline variant style', () => {
    render(<Button variant="outline">Outline Button</Button>);
    expect(screen.getByRole('button').className).toContain('border-input');
  });

  it('should apply ghost variant style', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    expect(screen.getByRole('button').className).toContain('hover:bg-accent');
  });

  it('should apply link variant style', () => {
    render(<Button variant="link">Link Button</Button>);
    expect(screen.getByRole('button').className).toContain('underline');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
