'use client';
import { useEffect, useState } from 'react';
import { RIGHTS } from '../../lib/data';
import { supabase } from '../../lib/supabase';
export default function Rights() {
  const [all, setAll] = useState(RIGHTS), [q, setQ] = useState('');
  useEffect(() => { supabase.from('articles').select('title,keywords,body').eq('published', true).then(({ data }) => { if (data?.length) setAll(data.map(a => ({ t: a.title, k: a.keywords, b: a.body }))); }); }, []);
  const list = all.filter(r => (r.t + r.k + r.b).toLowerCase().includes(q.toLowerCase()));
  return (<div className="wrap"><h2>Rights library</h2><input placeholder="Search e.g. deposit, eviction, deed…" value={q} onChange={e => setQ(e.target.value)} />
    <div className="grid" style={{ marginTop: 18 }}>{list.map(r => <div className="card" key={r.t}><h3>{r.t}</h3><p>{r.b}</p></div>)}{!list.length && <p>No articles found.</p>}</div></div>);
}
