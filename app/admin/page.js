'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { logAudit } from '../../lib/audit';
import { DEFAULT_FLISP } from '../../lib/flisp';
export default function Admin() {
  const r = useRouter(), [ok, setOk] = useState(null), [tab, setTab] = useState('articles'), [arts, setArts] = useState([]), [edit, setEdit] = useState(null), [cfg, setCfg] = useState(DEFAULT_FLISP), [logs, setLogs] = useState([]), [fb, setFb] = useState([]), [users, setUsers] = useState(0), [msg, setMsg] = useState('');
  const load = useCallback(async () => {
    setArts((await supabase.from('articles').select('*').order('updated_at', { ascending: false })).data || []);
    const s = await supabase.from('settings').select('value').eq('key', 'flisp').maybeSingle(); if (s.data) setCfg(s.data.value);
    setLogs((await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(50)).data || []);
    setFb((await supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(50)).data || []);
    setUsers((await supabase.from('profiles').select('id', { count: 'exact', head: true })).count || 0);
  }, []);
  useEffect(() => { (async () => { const { data } = await supabase.auth.getSession(), u = data.session?.user; if (!u) return r.push('/login');
    const p = await supabase.from('profiles').select('role').eq('id', u.id).maybeSingle(); if (p.data?.role === 'admin') { setOk(true); load(); } else setOk(false); })(); }, [r, load]);
  async function save() {
    if (!edit.title?.trim() || !edit.body?.trim()) return setMsg('Title and body are required.');
    const row = { title: edit.title.trim(), keywords: edit.keywords || '', body: edit.body.trim(), published: edit.published !== false, updated_at: new Date().toISOString() }; if (edit.id) row.id = edit.id;
    const { error } = await supabase.from('articles').upsert(row); if (error) return setMsg(error.message);
    await logAudit(edit.id ? 'article_update' : 'article_create', row.title); setEdit(null); setMsg('Saved.'); load();
  }
  async function del(a) { if (!confirm(`Delete "${a.title}"?`)) return; await supabase.from('articles').delete().eq('id', a.id); await logAudit('article_delete', a.title); load(); }
  async function saveCfg() {
    const v = { min: +cfg.min, max: +cfg.max, top: +cfg.top, bottom: +cfg.bottom };
    if (!Object.values(v).every(Number.isFinite) || v.min >= v.max || v.bottom > v.top) return setMsg('Check the numbers: min must be below max and bottom must not exceed top.');
    const { error } = await supabase.from('settings').upsert({ key: 'flisp', value: v, updated_at: new Date().toISOString() }); if (error) return setMsg(error.message);
    await logAudit('flisp_settings_update', JSON.stringify(v)); setMsg('FLISP settings saved.'); load();
  }
  if (ok === null) return <div className="wrap">Loading…</div>;
  if (!ok) return <div className="wrap"><div className="msg bad">Access denied. This page is for administrators only.</div></div>;
  const avg = fb.length ? (fb.reduce((s, x) => s + x.rating, 0) / fb.length).toFixed(1) : '–';
  return (<div className="wrap"><h2>Admin dashboard</h2>
    <div className="grid" style={{ marginBottom: 18 }}><div className="card"><p>Registered users</p><div className="big">{users}</div></div><div className="card"><p>Articles</p><div className="big">{arts.length}</div></div><div className="card"><p>Average rating</p><div className="big">{avg}</div></div></div>
    <p>{['articles', 'flisp', 'feedback', 'audit'].map(t => <button key={t} className={'btn ' + (tab === t ? '' : 'o')} style={{ marginRight: 8 }} onClick={() => { setTab(t); setMsg(''); }}>{t}</button>)}</p>{msg && <div className="msg ok">{msg}</div>}
    {tab === 'articles' && (edit ? <div className="card"><label>Title</label><input value={edit.title || ''} onChange={e => setEdit({ ...edit, title: e.target.value })} /><label>Search keywords</label><input value={edit.keywords || ''} onChange={e => setEdit({ ...edit, keywords: e.target.value })} />
      <label>Body</label><textarea rows={6} value={edit.body || ''} onChange={e => setEdit({ ...edit, body: e.target.value })} /><label className="chk" style={{ fontWeight: 400 }}><input type="checkbox" checked={edit.published !== false} onChange={e => setEdit({ ...edit, published: e.target.checked })} />Published</label>
      <p><button className="btn" onClick={save}>Save</button> <button className="btn o" onClick={() => setEdit(null)}>Cancel</button></p></div>
      : <><p><button className="btn" onClick={() => setEdit({ published: true })}>New article</button></p>{arts.map(a => <div className="card" key={a.id} style={{ marginBottom: 10 }}><b>{a.title}</b> {!a.published && '(hidden)'}<p>{a.body}</p><button className="btn o" onClick={() => setEdit(a)}>Edit</button> <button className="btn o" onClick={() => del(a)}>Delete</button></div>)}</>)}
    {tab === 'flisp' && <div className="card" style={{ maxWidth: 480 }}>{[['min', 'Minimum monthly income (R)'], ['max', 'Maximum monthly income (R)'], ['top', 'Subsidy at minimum income (R)'], ['bottom', 'Subsidy at maximum income (R)']].map(([k, l]) => <div key={k}><label>{l}</label><input type="number" value={cfg[k]} onChange={e => setCfg({ ...cfg, [k]: e.target.value })} /></div>)}<p><button className="btn" onClick={saveCfg}>Save settings</button></p></div>}
    {tab === 'feedback' && fb.map(x => <div className="card" key={x.id} style={{ marginBottom: 10 }}><b>{x.rating} / 5</b> <span style={{ color: '#4a5568' }}>{new Date(x.created_at).toLocaleString('en-ZA')}</span><p>{x.comment || '—'}</p></div>)}
    {tab === 'audit' && <div className="card">{logs.map(l => <div className="chk" key={l.id}><span style={{ width: 170 }}>{new Date(l.created_at).toLocaleString('en-ZA')}</span><b style={{ width: 190 }}>{l.action}</b><span>{l.detail}</span></div>)}{!logs.length && 'No activity yet.'}</div>}</div>);
}
