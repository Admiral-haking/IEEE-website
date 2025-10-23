import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const CaseStudySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, },
    summary: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    client: { type: String },
    industry: { type: String },
    coverFileId: { type: String },
    published: { type: Boolean, default: false },
    date: { type: Date },
    locale: { type: String, enum: ['en', 'fa'], required: true, index: true }
  },
  { timestamps: true }
);

// Ensure slug+locale uniqueness if slug is present
try {
  (CaseStudySchema as any).index({ slug: 1, locale: 1 }, { unique: true, sparse: true });
} catch (e) {
  // ignore if index defined elsewhere
}

export type CaseStudyDoc = InferSchemaType<typeof CaseStudySchema>;

const CaseStudy: Model<CaseStudyDoc> = mongoose.models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema);



export default CaseStudy;
