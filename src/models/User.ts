import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['member', 'user', 'admin'], default: 'user' },
    
    // MFA fields
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String }, // Base32 encoded secret
    mfaBackupCodes: [{ type: String }], // Array of backup codes
    
    // Security fields
    lastLoginAt: { type: Date },
    lastLoginIP: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    
    // Session management
    activeSessions: [{ 
      sessionId: String,
      createdAt: Date,
      lastActivity: Date,
      ipAddress: String,
      userAgent: String
    }]
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

const User: Model<UserDoc> = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

