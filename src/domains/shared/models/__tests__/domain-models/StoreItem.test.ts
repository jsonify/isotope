import { describe, it, expect } from 'vitest';

import type { StoreItem } from '../../domain-models';

describe('StoreItem Interface', () => {
  const testItem: StoreItem = {
    id: 'item-1',
    name: 'Test Item',
    description: 'A test item',
    cost: 100,
    type: 'hint',
  };

  it('should validate store item structure', () => {
    expect(testItem).toHaveProperty('id');
    expect(testItem).toHaveProperty('name');
    expect(testItem).toHaveProperty('description');
    expect(testItem).toHaveProperty('cost');
    expect(testItem).toHaveProperty('type');
  });

  it('should validate item type is one of allowed values', () => {
    expect(['hint', 'powerup', 'gameUnlock', 'cosmetic']).toContain(testItem.type);
  });

  it('should validate cost is positive', () => {
    expect(testItem.cost).toBeGreaterThan(0);
  });
});
