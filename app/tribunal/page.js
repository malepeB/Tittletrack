'use client';
import { useEffect, useState } from 'react';
import { PROVINCES } from '../../lib/data';
import { supabase } from '../../lib/supabase';
export default function Tribunal() {
  const [f, setF] = useState({ name: '', landlord: '', address: '', p: 'Gauteng', t: 'Illegal eviction', desc: '' }), [out, setOut] = useState(false), [err, setErr] = useState(''), set = k => e => setF({ ...f, [k]: e.target.value });
  useEffect(() => { supabase.auth.getSession().then(async ({ data }) => { const u = data.session?.user; if (!u) return; const p = await supabase.from('profiles').select('full_name').eq('id', u.id).maybeSingle(); if (p.data?.full_name) setF(x => ({ ...x, name: p.data.full_name })); }); }, []);
  function gen() { setErr(''); if (!f.name.trim() || !f.address.trim() || f.desc.trim().length < 10) return setErr('Fill in your name, the property address and a short description (10+ characters).'); setOut(true); }
  async function pdf() {
    const { jsPDF } = await import('jspdf'), d = new jsPDF(); let y = 22; d.setFontSize(16); d.text('Rental Housing Tribunal complaint', 20, y); d.setFontSize(11); y += 12;
    [`Tribunal: ${f.p} Rental Housing Tribunal`, `Date: ${new Date().toLocaleDateString('en-ZA')}`, `Complainant: ${f.name}`, `Landlord / agent: ${f.landlord || 'Not provided'}`, `Property: ${f.address}`, `Dispute type: ${f.t}`, 'Description:', f.desc, '', 'Attach: lease agreement, proof of payments, photos or messages.'].forEach(l => { const w = d.splitTextToSize(l, 170); d.text(w, 20, y); y += w.length * 6 + 3; });
    d.save('tribunal-complaint.pdf');
  }
  return (<div className="wrap"><h2>Rental Housing Tribunal referral</h2><div className="card" style={{ maxWidth: 600 }}>
    <label>Your full name</label><input value={f.name} onChange={set('name')} /><label>Landlord or agent name</label><input value={f.landlord} onChange={set('landlord')} /><label>Property address</label><input value={f.address} onChange={set('address')} />
    <label>Province</label><select value={f.p} onChange={set('p')}>{PROVINCES.map(x => <option key={x}>{x}</option>)}</select>
    <label>Dispute type</label><select value={f.t} onChange={set('t')}>{['Illegal eviction', 'Deposit not refunded', 'Unfair rent increase', 'Repairs not done'].map(x => <option key={x}>{x}</option>)}</select>
    <label>Describe the problem</label><textarea rows={4} value={f.desc} onChange={set('desc')} /><p><button className="btn" onClick={gen}>Generate complaint summary</button></p>{err && <div className="msg bad">{err}</div>}
    {out && <><div className="msg ok"><b>Refer to:</b> {f.p} Rental Housing Tribunal<br /><b>Dispute:</b> {f.t}<br /><b>Property:</b> {f.address}<br /><b>Details:</b> {f.desc}</div><p><button className="btn" onClick={pdf}>Download complaint PDF</button></p></>}</div></div>);
}
