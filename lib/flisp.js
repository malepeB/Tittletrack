export const DEFAULT_FLISP = { min: 3501, max: 22000, top: 130500, bottom: 27960 };
// Indicative linear estimate between the top and bottom of the income band. Admins can edit the numbers.
export function calcFlisp(income, firstTime, c = DEFAULT_FLISP) {
  if (!Number.isFinite(income)) return { ok: false, error: 'Enter a valid income.' };
  if (!firstTime) return { ok: false, error: 'FLISP is for first-time buyers only.' };
  if (income < c.min || income > c.max) return { ok: false, error: `Income is outside the R${c.min} – R${c.max} range. Not eligible.` };
  return { ok: true, subsidy: c.top - (income - c.min) / (c.max - c.min) * (c.top - c.bottom) };
}
export function calcDeposit(deposit, ratePct, months, damages = 0) {
  if (![deposit, ratePct, months, damages].every(Number.isFinite) || deposit <= 0 || ratePct < 0 || months < 0 || damages < 0) return { ok: false, error: 'Enter valid positive numbers.' };
  const interest = deposit * ratePct / 100 * months / 12;
  return { ok: true, interest, refund: Math.max(0, deposit + interest - damages) };
}
