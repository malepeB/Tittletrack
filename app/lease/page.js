'use client';
import Link from 'next/link';
import { useState } from 'react';
const C = [['My landlord can lock me out or cut water or power if I am late', 'Lockouts and service cuts without a court order are unlawful.'], ['The landlord can enter at any time without notice', 'Landlords must give reasonable notice before entering.'], ['My deposit is not refundable', 'Deposits must be refunded with interest, less proven damage.'], ['Rent can go up at any time without notice', 'Rent changes need proper notice as set in the lease and the Act.'], ['I must pay for all structural repairs', 'Structural and maintenance duties normally fall on the landlord.']];
export default function Lease() {
  const [on, setOn] = useState([]), [done, setDone] = useState(false), tog = i => setOn(on.includes(i) ? on.filter(x => x !== i) : [...on, i]);
  return (<div className="wrap"><h2>Lease checker</h2><div className="card" style={{ maxWidth: 640 }}><p>Tick every statement that appears in your lease.</p>
    {C.map((c, i) => <label className="chk" key={i} style={{ margin: 0, fontWeight: 400 }}><input type="checkbox" checked={on.includes(i)} onChange={() => { tog(i); setDone(false); }} />{c[0]}</label>)}
    <p><button className="btn" onClick={() => setDone(true)}>Check my lease</button></p>
    {done && (on.length ? <>{on.map(i => <div className="msg bad" key={i}><b>Possible problem:</b> {C[i][1]}</div>)}<p>See the <Link href="/rights" style={{ color: 'var(--g)' }}>Rights library</Link> or <Link href="/tribunal" style={{ color: 'var(--g)' }}>file a tribunal complaint</Link>.</p></> : <div className="msg ok">None of these common problem clauses were ticked.</div>)}</div></div>);
}
