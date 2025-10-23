import News, { INews } from '@/models/News';
import { connectDB } from '@/lib/mongoose';

export interface ListNewsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  locale?: 'fa' | 'en';
  type?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  priority?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CreateNewsData {
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
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  priority?: 'low' | 'medium' | 'high';
  imageUrl?: string;
  imageAlt?: string;
  imageAltEn?: string;
  tags?: string[];
  author: string;
  authorEn?: string;
  publishedAt?: Date;
  locale: 'fa' | 'en';
  createdBy: string;
  updatedBy: string;
}

export async function listNews(params: ListNewsParams = {}) {
  await connectDB();
  
  const {
    q,
    page = 1,
    pageSize = 10,
    locale,
    type,
    category,
    status,
    featured,
    priority,
    dateFrom,
    dateTo
  } = params;

  const filter: any = {};
  
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { titleEn: { $regex: q, $options: 'i' } },
      { excerpt: { $regex: q, $options: 'i' } },
      { excerptEn: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { contentEn: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
  }
  
  if (locale) filter.locale = locale;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (featured !== undefined) filter.featured = featured;
  if (priority) filter.priority = priority;
  
  if (dateFrom || dateTo) {
    filter.publishedAt = {};
    if (dateFrom) filter.publishedAt.$gte = dateFrom;
    if (dateTo) filter.publishedAt.$lte = dateTo;
  }

  const skip = (page - 1) * pageSize;
  
  const [items, total] = await Promise.all([
    News.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    News.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

export async function getNews(id: string) {
  await connectDB();
  return await News.findById(id).lean();
}

export async function createNews(data: CreateNewsData) {
  await connectDB();
  
  const news = new News({
    ...data,
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return await news.save();
}

export async function updateNews(id: string, data: Partial<CreateNewsData>) {
  await connectDB();
  
  return await News.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
}

export async function deleteNews(id: string) {
  await connectDB();
  return await News.findByIdAndDelete(id);
}

export async function getFeaturedNews(limit: number = 4, locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    status: 'published',
    featured: true
  };
  
  if (locale) filter.locale = locale;
  
  return await News.find(filter)
    .sort({ priority: -1, publishedAt: -1 })
    .limit(limit)
    .lean();
}

export async function getLatestNews(limit: number = 6, locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    status: 'published'
  };
  
  if (locale) filter.locale = locale;
  
  return await News.find(filter)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}

export async function getNewsByType(type: string, limit: number = 10, locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    status: 'published',
    type
  };
  
  if (locale) filter.locale = locale;
  
  return await News.find(filter)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
}

export async function incrementViewCount(id: string) {
  await connectDB();
  return await News.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  );
}
