'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
export default function Letter() {
  const r = useRouter(), [f, setF] = useState({ kind: 'deposit', name: '', recipient: '', details: '' }), [out, setOut] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  useEffect(() => { supabase.auth.getSession().then(async ({ data }) => { const u = data.session?.user; if (!u) return r.push('/login'); const p = await supabase.from('profiles').select('full_name').eq('id', u.id).maybeSingle(); if (p.data?.full_name) setF(x => ({ ...x, name: p.data.full_name })); }); }, [r]);
  async function go() {
    setErr(''); setOut(''); if (f.details.trim().length < 15) return setErr('Please describe the problem in a bit more detail.');
    setBusy(true); const { data } = await supabase.auth.getSession();
    const res = await fetch('/api/letter', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + data.session?.access_token }, body: JSON.stringify(f) });
    const j = await res.json(); setBusy(false); res.ok ? setOut(j.letter) : setErr(j.error || 'Something went wrong.');
  }
  return (<div className="wrap"><h2>AI letter helper</h2><div className="card" style={{ maxWidth: 680 }}>
    <label>Letter type</label><select value={f.kind} onChange={set('kind')}><option value="deposit">Deposit refund demand</option><option value="eviction">Illegal eviction objection</option><option value="deed">Deeds Office title deed request</option></select>
    <label>Your name</label><input value={f.name} onChange={set('name')} /><label>Who is it addressed to?</label><input placeholder="Landlord name or Deeds Office" value={f.recipient} onChange={set('recipient')} />
    <label>What happened? (dates, amounts, address)</label><textarea rows={5} maxLength={2000} value={f.details} onChange={set('details')} />
    <p><button className="btn" onClick={go} disabled={busy}>{busy ? 'Writing…' : 'Write my letter'}</button></p>{err && <div className="msg bad">{err}</div>}
    {out && <><textarea rows={14} value={out} onChange={e => setOut(e.target.value)} /><p><button className="btn o" onClick={() => navigator.clipboard.writeText(out)}>Copy letter</button></p></>}</div></div>);
}
