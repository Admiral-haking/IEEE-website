import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import * as crypto from 'crypto';
import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';
import { AppError, UnauthorizedError } from '@/server/errors';

export interface MFASecret {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface MFASetupResult {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
  tempToken: string; // Temporary token for verification
}

// Generate MFA secret for user
export async function generateMFASecret(userId: string): Promise<MFASetupResult> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  // Generate secret
  const secret = speakeasy.generateSecret({
    name: `Hippogriff (${user.email})`,
    issuer: 'Hippogriff Engineering',
    length: 32
  });
  
  // Generate backup codes
  const backupCodes = generateBackupCodes(10);
  
  // Generate QR code
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
  
  // Store temporary secret (will be confirmed later)
  user.mfaSecret = secret.base32;
  user.mfaBackupCodes = backupCodes;
  user.mfaEnabled = false; // Not enabled until verified
  await user.save();
  
  // Generate temporary token for verification
  const tempToken = generateTempToken(userId);
  
  return {
    secret: secret.base32!,
    qrCodeUrl,
    backupCodes,
    tempToken
  };
}

// Verify MFA setup
export async function verifyMFASetup(userId: string, token: string, tempToken: string): Promise<boolean> {
  await connectDB();
  
  // Verify temp token
  if (!verifyTempToken(tempToken, userId)) {
    throw new UnauthorizedError('Invalid temporary token');
  }
  
  const user = await User.findById(userId);
  if (!user || !user.mfaSecret) throw new AppError('MFA not set up', 400);
  
  // Verify TOTP token
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: token,
    window: 2 // Allow 2 time windows (60 seconds)
  });
  
  if (verified) {
    user.mfaEnabled = true;
    await user.save();
    return true;
  }
  
  return false;
}

// Verify MFA token during login
export async function verifyMFAToken(userId: string, token: string): Promise<boolean> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user || !user.mfaEnabled || !user.mfaSecret) {
    throw new AppError('MFA not enabled', 400);
  }
  
  // Check if it's a backup code
  if (user.mfaBackupCodes.includes(token)) {
    // Remove used backup code
    user.mfaBackupCodes = user.mfaBackupCodes.filter(code => code !== token);
    await user.save();
    return true;
  }
  
  // Verify TOTP token
  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  return verified;
}

// Disable MFA
export async function disableMFA(userId: string, password: string): Promise<boolean> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  
  // Verify password before disabling MFA
  const { comparePassword } = await import('./hash');
  const passwordValid = await comparePassword(password, user.passwordHash);
  if (!passwordValid) {
    throw new UnauthorizedError('Invalid password');
  }
  
  user.mfaEnabled = false;
  user.mfaSecret = undefined;
  user.mfaBackupCodes = [];
  await user.save();
  
  return true;
}

// Generate new backup codes
export async function regenerateBackupCodes(userId: string): Promise<string[]> {
  await connectDB();
  
  const user = await User.findById(userId);
  if (!user || !user.mfaEnabled) {
    throw new AppError('MFA not enabled', 400);
  }
  
  const newBackupCodes = generateBackupCodes(10);
  user.mfaBackupCodes = newBackupCodes;
  await user.save();
  
  return newBackupCodes;
}

// Check if user has MFA enabled
export async function isMFAEnabled(userId: string): Promise<boolean> {
  await connectDB();
  
  const user = await User.findById(userId);
  return user?.mfaEnabled || false;
}

// Generate backup codes
function generateBackupCodes(count: number): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.add(code);
  }
  return Array.from(codes);
}

// Generate temporary token for MFA setup
function generateTempToken(userId: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  return Buffer.from(`${userId}:${timestamp}:${random}`).toString('base64');
}

// Verify temporary token
function verifyTempToken(token: string, userId: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [tokenUserId, timestamp] = decoded.split(':');
    
    // Check if token is for correct user and not expired (10 minutes)
    const tokenAge = Date.now() - parseInt(timestamp);
    return tokenUserId === userId && tokenAge < 10 * 60 * 1000;
  } catch {
    return false;
  }
}
