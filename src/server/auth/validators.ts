import { z } from 'zod';

// Strict validation schemas with comprehensive security checks
export const RegisterSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email too long')
    .toLowerCase()
    .refine((email) => {
      // Additional email validation
      const domain = email.split('@')[1];
      return domain && domain.includes('.') && !domain.startsWith('.') && !domain.endsWith('.');
    }, 'Invalid email domain'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long')
    .refine((password) => {
      // Strong password requirements
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }, 'Password must contain uppercase, lowercase, numbers, and special characters')
    .refine((password) => {
      // Check for common weak patterns
      const commonPatterns = [
        /(.)\1{2,}/, // Repeated characters
        /123|abc|qwe|asd|zxc/i, // Sequential patterns
        /password|123456|qwerty/i // Common passwords
      ];
      return !commonPatterns.some(pattern => pattern.test(password));
    }, 'Password contains weak patterns'),
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Name contains invalid characters')
    .transform((name) => name.trim())
});

export const LoginSchema = z.object({
  email: z.string()
    .email('Invalid email format')
    .toLowerCase()
    .transform((email) => email.trim()),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password too long')
});

// Additional validation schemas for security
export const PasswordResetSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase()
});

export const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long')
    .refine((password) => {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
      return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    }, 'Password must contain uppercase, lowercase, numbers, and special characters')
});

export const UserUpdateSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'Name contains invalid characters')
    .transform((name) => name.trim())
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email too long')
    .toLowerCase()
    .optional()
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;
export type PasswordChangeInput = z.infer<typeof PasswordChangeSchema>;
export type UserUpdateInput = z.infer<typeof UserUpdateSchema>;

