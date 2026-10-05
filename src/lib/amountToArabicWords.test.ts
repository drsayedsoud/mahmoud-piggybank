import { describe, it, expect } from 'vitest';
import { amountToArabicWords } from './amountToArabicWords';

describe('amountToArabicWords', () => {
  it('should handle zero', () => {
    expect(amountToArabicWords(0)).toBe('صفر جنيه');
  });

  it('should handle 1 pound', () => {
    expect(amountToArabicWords(100)).toBe('جنيه واحد');
  });

  it('should handle 2 pounds', () => {
    expect(amountToArabicWords(200)).toBe('جنيهين');
  });

  it('should handle 3-10 pounds', () => {
    expect(amountToArabicWords(300)).toBe('تلات جنيه');
    expect(amountToArabicWords(500)).toBe('خمس جنيه');
    expect(amountToArabicWords(1000)).toBe('عشر جنيه');
  });

  it('should handle teens', () => {
    expect(amountToArabicWords(1100)).toBe('حداشر جنيه');
    expect(amountToArabicWords(1500)).toBe('خمستاشر جنيه');
  });

  it('should handle tens with units', () => {
    expect(amountToArabicWords(2500)).toBe('خمسة وعشرين جنيه');
    expect(amountToArabicWords(3000)).toBe('تلاتين جنيه');
  });

  it('should handle hundreds', () => {
    expect(amountToArabicWords(10000)).toBe('مية جنيه');
    expect(amountToArabicWords(20000)).toBe('ميتين جنيه');
    expect(amountToArabicWords(30000)).toBe('تلتمية جنيه');
  });

  it('should handle thousands', () => {
    expect(amountToArabicWords(100000)).toBe('ألف جنيه');
    expect(amountToArabicWords(200000)).toBe('ألفين جنيه');
    expect(amountToArabicWords(300000)).toBe('تلات تلاف جنيه');
  });

  it('should handle piasters - quarter', () => {
    expect(amountToArabicWords(225)).toBe('جنيهين وربع');
  });

  it('should handle piasters - half', () => {
    expect(amountToArabicWords(550)).toBe('خمس جنيه ونص');
  });

  it('should handle complex amounts', () => {
    expect(amountToArabicWords(2525)).toBe('خمسة وعشرين جنيه وربع');
  });

  it('should handle piasters only', () => {
    expect(amountToArabicWords(50)).toBe('نص');
    expect(amountToArabicWords(25)).toBe('ربع');
  });
});
