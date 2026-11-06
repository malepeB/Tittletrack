'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { checkID } from '../../lib/idcheck';
export default function Signup() {
  const r = useRouter(), [f, setF] = useState({ name: '', email: '', id: '', sit: 'Renter', pw: '' }), [msg, setMsg] = useState(null);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  async function go() {
    const v = checkID(f.id.trim());
    if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email)) return setMsg(['bad', 'Enter your name and a valid email.']);
    if (!v.ok) return setMsg(['bad', v.error]);
    if (f.pw.length < 8) return setMsg(['bad', 'Password needs 8+ characters.']);
    const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.pw, options: { data: { full_name: f.name.trim(), id_masked: '*********' + f.id.slice(9), dob: v.dob, gender: v.gender, citizenship: v.citizenship, situation: f.sit } } });
    if (error) return setMsg(['bad', error.message]);
    if (data.session) r.push('/dashboard'); else setMsg(['ok', 'Account created. Check your email to confirm, then log in.']);
  }
  return (<div className="wrap"><div className="card form"><h2 style={{ marginTop: 0 }}>Create account</h2>
    <label>Full name</label><input value={f.name} onChange={set('name')} /><label>Email</label><input type="email" value={f.email} onChange={set('email')} />
    <label>South African ID number</label><input inputMode="numeric" maxLength={13} value={f.id} onChange={set('id')} />
    <label>I am a…</label><select value={f.sit} onChange={set('sit')}><option>RDP / home owner</option><option>Renter</option><option>First-time buyer</option></select>
    <label>Password (8+ characters)</label><input type="password" value={f.pw} onChange={set('pw')} />
    <p><button className="btn" onClick={go}>Sign up</button></p>{msg && <div className={'msg ' + msg[0]}>{msg[1]}</div>}
    <p>Have an account? <Link href="/login" style={{ color: 'var(--g)' }}>Log in</Link></p></div></div>);
}
