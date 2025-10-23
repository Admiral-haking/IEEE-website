"use client";

import React from 'react';
import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';

export type TeamMember = { _id: string; name: string; role: string; discipline: 'software'|'hardware'|'networking'; email?: string };

export default function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name.split(' ').map((s) => s[0]).slice(0,2).join('').toUpperCase();
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar variant="circular">{initials}</Avatar>
          <Stack>
            <Typography fontWeight={700}>{member.name}</Typography>
            <Typography variant="body2" color="text.secondary">{member.role}</Typography>
            <Typography variant="caption" color="text.secondary">{member.discipline}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

