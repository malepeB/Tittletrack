'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
export default function Login() {
  const r = useRouter(), [em, setEm] = useState(''), [pw, setPw] = useState(''), [err, setErr] = useState('');
  async function go() { const { error } = await supabase.auth.signInWithPassword({ email: em, password: pw }); error ? setErr(error.message) : r.push('/dashboard'); }
  return (<div className="wrap"><div className="card form"><h2 style={{ marginTop: 0 }}>Log in</h2>
    <label>Email</label><input type="email" value={em} onChange={e => setEm(e.target.value)} /><label>Password</label><input type="password" value={pw} onChange={e => setPw(e.target.value)} />
    <p><button className="btn" onClick={go}>Log in</button></p>{err && <div className="msg bad">{err}</div>}
    <p>No account? <Link href="/signup" style={{ color: 'var(--g)' }}>Sign up</Link></p></div></div>);
}
