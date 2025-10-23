import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  date: Date;
  time: string;
  location?: string;
  locationEn?: string;
  type: 'workshop' | 'seminar' | 'conference' | 'contest' | 'meeting' | 'other';
  category: 'academic' | 'research' | 'social' | 'professional' | 'technical';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  maxParticipants?: number;
  currentParticipants?: number;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string;
  tags: string[];
  contentHtml?: string;
  contentHtmlEn?: string;
  locale: 'fa' | 'en';
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true, trim: true },
  titleEn: { type: String, trim: true },
  description: { type: String, required: true, trim: true },
  descriptionEn: { type: String, trim: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, trim: true },
  locationEn: { type: String, trim: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['workshop', 'seminar', 'conference', 'contest', 'meeting', 'other'] 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['academic', 'research', 'social', 'professional', 'technical'] 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  maxParticipants: { type: Number, min: 1 },
  currentParticipants: { type: Number, default: 0, min: 0 },
  registrationRequired: { type: Boolean, default: false },
  registrationDeadline: { type: Date },
  contactEmail: { type: String, trim: true },
  contactPhone: { type: String, trim: true },
  imageUrl: { type: String, trim: true },
  tags: [{ type: String, trim: true }],
  contentHtml: { type: String },
  contentHtmlEn: { type: String },
  locale: { type: String, required: true, enum: ['fa', 'en'] },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'events'
});

// Indexes for better performance
EventSchema.index({ date: 1, status: 1 });
EventSchema.index({ type: 1, category: 1 });
EventSchema.index({ locale: 1, status: 1 });
EventSchema.index({ createdAt: -1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
