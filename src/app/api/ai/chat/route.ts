import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: Array<{ role: 'user'|'assistant'|'system'; content: string }> = body?.messages || [];
    const model: string = body?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const temperature: number = typeof body?.temperature === 'number' ? body.temperature : 0.7;
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model,
      temperature,
      messages,
    });
    const text = completion.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({ text }), { status: 200, headers: { 'content-type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Chat failed' }), { status: 500 });
  }
}

