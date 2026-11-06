'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { FLOW, FLOW_TITLES } from '../../lib/data';
export default function Dashboard() {
  const r = useRouter(), [user, setUser] = useState(null), [profile, setProfile] = useState(null), [apps, setApps] = useState({}), [docs, setDocs] = useState([]), [err, setErr] = useState('');
  const load = useCallback(async uid => {
    const p = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle(); setProfile(p.data);
    const a = await supabase.from('applications').select('*').eq('user_id', uid); setApps(Object.fromEntries((a.data || []).map(x => [x.type, x.completed_steps])));
    const d = await supabase.from('documents').select('*').eq('user_id', uid).order('created_at', { ascending: false }); setDocs(d.data || []);
  }, []);
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { const u = data.session?.user; if (!u) return r.push('/login'); setUser(u); load(u.id); }); }, [r, load]);
  async function toggle(t, i) {
    const cur = new Set(apps[t] || []); cur.has(i) ? cur.delete(i) : cur.add(i); const steps = [...cur];
    setApps({ ...apps, [t]: steps });
    const { error } = await supabase.from('applications').upsert({ user_id: user.id, type: t, completed_steps: steps, updated_at: new Date().toISOString() }, { onConflict: 'user_id,type' });
    if (error) setErr(error.message);
  }
  async function upload(e) {
    const file = e.target.files[0]; if (!file) return; setErr('');
    if (file.size > 10 * 1024 * 1024) return setErr('File must be under 10 MB.');
    const path = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`;
    const up = await supabase.storage.from('documents').upload(path, file); if (up.error) return setErr(up.error.message);
    await supabase.from('documents').insert({ user_id: user.id, filename: file.name, storage_path: path }); load(user.id);
  }
  async function open(d) { const { data } = await supabase.storage.from('documents').createSignedUrl(d.storage_path, 60); if (data) window.open(data.signedUrl, '_blank'); }
  async function del(d) { await supabase.storage.from('documents').remove([d.storage_path]); await supabase.from('documents').delete().eq('id', d.id); load(user.id); }
  if (!user) return <div className="wrap">Loading…</div>;
  return (<div className="wrap"><h2>Welcome, {profile?.full_name?.split(' ')[0] || 'there'}</h2>{err && <div className="msg bad">{err}</div>}
    <div className="grid"><div className="card"><h3>Your profile</h3><p>{user.email}<br />{profile?.situation}<br />ID {profile?.id_masked} · {profile?.dob} · {profile?.gender} · {profile?.citizenship}</p></div>
      <div className="card"><h3>Document vault</h3><p>Private, encrypted storage. Only you can open your files.</p><input type="file" onChange={upload} />
        {docs.map(d => <div className="chk" key={d.id}><span style={{ flex: 1 }}>{d.filename}</span><button className="btn o" onClick={() => open(d)}>Open</button><button className="btn o" onClick={() => del(d)}>Delete</button></div>)}</div></div>
    {Object.keys(FLOW).map(t => { const done = (apps[t] || []).length, pct = Math.round(done / FLOW[t].length * 100);
      return (<div className="card" key={t} style={{ marginTop: 18 }}><h3>{FLOW_TITLES[t]} — {pct}%</h3><div className="bar"><i style={{ width: pct + '%' }} /></div>
        {FLOW[t].map((s, i) => <label className="chk" key={i} style={{ margin: 0, fontWeight: 400 }}><input type="checkbox" checked={(apps[t] || []).includes(i)} onChange={() => toggle(t, i)} />{s}</label>)}</div>); })}</div>);
}
