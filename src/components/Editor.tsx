"use client";

import React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Stack, IconButton, Tooltip, Divider } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import MediaPickerDialog from '@/components/MediaPickerDialog';

export default function Editor({ value, onChange, placeholder }: { value?: string; onChange?: (html: string) => void; placeholder?: string }) {
  const isSettingRef = React.useRef(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: true }),
      Image.configure({ HTMLAttributes: { style: 'max-width: 100%; height: auto;' } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      if (isSettingRef.current) return;
      onChange?.(editor.getHTML());
    }
  });

  // Sync external value into the editor when it changes (e.g., switching tabs or loading data)
  React.useEffect(() => {
    if (!editor) return;
    const next = value || '';
    const curr = editor.getHTML();
    if (next !== curr) {
      isSettingRef.current = true;
      editor.commands.setContent(next, false);
      isSettingRef.current = false;
    }
  }, [value, editor]);

  const [pickerOpen, setPickerOpen] = React.useState(false);
  if (!editor) return null;

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 8 }}>
      <Stack direction="row" spacing={0.5} alignItems="center" style={{ marginBottom: 8, flexWrap: 'wrap' }}>
        <Tooltip title="H1"><IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} color={editor.isActive('heading', { level: 1 }) ? 'primary' : 'default'}>H1</IconButton></Tooltip>
        <Tooltip title="H2"><IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} color={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}>H2</IconButton></Tooltip>
        <Tooltip title="H3"><IconButton size="small" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} color={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}>H3</IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Bold"><IconButton size="small" onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive('bold') ? 'primary' : 'default'}><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton size="small" onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive('italic') ? 'primary' : 'default'}><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Strike"><IconButton size="small" onClick={() => editor.chain().focus().toggleStrike().run()} color={editor.isActive('strike') ? 'primary' : 'default'}><StrikethroughSIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Underline"><IconButton size="small" onClick={() => editor.chain().focus().toggleUnderline().run()} color={editor.isActive('underline') ? 'primary' : 'default'}>U</IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Link"><IconButton size="small" onClick={() => {
          const url = prompt('Enter URL');
          if (!url) return; editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }}><LinkIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Remove link"><IconButton size="small" onClick={() => editor.chain().focus().unsetLink().run()}>X</IconButton></Tooltip>
        <Tooltip title="Insert image"><IconButton size="small" onClick={() => setPickerOpen(true)}><ImageIcon fontSize="small" /></IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Bullet list"><IconButton size="small" onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive('bulletList') ? 'primary' : 'default'}>•</IconButton></Tooltip>
        <Tooltip title="Ordered list"><IconButton size="small" onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive('orderedList') ? 'primary' : 'default'}>1.</IconButton></Tooltip>
        <Tooltip title="Blockquote"><IconButton size="small" onClick={() => editor.chain().focus().toggleBlockquote().run()} color={editor.isActive('blockquote') ? 'primary' : 'default'}>“”</IconButton></Tooltip>
        <Tooltip title="Code block"><IconButton size="small" onClick={() => editor.chain().focus().toggleCodeBlock().run()} color={editor.isActive('codeBlock') ? 'primary' : 'default'}>{'</>'}</IconButton></Tooltip>
        <Tooltip title="Horizontal rule"><IconButton size="small" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Align left"><IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('left').run()}>L</IconButton></Tooltip>
        <Tooltip title="Center"><IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('center').run()}>C</IconButton></Tooltip>
        <Tooltip title="Align right"><IconButton size="small" onClick={() => editor.chain().focus().setTextAlign('right').run()}>R</IconButton></Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Tooltip title="Undo"><IconButton size="small" onClick={() => editor.chain().focus().undo().run()}>↶</IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton size="small" onClick={() => editor.chain().focus().redo().run()}>↷</IconButton></Tooltip>
      </Stack>
      <div style={{ paddingLeft: 8, paddingRight: 8 }}>
        <EditorContent editor={editor} />
      </div>
      <MediaPickerDialog open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(src) => editor.chain().focus().setImage({ src: src.src }).run()} />
    </div>
  );
}
