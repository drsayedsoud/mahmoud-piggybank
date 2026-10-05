import { toHindiNumerals } from './date';
import type { Completion, Withdrawal } from '../types';

export function egpToPiaster(egp: number): number {
  return Math.round(egp * 100);
}

export function piasterToEgp(piasters: number): number {
  return piasters / 100;
}

export function formatMoney(piasters: number): string {
  const egp = piasterToEgp(piasters);
  if (egp === Math.floor(egp)) {
    return toHindiNumerals(egp);
  }
  return toHindiNumerals(egp.toFixed(2));
}

export function getBalance(completions: Completion[], withdrawals: Withdrawal[]): number {
  const earned = completions.reduce((sum, c) => sum + c.points * c.pointValue, 0);
  const withdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  return earned - withdrawn;
}

export function getDayEarnings(completions: Completion[], date: string): number {
  return completions
    .filter((c) => c.date === date)
    .reduce((sum, c) => sum + c.points * c.pointValue, 0);
}
