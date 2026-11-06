'use client';
import { useEffect, useState } from 'react';
export default function Boot() {
  const [big, setBig] = useState(false), [hc, setHc] = useState(false);
  useEffect(() => {
    try { setBig(localStorage.getItem('tt_big') === '1'); setHc(localStorage.getItem('tt_hc') === '1'); } catch (e) {}
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('big', big); document.documentElement.classList.toggle('hc', hc);
    try { localStorage.setItem('tt_big', big ? '1' : '0'); localStorage.setItem('tt_hc', hc ? '1' : '0'); } catch (e) {}
  }, [big, hc]);
  return (<div className="a11y" role="group" aria-label="Accessibility options">
    <button onClick={() => setBig(!big)} aria-pressed={big} title="Larger text">A+</button>
    <button onClick={() => setHc(!hc)} aria-pressed={hc} title="High contrast">◐</button></div>);
}
