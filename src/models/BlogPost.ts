import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, },
    excerpt: { type: String, default: '' },
    contentHtml: { type: String, default: '' },
    coverFileId: { type: String },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    author: { type: String },
    locale: { type: String, enum: ['en', 'fa'], required: true, index: true }
  },
  { timestamps: true }
);

export type BlogPostDoc = InferSchemaType<typeof BlogPostSchema>;
// Ensure slug+locale uniqueness if slug is present
try {
  (BlogPostSchema as any).index({ slug: 1, locale: 1 }, { unique: true, sparse: true });
} catch (e) {
  // ignore if index defined elsewhere
}

const BlogPost: Model<BlogPostDoc> = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;
