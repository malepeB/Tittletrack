'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { R } from '../../lib/data';
import { calcFlisp, DEFAULT_FLISP } from '../../lib/flisp';
import { supabase } from '../../lib/supabase';
export default function Flisp() {
  const [inc, setInc] = useState(9000), [ftb, setFtb] = useState('Yes'), [out, setOut] = useState(null), [cfg, setCfg] = useState(DEFAULT_FLISP);
  useEffect(() => { supabase.from('settings').select('value').eq('key', 'flisp').maybeSingle().then(({ data }) => data && setCfg(data.value)); }, []);
  return (<div className="wrap"><h2>FLISP eligibility calculator</h2><div className="card" style={{ maxWidth: 560 }}>
    <label>Gross monthly household income (R)</label><input type="number" value={inc} onChange={e => setInc(+e.target.value)} />
    <label>First-time buyer?</label><select value={ftb} onChange={e => setFtb(e.target.value)}><option>Yes</option><option>No</option></select>
    <p><button className="btn" onClick={() => setOut(calcFlisp(inc, ftb === 'Yes', cfg))}>Calculate</button></p>
    {out && !out.ok && <div className="msg bad">{out.error}</div>}{out?.ok && <><p>Estimated subsidy</p><div className="big">{R(out.subsidy)}</div><Link className="btn" href="/dashboard">Start FLISP application</Link></>}</div>
    <p style={{ color: '#4a5568', fontSize: 14 }}>Indicative estimate for income between {R(cfg.min)} and {R(cfg.max)}. The final amount is set by NHFC.</p></div>);
}
