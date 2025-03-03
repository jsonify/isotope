import { describe, it, expect } from 'vitest';

import testData from '../../../test-data';
import type { Element } from '../../domain-models';

describe('Element Interface', () => {
  const testElement: Element = testData.elements[0]; // Hydrogen

  it('should have valid element properties', () => {
    expect(testElement).toHaveProperty('symbol');
    expect(testElement).toHaveProperty('name');
    expect(testElement).toHaveProperty('atomicNumber');
    expect(testElement).toHaveProperty('atomicWeight');
    expect(testElement).toHaveProperty('period');
    expect(testElement).toHaveProperty('group');
  });

  it('should validate element data types', () => {
    expect(typeof testElement.symbol).toBe('string');
    expect(typeof testElement.name).toBe('string');
    expect(typeof testElement.atomicNumber).toBe('number');
    expect(typeof testElement.atomicWeight).toBe('number');
    expect(typeof testElement.period).toBe('number');
    expect(typeof testElement.group).toBe('number');
    if (testElement.description !== null && testElement.description !== undefined) {
      expect(typeof testElement.description).toBe('string');
    }
  });
});
