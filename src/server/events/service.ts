import Event, { IEvent } from '@/models/Event';
import { connectDB } from '@/lib/mongoose';

export interface ListEventsParams {
  q?: string;
  page?: number;
  pageSize?: number;
  locale?: 'fa' | 'en';
  type?: string;
  category?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CreateEventData {
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
  status?: 'draft' | 'published' | 'cancelled' | 'completed';
  maxParticipants?: number;
  registrationRequired?: boolean;
  registrationDeadline?: Date;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string;
  tags?: string[];
  contentHtml?: string;
  contentHtmlEn?: string;
  locale: 'fa' | 'en';
  createdBy: string;
  updatedBy: string;
}

export async function listEvents(params: ListEventsParams = {}) {
  await connectDB();
  
  const {
    q,
    page = 1,
    pageSize = 10,
    locale,
    type,
    category,
    status,
    dateFrom,
    dateTo
  } = params;

  const filter: any = {};
  
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { titleEn: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { descriptionEn: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
  }
  
  if (locale) filter.locale = locale;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  
  if (dateFrom || dateTo) {
    filter.date = {};
    if (dateFrom) filter.date.$gte = dateFrom;
    if (dateTo) filter.date.$lte = dateTo;
  }

  const skip = (page - 1) * pageSize;
  
  const [items, total] = await Promise.all([
    Event.find(filter)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Event.countDocuments(filter)
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

export async function getEvent(id: string) {
  await connectDB();
  return await Event.findById(id).lean();
}

export async function createEvent(data: CreateEventData) {
  await connectDB();
  
  const event = new Event({
    ...data,
    currentParticipants: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return await event.save();
}

export async function updateEvent(id: string, data: Partial<CreateEventData>) {
  await connectDB();
  
  return await Event.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
}

export async function deleteEvent(id: string) {
  await connectDB();
  return await Event.findByIdAndDelete(id);
}

export async function getUpcomingEvents(limit: number = 4, locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    status: 'published',
    date: { $gte: new Date() }
  };
  
  if (locale) filter.locale = locale;
  
  return await Event.find(filter)
    .sort({ date: 1 })
    .limit(limit)
    .lean();
}

export async function getEventsByType(type: string, limit: number = 10, locale?: 'fa' | 'en') {
  await connectDB();
  
  const filter: any = {
    status: 'published',
    type
  };
  
  if (locale) filter.locale = locale;
  
  return await Event.find(filter)
    .sort({ date: 1 })
    .limit(limit)
    .lean();
}
