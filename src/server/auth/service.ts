import { connectDB } from '@/lib/mongoose'; // تابعی برای اتصال به DB
import User from '@/models/User';
import { AppError, UnauthorizedError } from '@/server/errors';
import { LoginInput, RegisterInput } from './validators';
import { comparePassword, hashPassword } from './hash';
import { 
  signAccessToken, 
  signRefreshToken, 
  TokenPayload, 
  RefreshTokenPayload, 
  generateJTI,
  blacklistToken,
  isTokenBlacklisted
} from './jwt';
import { getScopesForRole } from './scopes';

export async function registerUser(input: RegisterInput) {
  // اتصال به دیتابیس
  await connectDB();

  const exists = await User.findOne({ email: input.email }).lean();
  if (exists) throw new AppError('Email already registered', 409);

  const passwordHash = await hashPassword(input.password);
  const count = await User.countDocuments();
  const role: 'admin' | 'user' | 'member' = count === 0 ? 'admin' : 'user';

  const created = await User.create({
    email: input.email,
    name: input.name,
    passwordHash,
    role,
  });

  const jti = generateJTI();
  const scopes = getScopesForRole(created.role);
  const accessPayload: TokenPayload = {
    sub: String(created._id),
    role: created.role as any,
    email: created.email,
    jti,
    scope: scopes,
  };
  
  const refreshPayload: RefreshTokenPayload = {
    sub: String(created._id),
    jti,
    type: 'refresh'
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = signRefreshToken(refreshPayload);

  return {
    user: {
      id: String(created._id),
      email: created.email,
      name: created.name,
      role: created.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function loginUser(input: LoginInput) {
  // اتصال به دیتابیس
  await connectDB();

  const user = await User.findOne({ email: input.email });
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Invalid credentials');

  const jti = generateJTI();
  const scopes = getScopesForRole(user.role);
  const accessPayload: TokenPayload = {
    sub: String(user._id),
    role: user.role as any,
    email: user.email,
    jti,
    scope: scopes,
  };
  
  const refreshPayload: RefreshTokenPayload = {
    sub: String(user._id),
    jti,
    type: 'refresh'
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = signRefreshToken(refreshPayload);

  return {
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshUserTokens(refreshToken: string) {
  await connectDB();
  
  try {
    const { verifyRefreshToken, signAccessToken, signRefreshToken, generateJTI } = await import('./jwt');
    const payload = verifyRefreshToken(refreshToken);
    
    // Check if token is blacklisted
    if (isTokenBlacklisted(payload.jti)) {
      throw new UnauthorizedError('Token has been revoked');
    }
    
    // Get user to ensure they still exist
    const user = await User.findById(payload.sub);
    if (!user) throw new UnauthorizedError('User not found');
    
    // Generate new tokens with new JTI (token rotation)
    const newJti = generateJTI();
    
    // Blacklist old refresh token
    blacklistToken(payload.jti);
    
    const scopes = getScopesForRole(user.role);
    const newAccessPayload: TokenPayload = {
      sub: String(user._id),
      role: user.role as any,
      email: user.email,
      jti: newJti,
      scope: scopes,
    };
    
    const newRefreshPayload: RefreshTokenPayload = {
      sub: String(user._id),
      jti: newJti,
      type: 'refresh'
    };

    const newAccessToken = signAccessToken(newAccessPayload);
    const newRefreshToken = signRefreshToken(newRefreshPayload);

    return {
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
}

export async function logoutUser(accessToken: string, refreshToken: string) {
  try {
    const { verifyAccessToken, verifyRefreshToken, blacklistToken } = await import('./jwt');
    
    // Blacklist both tokens
    const accessPayload = verifyAccessToken(accessToken);
    const refreshPayload = verifyRefreshToken(refreshToken);
    
    blacklistToken(accessPayload.jti!);
    blacklistToken(refreshPayload.jti);
    
    return { success: true };
  } catch (error) {
    // Even if tokens are invalid, consider logout successful
    return { success: true };
  }
}
