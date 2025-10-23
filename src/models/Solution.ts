import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const SolutionSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    category: { type: String, enum: ['software', 'hardware', 'networking'], required: true },
    summary: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    features: [{ type: String }],
    tags: [{ type: String }],
    link: { type: String },
    imageFileId: { type: String },
    locale: { type: String, enum: ['en','fa'], required: true, index: true },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

try {
  (SolutionSchema as any).index({ slug: 1, locale: 1 }, { unique: true, sparse: true });
} catch (e) {}

export type SolutionDoc = InferSchemaType<typeof SolutionSchema>;

const Solution: Model<SolutionDoc> = mongoose.models.Solution || mongoose.model('Solution', SolutionSchema);

export default Solution;
