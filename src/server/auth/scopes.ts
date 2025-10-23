// Scope definitions for role-based access control
export const SCOPES = {
  // User scopes
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  
  // Admin scopes
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
  ADMIN_DELETE: 'admin:delete',
  ADMIN_USERS: 'admin:users',
  ADMIN_SETTINGS: 'admin:settings',
  ADMIN_ANALYTICS: 'admin:analytics',
  
  // Content scopes
  CONTENT_READ: 'content:read',
  CONTENT_WRITE: 'content:write',
  CONTENT_DELETE: 'content:delete',
  CONTENT_PUBLISH: 'content:publish',
  
  // Media scopes
  MEDIA_READ: 'media:read',
  MEDIA_WRITE: 'media:write',
  MEDIA_DELETE: 'media:delete',
  
  // API scopes
  API_READ: 'api:read',
  API_WRITE: 'api:write',
  API_ADMIN: 'api:admin',
  
  // Security scopes
  SECURITY_READ: 'security:read',
  SECURITY_WRITE: 'security:write',
  SECURITY_ADMIN: 'security:admin',
  
  // MFA scopes
  MFA_READ: 'mfa:read',
  MFA_WRITE: 'mfa:write',
  MFA_ADMIN: 'mfa:admin'
} as const;

// Role-based scope mappings
export const ROLE_SCOPES: Record<string, string[]> = {
  member: [
    SCOPES.USER_READ,
    SCOPES.CONTENT_READ,
    SCOPES.MEDIA_READ,
    SCOPES.API_READ
  ],
  
  user: [
    SCOPES.USER_READ,
    SCOPES.USER_WRITE,
    SCOPES.CONTENT_READ,
    SCOPES.CONTENT_WRITE,
    SCOPES.MEDIA_READ,
    SCOPES.MEDIA_WRITE,
    SCOPES.API_READ,
    SCOPES.API_WRITE,
    SCOPES.MFA_READ,
    SCOPES.MFA_WRITE
  ],
  
  admin: [
    // All scopes
    ...Object.values(SCOPES)
  ]
};

// Get scopes for a role
export function getScopesForRole(role: string): string[] {
  return ROLE_SCOPES[role] || ROLE_SCOPES.member;
}

// Check if token has required scope
export function hasScope(tokenScopes: string[], requiredScope: string): boolean {
  return tokenScopes.includes(requiredScope);
}

// Check if token has any of the required scopes
export function hasAnyScope(tokenScopes: string[], requiredScopes: string[]): boolean {
  return requiredScopes.some(scope => tokenScopes.includes(scope));
}

// Check if token has all required scopes
export function hasAllScopes(tokenScopes: string[], requiredScopes: string[]): boolean {
  return requiredScopes.every(scope => tokenScopes.includes(scope));
}

// Scope validation middleware
export function requireScope(scope: string) {
  return (tokenScopes: string[]) => {
    if (!hasScope(tokenScopes, scope)) {
      throw new Error(`Insufficient scope. Required: ${scope}`);
    }
  };
}

export function requireAnyScope(scopes: string[]) {
  return (tokenScopes: string[]) => {
    if (!hasAnyScope(tokenScopes, scopes)) {
      throw new Error(`Insufficient scope. Required one of: ${scopes.join(', ')}`);
    }
  };
}

export function requireAllScopes(scopes: string[]) {
  return (tokenScopes: string[]) => {
    if (!hasAllScopes(tokenScopes, scopes)) {
      throw new Error(`Insufficient scope. Required all of: ${scopes.join(', ')}`);
    }
  };
}
