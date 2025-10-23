"use client";

import React from 'react';
import { Box, IconButton, Badge, Drawer, Stack, TextField, Button, Typography, Tooltip, Avatar } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

type Msg = { role: 'user'|'assistant'; content: string };

export default function AIChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [tts, setTts] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: 'assistant', content: 'Hi! I\'m your IEEE helper. Ask me about the association, events, or research.' }
  ]);

  const speak = (text: string) => {
    if (!tts || typeof window === 'undefined') return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const onAsk = async () => {
    const value = input.trim();
    if (!value || busy) return;
    const next = [...messages, { role: 'user', content: value } as Msg];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      const reply = (data?.text as string) || '…';
      const final = [...next, { role: 'assistant', content: reply } as Msg];
      setMessages(final);
      speak(reply);
    } catch (e: any) {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setBusy(false);
    }
  };

  // Simple mic using Web Speech API (if available)
  const onMic = () => {
    const w = window as any;
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Rec) {
      setMessages(m => [...m, { role: 'assistant', content: 'Speech recognition not supported on this browser.' }]);
      return;
    }
    const rec = new Rec();
    rec.lang = document?.documentElement?.lang || 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev: any) => {
      const text = ev.results?.[0]?.[0]?.transcript || '';
      setInput(text);
    };
    rec.start();
  };

  const preset = (q: string) => {
    setInput(q);
  };

  const content = (
    <Box sx={{ width: { xs: 360, sm: 420 }, p: 2 }} role="dialog" aria-label="AI Assistant">
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight={700}>IEEE Assistant</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={tts ? 'Voice: on' : 'Voice: off'}>
            <IconButton size="small" onClick={() => setTts(v => !v)}><VolumeUpIcon fontSize="small" /></IconButton>
          </Tooltip>
          <IconButton size="small" onClick={() => setOpen(false)} aria-label="close"><CloseIcon fontSize="small" /></IconButton>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
        {['What is IEEE at QUT?', 'Upcoming events', 'How to join?', 'Research groups'].map((p) => (
          <Button key={p} onClick={() => preset(p)} size="small" variant="outlined">{p}</Button>
        ))}
      </Stack>
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1, height: 360, overflowY: 'auto', mb: 1 }}>
        <Stack spacing={1.5}>
          {messages.map((m, i) => (
            <Stack key={i} direction="row" spacing={1} alignItems="flex-start" sx={{ justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'assistant' && <Avatar sx={{ width: 24, height: 24 }}>A</Avatar>}
              <Box sx={{ px: 1.25, py: 0.75, borderRadius: 1.5, bgcolor: m.role === 'user' ? 'primary.main' : 'action.hover', color: m.role === 'user' ? 'primary.contrastText' : 'text.primary', maxWidth: '80%' }}>{m.content}</Box>
              {m.role === 'user' && <Avatar sx={{ width: 24, height: 24 }}>U</Avatar>}
            </Stack>
          ))}
        </Stack>
      </Box>
      <Stack direction="row" spacing={1}>
        <TextField
          placeholder="Type your question…"
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAsk(); }}
          disabled={busy}
        />
        <Tooltip title="Voice input">
          <span>
            <IconButton onClick={onMic} disabled={busy}><MicIcon /></IconButton>
          </span>
        </Tooltip>
        <Button variant="contained" endIcon={<SendIcon />} onClick={onAsk} disabled={busy || !input.trim()}>Send</Button>
      </Stack>
    </Box>
  );

  return (
    <>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>{content}</Drawer>
      <Box sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: (theme: any) => theme.zIndex.fab }}>
        <Tooltip title="Chat with IEEE Assistant">
          <IconButton color="primary" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }} onClick={() => setOpen(true)} aria-label="open ai chat">
            <ChatIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}
