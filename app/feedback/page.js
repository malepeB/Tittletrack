'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
export default function Feedback() {
  const [rating, setRating] = useState(5), [comment, setComment] = useState(''), [msg, setMsg] = useState(null);
  async function send() {
    const { data } = await supabase.auth.getSession(); if (!data.session) return setMsg(['bad', 'Please log in to send feedback.']);
    const { error } = await supabase.from('feedback').insert({ rating, comment: comment.trim().slice(0, 1000) });
    setMsg(error ? ['bad', error.message] : ['ok', 'Thank you for your feedback!']); if (!error) setComment('');
  }
  return (<div className="wrap"><div className="card form"><h2 style={{ marginTop: 0 }}>Feedback</h2><label>Rating</label>
    <select value={rating} onChange={e => setRating(+e.target.value)}>{[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} / 5</option>)}</select>
    <label>Comments</label><textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} /><p><button className="btn" onClick={send}>Send</button></p>{msg && <div className={'msg ' + msg[0]}>{msg[1]}</div>}</div></div>);
}
