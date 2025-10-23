import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const CapabilitySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    area: { type: String, enum: ['software', 'hardware', 'networking', 'devops'], required: true },
    description: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    level: { type: String, enum: ['core', 'advanced', 'expert'], default: 'core' },
    technologies: [{ type: String }],
    icon: { type: String },
    imageFileId: { type: String },
    locale: { type: String, enum: ['en','fa'], required: true, index: true }
  },
  { timestamps: true }
);

try {
  (CapabilitySchema as any).index({ slug: 1, locale: 1 }, { unique: true, sparse: true });
} catch (e) {}

export type CapabilityDoc = InferSchemaType<typeof CapabilitySchema>;

const Capability: Model<CapabilityDoc> = mongoose.models.Capability || mongoose.model('Capability', CapabilitySchema);

export default Capability;
