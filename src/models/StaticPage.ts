import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const StaticPageSchema = new Schema(
  {
    key: { type: String, enum: ['privacy', 'terms', 'contact'], required: true, index: true },
    locale: { type: String, enum: ['en', 'fa'], required: true, index: true },
    contentHtml: { type: String, default: '' },
    // Contact-specific fields (used when key === 'contact')
    contact: {
      phone: String,
      email: String,
      address: String,
      mapEmbedUrl: String,
      openingHours: String,
      socials: {
        twitter: String,
        linkedin: String,
        github: String,
        telegram: String,
        whatsapp: String,
        website: String
      }
    }
  },
  { timestamps: true, strict: false }
);

export type StaticPageDoc = InferSchemaType<typeof StaticPageSchema>;

StaticPageSchema.index({ key: 1, locale: 1 }, { unique: true });

const StaticPage: Model<StaticPageDoc> =
  mongoose.models?.StaticPage || mongoose.model('StaticPage', StaticPageSchema);

export default StaticPage;

