import '@/lib/mongoose';
import mongoose from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import securityConfig from '@/config/security';
import { AppError } from '@/server/errors';

let bucket: GridFSBucket | null = null;

export function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('DB not connected');
  if (!bucket) bucket = new GridFSBucket(db, { bucketName: 'media' });
  return bucket;
}

export async function saveBase64File(name: string, contentType: string, base64: string, meta: Record<string, any> = {}) {
  const normalizedBase64 = base64.includes(',') ? base64.split(',').pop() || '' : base64;
  const data = Buffer.from(normalizedBase64, 'base64');

  if (!data.length && normalizedBase64.length) {
    throw new AppError('Invalid file data', 400);
  }

  const maxFileSize = securityConfig.upload?.maxFileSize ?? 10 * 1024 * 1024;
  if (data.length > maxFileSize) {
    throw new AppError('File too large', 413);
  }

  const allowedTypes = securityConfig.upload?.allowedTypes;
  if (Array.isArray(allowedTypes) && allowedTypes.length > 0 && !allowedTypes.includes(contentType)) {
    throw new AppError('Unsupported media type', 415);
  }

  const uploadStream = getBucket().openUploadStream(name, { contentType, metadata: meta });
  uploadStream.end(data);
  const file = await new Promise<any>((resolve, reject) => {
    uploadStream.on('error', reject);
    uploadStream.on('finish', resolve);
  });
  return file; // includes _id
}

export async function listFiles(limit = 50, skip = 0) {
  const files = await getBucket().find({}, { limit, skip, sort: { uploadDate: -1 } }).toArray();
  return files;
}

export async function deleteFile(id: string) {
  await getBucket().delete(new ObjectId(id));
}
