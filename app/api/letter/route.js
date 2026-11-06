import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const KINDS = { deposit: 'a formal letter demanding refund of a rental deposit plus interest under the Rental Housing Act', eviction: 'a formal letter objecting to an illegal eviction or lockout, stating that only a court can order an eviction, and demanding restored access', deed: 'a formal letter to the Deeds Office requesting a title deed search and registration status for a property' };
function template(kind, name, to, d) {
  const date = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${date}\n\nTo: ${to || 'Whom it may concern'}\n\nRe: ${{ deposit: 'Request for refund of rental deposit', eviction: 'Objection to unlawful eviction', deed: 'Request for title deed search' }[kind]}\n\nDear ${to || 'Sir/Madam'},\n\n${d}\n\nI request your written response within 7 days. I reserve the right to approach the relevant tribunal or court if this is not resolved.\n\nYours faithfully,\n${name}`;
}
export async function POST(req) {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '');
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: { user } } = await sb.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  const { kind, name = '', recipient = '', details = '' } = await req.json();
  if (!KINDS[kind] || details.length < 15 || details.length > 2000) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ letter: template(kind, name, recipient, details) });
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6', max_tokens: 700, system: 'You write short, polite, firm letters for South African citizens. Output only the letter text. Do not invent facts, laws or amounts beyond what the user gives.', messages: [{ role: 'user', content: `Write ${KINDS[kind]}.\nSender: ${name}\nAddressed to: ${recipient}\nDetails: ${details}` }] }) });
    const j = await res.json(); const t = j.content?.map(c => c.text || '').join('');
    return NextResponse.json({ letter: t || template(kind, name, recipient, details) });
  } catch { return NextResponse.json({ letter: template(kind, name, recipient, details) }); }
}
