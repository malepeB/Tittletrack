import { NextResponse } from 'next/server';
import { localAnswer } from '../../../lib/data';
const SYSTEM = 'You are TitleTrack, a friendly assistant helping South African citizens with title deeds, FLISP housing subsidies, bonds and the Rental Housing Tribunal. Use plain, short language. Give general information, not legal advice, and point to the Deeds Office, NHFC, or a legal advice office when appropriate. If unsure, say so.';
export async function POST(req) {
  const { messages = [] } = await req.json(); const last = messages[messages.length - 1]?.content || '';
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ answer: localAnswer(last) });
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6', max_tokens: 600, system: SYSTEM, messages: messages.slice(-10) }) });
    const j = await res.json(); const t = j.content?.map(c => c.text || '').join('');
    return NextResponse.json({ answer: t || localAnswer(last) });
  } catch { return NextResponse.json({ answer: localAnswer(last) }); }
}
