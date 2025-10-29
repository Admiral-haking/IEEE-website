"use client";

import React from "react";
import {
  Box,
  IconButton,
  Drawer,
  Stack,
  TextField,
  Button,
  Typography,
  Tooltip,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Mic as MicIcon,
  VolumeUp as VolumeUpIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";

type Msg = { role: "user" | "assistant"; content: string };

export default function AIChatWidget() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createTheme({
    palette: {
      mode: prefersDark ? "dark" : "light",
      primary: { main: prefersDark ? "#8b5cf6" : "#5A67D8" },
    },
  });

  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [tts, setTts] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your IEEE helper. How can I assist you today?" },
  ]);
  const [typing, setTyping] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const speak = (text: string) => {
    if (!tts || typeof window === "undefined") return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  const playPop = () => {
    try {
      const audio = new Audio("/sounds/pop.mp3"); // فایل صدای کوتاه پاپ
      audio.volume = 0.25;
      audio.play().catch(() => {});
    } catch {}
  };

  const onAsk = async () => {
    const value = input.trim();
    if (!value || busy) return;
    setInput("");
    const next = [...messages, { role: "user", content: value }];
    setMessages(next);
    playPop();
    setBusy(true);
    setTyping(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data?.text || "…";
      await new Promise((r) => setTimeout(r, 1500)); // تاخیر کوتاه برای نمایش تایپ
      setTyping(false);
      const final = [...next, { role: "assistant", content: reply }];
      setMessages(final);
      playPop();
      speak(reply);
    } catch {
      setTyping(false);
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Something went wrong." }]);
    } finally {
      setBusy(false);
    }
  };

  const onMic = () => {
    const w = window as any;
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Rec) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Speech recognition not supported on this browser." },
      ]);
      return;
    }
    const rec = new Rec();
    rec.lang = "en-US";
    rec.onresult = (ev: any) => setInput(ev.results?.[0]?.[0]?.transcript || "");
    rec.start();
  };

  return (
    <ThemeProvider theme={theme}>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          sx={{
            width: { xs: 370, sm: 430 },
            p: 2.5,
            backdropFilter: "blur(18px)",
            borderRadius: 3,
            background: prefersDark
              ? "rgba(25,25,35,0.65)"
              : "rgba(255,255,255,0.45)",
            border: prefersDark
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(0,0,0,0.1)",
            boxShadow: prefersDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(80,80,180,0.25)",
          }}
        >
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                background: prefersDark
                  ? "linear-gradient(90deg, #a78bfa, #6366f1)"
                  : "linear-gradient(90deg, #5A67D8, #805AD5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              IEEE Assistant
            </Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title={tts ? "Voice: on" : "Voice: off"}>
                <IconButton size="small" onClick={() => setTts((v) => !v)}>
                  <VolumeUpIcon fontSize="small" color={tts ? "primary" : "inherit"} />
                </IconButton>
              </Tooltip>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Messages */}
          <Box
            sx={{
              borderRadius: 3,
              p: 1.5,
              height: 400,
              overflowY: "auto",
              mb: 2,
              background: prefersDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.03)",
            }}
          >
            <Stack spacing={1.5}>
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                      sx={{
                        justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      {m.role === "assistant" && (
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: prefersDark ? "#6366f1" : "#5A67D8",
                            color: "white",
                          }}
                        >
                          A
                        </Avatar>
                      )}
                      <Box
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderRadius: 3,
                          bgcolor:
                            m.role === "user"
                              ? prefersDark
                                ? "linear-gradient(135deg,#7C3AED,#5B21B6)"
                                : "linear-gradient(135deg,#5A67D8,#805AD5)"
                              : prefersDark
                                ? "rgba(255,255,255,0.12)"
                                : "rgba(255,255,255,0.75)",
                          color:
                            m.role === "user"
                              ? "#fff"
                              : prefersDark
                                ? "#e0e0e0"
                                : "#222",
                          maxWidth: "80%",
                          boxShadow: prefersDark
                            ? "0 2px 6px rgba(0,0,0,0.5)"
                            : "0 2px 8px rgba(150,150,250,0.3)",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {m.content}
                      </Box>
                      {m.role === "user" && (
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: prefersDark ? "#10B981" : "#48BB78",
                            color: "white",
                          }}
                        >
                          U
                        </Avatar>
                      )}
                    </Stack>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: prefersDark ? "#6366f1" : "#5A67D8",
                      color: "white",
                    }}
                  >
                    A
                  </Avatar>
                  <Box sx={{ display: "flex", gap: 0.5, pl: 1 }}>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: prefersDark ? "#c4b5fd" : "#5A67D8",
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
              )}
              <div ref={bottomRef} />
            </Stack>
          </Box>

          {/* Input */}
          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="Type your question…"
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAsk()}
              disabled={busy}
            />
            <Tooltip title="Voice input">
              <span>
                <IconButton onClick={onMic} disabled={busy}>
                  <MicIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={onAsk}
              disabled={busy || !input.trim()}
              sx={{
                background: prefersDark
                  ? "linear-gradient(135deg,#7C3AED,#5B21B6)"
                  : "linear-gradient(135deg,#5A67D8,#805AD5)",
                borderRadius: 2,
              }}
            >
              Send
            </Button>
          </Stack>
        </Box>
      </Drawer>

      {/* Floating Chat Button */}
      <Box sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 1500 }}>
        <Tooltip title="Chat with IEEE Assistant">
          <IconButton
            sx={{
              background: prefersDark
                ? "linear-gradient(135deg,#7C3AED,#5B21B6)"
                : "linear-gradient(135deg,#5A67D8,#805AD5)",
              color: "white",
              width: 56,
              height: 56,
              boxShadow: "0 6px 20px rgba(90,103,216,0.5)",
            }}
            onClick={() => setOpen(true)}
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </ThemeProvider>
  );
}
