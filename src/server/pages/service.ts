import '@/lib/mongoose';
import StaticPage from '@/models/StaticPage';

export async function getPage(key: 'privacy' | 'terms' | 'contact', locale: 'en' | 'fa') {
  let doc: any = await StaticPage.findOne({ key, locale }).lean();
  if (!doc) {
    doc = (await StaticPage.create({ key, locale })).toObject();
  }
  return toDto(doc);
}

export async function updatePage(key: 'privacy' | 'terms' | 'contact', locale: 'en' | 'fa', data: any) {
  const updated = await StaticPage.findOneAndUpdate(
    { key, locale },
    { $set: data },
    { new: true, upsert: true }
  ).lean();
  return toDto(updated!);
}

function toDto(doc: any) {
  return {
    key: doc.key,
    locale: doc.locale,
    contentHtml: doc.contentHtml || '',
    contact: doc.contact || {}
  } as const;
}

