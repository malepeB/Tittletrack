// Validates a South African ID: 13 digits, real birth date, citizenship digit, Luhn checksum.
export function checkID(id) {
  if (!/^\d{13}$/.test(id)) return { ok: false, error: 'ID must be exactly 13 digits.' };
  const yy = +id.slice(0, 2), mm = +id.slice(2, 4), dd = +id.slice(4, 6);
  const year = (yy > new Date().getFullYear() % 100 ? 1900 : 2000) + yy;
  const d = new Date(year, mm - 1, dd);
  if (d.getMonth() !== mm - 1 || d.getDate() !== dd) return { ok: false, error: 'The birth date inside this ID is not valid.' };
  if (!'01'.includes(id[10])) return { ok: false, error: 'Citizenship digit must be 0 or 1.' };
  let sum = 0;
  for (let i = 0; i < 13; i++) { let n = +id[12 - i]; if (i % 2) { n *= 2; if (n > 9) n -= 9; } sum += n; }
  if (sum % 10) return { ok: false, error: 'Checksum failed. Please re-check the number.' };
  return { ok: true, dob: d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }),
    gender: +id.slice(6, 10) >= 5000 ? 'Male' : 'Female', citizenship: id[10] === '0' ? 'SA citizen' : 'Permanent resident' };
}
