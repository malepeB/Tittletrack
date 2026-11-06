'use client';
import { useState } from 'react';
import { R } from '../../lib/data';
import { calcDeposit } from '../../lib/flisp';
export default function Deposit() {
  const [f, setF] = useState({ d: 5000, r: 6, m: 12, x: 0 }), [out, setOut] = useState(null), set = k => e => setF({ ...f, [k]: +e.target.value });
  return (<div className="wrap"><h2>Rental deposit calculator</h2><div className="card" style={{ maxWidth: 560 }}>
    <label>Deposit paid (R)</label><input type="number" value={f.d} onChange={set('d')} /><label>Interest rate per year (%)</label><input type="number" value={f.r} onChange={set('r')} />
    <label>Months the landlord held it</label><input type="number" value={f.m} onChange={set('m')} /><label>Proven damage costs (R)</label><input type="number" value={f.x} onChange={set('x')} />
    <p><button className="btn" onClick={() => setOut(calcDeposit(f.d, f.r, f.m, f.x))}>Calculate refund</button></p>
    {out && !out.ok && <div className="msg bad">{out.error}</div>}{out?.ok && <><p>Interest earned: {R(out.interest)}</p><p>You should get back</p><div className="big">{R(out.refund)}</div></>}</div>
    <p style={{ color: '#4a5568', fontSize: 14 }}>Simple-interest estimate. Under the Rental Housing Act the landlord must refund within a set period (about 7 to 21 days, depending on the situation). Check the current rules.</p></div>);
}
