"use client";

import React from 'react';
import { Box, IconButton, Drawer, Stack, TextField, Button, Typography, Tooltip, Avatar } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

type Role = 'user' | 'assistant';
type Msg = { role: Role; content: string };

const createMessage = (role: Role, content: string): Msg => ({ role, content });

const DrawerContent = styled(Box)(({ theme }) => ({
  width: 420,
  padding: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: 360
  }
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1),
  height: 360,
  overflowY: 'auto',
  marginBottom: theme.spacing(1)
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'owner'
})<{ owner: Role }>(({ theme, owner }) => ({
  padding: theme.spacing(0.75, 1.25),
  borderRadius: theme.shape.borderRadius * 1.5,
  backgroundColor: owner === 'user' ? theme.palette.primary.main : theme.palette.action.hover,
  color: owner === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  maxWidth: '80%'
}));

export default function AIChatWidget() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [tts, setTts] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    createMessage('assistant', "Hi! I'm your IEEE helper. Ask me about the association, events, or research.")
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
    const next: Msg[] = [...messages, createMessage('user', value)];
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
      const final: Msg[] = [...next, createMessage('assistant', reply)];
      setMessages(final);
      speak(reply);
    } catch (e: any) {
      setMessages((m) => [...m, createMessage('assistant', 'Sorry, something went wrong.')]);
    } finally {
      setBusy(false);
    }
  };

  // Simple mic using Web Speech API (if available)
  const onMic = () => {
    const w = window as any;
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Rec) {
      setMessages((m) => [...m, createMessage('assistant', 'Speech recognition not supported on this browser.')]);
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
    <DrawerContent role="dialog" aria-label="AI Assistant">
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
      <MessagesContainer>
        <Stack spacing={1.5}>
          {messages.map((m, i) => (
            <Stack
              key={i}
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{ justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              {m.role === 'assistant' && <Avatar sx={{ width: 24, height: 24 }}>A</Avatar>}
              <MessageBubble owner={m.role}>{m.content}</MessageBubble>
              {m.role === 'user' && <Avatar sx={{ width: 24, height: 24 }}>U</Avatar>}
            </Stack>
          ))}
        </Stack>
      </MessagesContainer>
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
    </DrawerContent>
  );

  return (
    <>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>{content}</Drawer>
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: theme.zIndex.fab }}>
        <Tooltip title="Chat with IEEE Assistant">
          <IconButton color="primary" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } }} onClick={() => setOpen(true)} aria-label="open ai chat">
            <ChatIcon />
          </IconButton>
        </Tooltip>
      </div>
    </>
  );
}
