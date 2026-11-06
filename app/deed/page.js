'use client';
import Link from 'next/link';
import { useState } from 'react';
import { DEEDS, PROVINCES, FLOW } from '../../lib/data';
export default function Deed() {
  const [p, setP] = useState('Gauteng'), d = DEEDS.find(x => x[3].includes(p.split(' ')[0])) || DEEDS[0];
  return (<div className="wrap"><h2>Title deed status guide</h2><div className="card" style={{ maxWidth: 640 }}><label>Your province</label>
    <select value={p} onChange={e => setP(e.target.value)}>{PROVINCES.map(x => <option key={x}>{x}</option>)}</select>
    <div className="msg ok">Nearest Deeds Office: <b>{d[0]}</b> ({d[3]}). Bring your ID and any proof of ownership.</div>
    <h3>Steps</h3><ol>{FLOW.deed.map(s => <li key={s}>{s}</li>)}</ol><Link className="btn" href="/dashboard">Track this in my dashboard</Link></div></div>);
}
