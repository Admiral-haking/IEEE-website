import { getAccessTokenFromCookies, isTokenBlacklisted } from './jwt';
import { UnauthorizedError } from '@/server/errors';
import { hasScope, hasAnyScope, hasAllScopes } from './scopes';

export async function requireAdmin() {
  const token = await getAccessTokenFromCookies();
  
  // Check if token is blacklisted
  if (token.jti && isTokenBlacklisted(token.jti)) {
    throw new UnauthorizedError('Token has been revoked');
  }
  
  if (token.role !== 'admin') throw new UnauthorizedError('Admin only');
  
  // Check admin scope
  if (!hasScope(token.scope, 'admin:read')) {
    throw new UnauthorizedError('Insufficient permissions');
  }
  
  return token;
}

const roleRank: Record<'member'|'user'|'admin', number> = {
  member: 1,
  user: 2,
  admin: 3
};

export async function requireMinRole(min: 'member'|'user'|'admin') {
  const token = await getAccessTokenFromCookies();
  
  // Check if token is blacklisted
  if (token.jti && isTokenBlacklisted(token.jti)) {
    throw new UnauthorizedError('Token has been revoked');
  }
  
  if (roleRank[token.role] < roleRank[min]) throw new UnauthorizedError('Insufficient role');
  return token;
}

export async function requireMember() {
  return requireMinRole('member');
}

export async function requireUserOrAdmin() {
  return requireMinRole('user');
}

// Scope-based authorization functions
export async function requireScope(requiredScope: string) {
  const token = await getAccessTokenFromCookies();
  
  // Check if token is blacklisted
  if (token.jti && isTokenBlacklisted(token.jti)) {
    throw new UnauthorizedError('Token has been revoked');
  }
  
  if (!hasScope(token.scope, requiredScope)) {
    throw new UnauthorizedError(`Insufficient scope. Required: ${requiredScope}`);
  }
  
  return token;
}

export async function requireAnyScope(requiredScopes: string[]) {
  const token = await getAccessTokenFromCookies();
  
  // Check if token is blacklisted
  if (token.jti && isTokenBlacklisted(token.jti)) {
    throw new UnauthorizedError('Token has been revoked');
  }
  
  if (!hasAnyScope(token.scope, requiredScopes)) {
    throw new UnauthorizedError(`Insufficient scope. Required one of: ${requiredScopes.join(', ')}`);
  }
  
  return token;
}

export async function requireAllScopes(requiredScopes: string[]) {
  const token = await getAccessTokenFromCookies();
  
  // Check if token is blacklisted
  if (token.jti && isTokenBlacklisted(token.jti)) {
    throw new UnauthorizedError('Token has been revoked');
  }
  
  if (!hasAllScopes(token.scope, requiredScopes)) {
    throw new UnauthorizedError(`Insufficient scope. Required all of: ${requiredScopes.join(', ')}`);
  }
  
  return token;
}
