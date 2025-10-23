import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  contentHtml: string;
  contentHtmlEn?: string;
  type: 'news' | 'achievement' | 'announcement' | 'publication' | 'award' | 'event';
  category: 'academic' | 'research' | 'social' | 'professional' | 'technical' | 'general';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  priority: 'low' | 'medium' | 'high';
  imageUrl?: string;
  imageAlt?: string;
  imageAltEn?: string;
  tags: string[];
  author: string;
  authorEn?: string;
  publishedAt?: Date;
  locale: 'fa' | 'en';
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  likeCount: number;
  shareCount: number;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true, trim: true },
  titleEn: { type: String, trim: true },
  excerpt: { type: String, required: true, trim: true, maxlength: 500 },
  excerptEn: { type: String, trim: true, maxlength: 500 },
  content: { type: String, required: true, trim: true },
  contentEn: { type: String, trim: true },
  contentHtml: { type: String, required: true },
  contentHtmlEn: { type: String },
  type: { 
    type: String, 
    required: true, 
    enum: ['news', 'achievement', 'announcement', 'publication', 'award', 'event'] 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['academic', 'research', 'social', 'professional', 'technical', 'general'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  priority: { 
    type: String, 
    required: true, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  imageUrl: { type: String, trim: true },
  imageAlt: { type: String, trim: true },
  imageAltEn: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  author: { type: String, required: true, trim: true },
  authorEn: { type: String, trim: true },
  publishedAt: { type: Date },
  locale: { type: String, required: true, enum: ['fa', 'en'] },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true },
  viewCount: { type: Number, default: 0, min: 0 },
  likeCount: { type: Number, default: 0, min: 0 },
  shareCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true,
  collection: 'news'
});

// Indexes for better performance
NewsSchema.index({ status: 1, publishedAt: -1 });
NewsSchema.index({ type: 1, category: 1 });
NewsSchema.index({ locale: 1, status: 1 });
NewsSchema.index({ featured: 1, priority: 1, publishedAt: -1 });
NewsSchema.index({ createdAt: -1 });

export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
