'use client';
import { useState, useRef, useEffect } from 'react';
export default function Assistant() {
  const [msgs, setMsgs] = useState([{ r: 'a', t: 'Hi! Ask me about title deeds, FLISP, evictions, deposits or tribunals.' }]), [q, setQ] = useState(''), [busy, setBusy] = useState(false), box = useRef(null);
  useEffect(() => { box.current.scrollTop = 1e9; }, [msgs]);
  async function ask(text) {
    if (!text.trim() || busy) return; setQ(''); setBusy(true); const next = [...msgs, { r: 'u', t: text }]; setMsgs(next);
    try { const res = await fetch('/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(1).map(m => ({ role: m.r === 'u' ? 'user' : 'assistant', content: m.t })) }) });
      const j = await res.json(); setMsgs([...next, { r: 'a', t: j.answer || 'Something went wrong.' }]);
    } catch { setMsgs([...next, { r: 'a', t: 'Network error. Please try again.' }]); } setBusy(false);
  }
  return (<div className="wrap"><h2>AI assistant</h2><div className="chat" ref={box}>{msgs.map((m, i) => <div key={i} className={'m ' + m.r}>{m.t}</div>)}{busy && <div className="m">Thinking…</div>}</div>
    <div style={{ display: 'flex', gap: 8 }}><input placeholder="Type your question…" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask(q)} /><button className="btn" onClick={() => ask(q)}>Send</button></div>
    <p style={{ color: '#4a5568', fontSize: 14 }}>General guidance only, not legal advice.</p></div>);
}
