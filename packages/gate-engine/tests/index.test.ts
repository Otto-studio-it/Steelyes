import { describe, it, expect } from 'vitest';
import { calculatePricePlaceholder } from '../src/index';

describe('gate-engine', () => {
  it('should calculate placeholder price correctly', () => {
    expect(calculatePricePlaceholder(2000, 2000)).toBe(2000000);
  });
});
