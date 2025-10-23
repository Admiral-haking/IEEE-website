import { NextRequest } from 'next/server';
import { getBucket, deleteFile } from '@/server/media/gridfs';
import { ObjectId } from 'mongodb';
import { requireAdmin } from '@/server/auth/guard';

function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && id.length === 24;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  
  // Check if the ID is a valid ObjectId
  if (!isValidObjectId(idParam)) {
    return new Response('Invalid media ID format', { status: 400 });
  }
  
  try {
    const id = new ObjectId(idParam);
    const files = await getBucket().find({ _id: id }).toArray();
    if (!files[0]) return new Response('Media not found', { status: 404 });
    const file = files[0];
    const stream = getBucket().openDownloadStream(id);
    const headers = new Headers();
    if (file.contentType) headers.set('Content-Type', file.contentType);
    return new Response(stream as any, { headers });
  } catch (error) {
    console.error('Error fetching media:', error);
    return new Response('Error fetching media', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  await deleteFile(id);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}
