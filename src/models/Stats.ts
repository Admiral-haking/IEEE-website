import mongoose, { Schema, Document } from 'mongoose';

export interface IStats extends Document {
  key: string;
  value: number | string;
  label: string;
  labelEn?: string;
  description?: string;
  descriptionEn?: string;
  category: 'members' | 'projects' | 'publications' | 'events' | 'achievements' | 'general';
  type: 'number' | 'text' | 'percentage' | 'currency';
  unit?: string;
  unitEn?: string;
  icon?: string;
  color?: string;
  order: number;
  visible: boolean;
  locale: 'fa' | 'en';
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const StatsSchema = new Schema<IStats>({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: Schema.Types.Mixed, required: true },
  label: { type: String, required: true, trim: true },
  labelEn: { type: String, trim: true },
  description: { type: String, trim: true },
  descriptionEn: { type: String, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['members', 'projects', 'publications', 'events', 'achievements', 'general'] 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['number', 'text', 'percentage', 'currency'] 
  },
  unit: { type: String, trim: true },
  unitEn: { type: String, trim: true },
  icon: { type: String, trim: true },
  color: { type: String, trim: true },
  order: { type: Number, required: true, default: 0 },
  visible: { type: Boolean, default: true },
  locale: { type: String, required: true, enum: ['fa', 'en'] },
  createdBy: { type: String, required: true },
  updatedBy: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'stats'
});

// Indexes for better performance
StatsSchema.index({ category: 1, order: 1 });
StatsSchema.index({ locale: 1, visible: 1 });
StatsSchema.index({ key: 1 });

export default mongoose.models.Stats || mongoose.model<IStats>('Stats', StatsSchema);
