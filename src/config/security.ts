// Security configuration for the application
export const securityConfig = {
  // JWT Configuration
  jwt: {
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '7d',
    issuer: 'hippogriff',
    audience: 'hippogriff-app'
  },

  // Password Requirements
  password: {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90, // days
    historyCount: 5 // prevent reuse of last 5 passwords
  },

  // Rate Limiting
  rateLimits: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5
    },
    strictAuth: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3
    },
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3
    }
  },

  // Session Configuration
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const
  },

  // CORS Configuration
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourdomain.com' // Add your production domain
    ],
    credentials: true,
    maxAge: 86400 // 24 hours
  },

  // Content Security Policy
  csp: {
    mode: process.env.CSP_MODE || 'report-only', // 'enforce' or 'report-only'
    directives: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com"],
      'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      'font-src': ["'self'", "https://fonts.gstatic.com"],
      'img-src': ["'self'", "data:", "blob:", "https:"],
      'connect-src': ["'self'", "https://api.example.com"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'worker-src': ["'self'"],
      'manifest-src': ["'self'"]
    }
  },

  // Database Security
  database: {
    connectionTimeout: 10000,
    maxPoolSize: 10,
    ssl: process.env.NODE_ENV === 'production',
    authSource: 'admin'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    endpoint: process.env.LOGGING_ENDPOINT,
    token: process.env.LOGGING_TOKEN,
    retentionDays: 30
  },

  // Security Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },

  // File Upload Security
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    scanForMalware: true,
    quarantineSuspicious: true
  },

  // Monitoring and Alerting
  monitoring: {
    alertOnFailedLogins: 5, // Alert after 5 failed logins
    alertOnSuspiciousActivity: true,
    alertOnRateLimitExceeded: true,
    alertOnSecurityEvents: true
  }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
  securityConfig.session.secure = true;
  securityConfig.cors.allowedOrigins = [
    'https://yourdomain.com' // Replace with your actual domain
  ];
  securityConfig.csp.mode = 'enforce';
}

export default securityConfig;
