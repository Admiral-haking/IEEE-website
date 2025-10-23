import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const TeamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    role: { type: String, required: true },
    discipline: { type: String, enum: ['software', 'hardware', 'networking'], required: true },
    email: { type: String },
    avatarUrl: { type: String },
    location: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    socials: {
      github: String,
      linkedin: String,
      twitter: String,
      website: String
    },
    portfolioLink: { type: String },
    resumeFileId: { type: String },
    locale: { type: String, enum: ['en','fa'], required: true, index: true }
  },
  { timestamps: true }
);

// Ensure slug+locale uniqueness if slug is present
try {
  (TeamMemberSchema as any).index({ slug: 1, locale: 1 }, { unique: true, sparse: true });
} catch (e) {
  // ignore if index defined elsewhere
}

export type TeamMemberDoc = InferSchemaType<typeof TeamMemberSchema>;

const TeamMember: Model<TeamMemberDoc> =
  mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);

export default TeamMember;
