import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    location: { type: String, default: 'Remote' },
    type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
    descriptionHtml: { type: String, default: '' },
    requirements: [{ type: String }],
    applyLink: { type: String },
    imageFileId: { type: String },
    published: { type: Boolean, default: false },
    locale: { type: String, enum: ['en', 'fa'], required: true, index: true }
  },
  { timestamps: true }
);

export type JobDoc = InferSchemaType<typeof JobSchema>;

// Ensure slug+locale uniqueness if slug is present
try {
  (JobSchema as any).index({ slug: 1, locale: 1 }, { unique: true, sparse: true });
} catch (e) {
  // ignore if index defined elsewhere
}


const Job: Model<JobDoc> = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default Job;
