import Stats, { IStats } from '@/models/Stats';
import { connectDB } from '@/lib/mongoose';

export interface ListStatsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  locale?: 'fa' | 'en';
  category?: string;
  visible?: boolean;
}

export interface CreateStatsData {
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
  order?: number;
  visible?: boolean;
  locale: 'fa' | 'en';
  createdBy: string;
  updatedBy: string;
}

export async function listStats(params: ListStatsParams = {}) {
  await connectDB();
  
  const {
    q,
    page = 1,
    pageSize = 10,
    locale,
    category,
    visible
  } = params;

  const filter: any = {};
  
  if (q) {
    filter.$or = [
      { key: { $regex: q, $options: 'i' } },
      { label: { $regex: q, $options: 'i' } },
      { labelEn: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { descriptionEn: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (locale) filter.locale = locale;
  if (category) filter.category = category;
  if (visible !== undefined) filter.visible = visible;

  const skip = (page - 1) * pageSize;
  
  const [items, total] = await Promise.all([
    Stats.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Stats.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

export async function getStats(id: string) {
  await connectDB();
  return await Stats.findById(id).lean();
}

export async function getStatsByKey(key: string) {
  await connectDB();
  return await Stats.findOne({ key }).lean();
}

export async function createStats(data: CreateStatsData) {
  await connectDB();
  
  const stats = new Stats({
    ...data,
    order: data.order || 0,
    visible: data.visible !== undefined ? data.visible : true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return await stats.save();
}

export async function updateStats(id: string, data: Partial<CreateStatsData>) {
  await connectDB();
  
  return await Stats.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
}

export async function updateStatsByKey(key: string, data: Partial<CreateStatsData>) {
  await connectDB();
  
  return await Stats.findOneAndUpdate(
    { key },
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
}

export async function deleteStats(id: string) {
  await connectDB();
  return await Stats.findByIdAndDelete(id);
}

export async function getVisibleStats(locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    visible: true
  };
  
  if (locale) filter.locale = locale;
  
  return await Stats.find(filter)
    .sort({ order: 1 })
    .lean();
}

export async function getStatsByCategory(category: string, locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    category,
    visible: true
  };
  
  if (locale) filter.locale = locale;
  
  return await Stats.find(filter)
    .sort({ order: 1 })
    .lean();
}

export async function reorderStats(statIds: string[]) {
  await connectDB();
  
  const updates = statIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: index }
    }
  }));
  
  return await Stats.bulkWrite(updates);
}
