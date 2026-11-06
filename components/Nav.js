'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
export default function Nav() {
  const [user, setUser] = useState(null), [admin, setAdmin] = useState(false);
  useEffect(() => {
    const check = async u => { setUser(u); if (!u) return setAdmin(false); const p = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle(); setAdmin(p.data?.role === 'admin'); };
    supabase.auth.getSession().then(({ data }) => check(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => check(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  return (<div className="nav"><Link className="logo" href="/">Title<b>Track</b></Link>
    <Link href="/flisp">FLISP</Link><Link href="/deed">Title deed</Link><Link href="/rights">Rights</Link><Link href="/tribunal">Tribunal</Link><Link href="/map">Map</Link><Link href="/tools">Tools</Link><Link href="/assistant">AI help</Link>
    {admin && <Link href="/admin" style={{ color: 'var(--g)', fontWeight: 700 }}>Admin</Link>}
    {user ? (<><Link className="btn" href="/dashboard">Dashboard</Link><button className="btn o" onClick={() => supabase.auth.signOut()}>Log out</button></>)
      : (<><Link className="btn o" href="/login">Log in</Link><Link className="btn" href="/signup">Sign up</Link></>)}</div>);
}
