import type { Metadata } from 'next';

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function buildLanguageAlternates(path: string) {
  const base = getBaseUrl();
  return {
    en: `${base}/en${path}`,
    fa: `${base}/fa${path}`
  } as Record<string, string>;
}

export function buildListMetadata(opts: {
  locale: 'en' | 'fa';
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const base = getBaseUrl();
  const url = `${base}/${opts.locale}${opts.path}`;
  const img = opts.image || `${base}/og.png`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url, languages: buildLanguageAlternates(opts.path) },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: 'Teamcore Engineering',
      images: [{ url: img }],
      locale: opts.locale,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [img]
    }
  };
}

export function buildDocMetadata(opts: {
  locale: 'en' | 'fa';
  path: string; // path including leading slash and resource slug
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const base = getBaseUrl();
  const url = `${base}/${opts.locale}${opts.path}`;
  const img = opts.image || `${base}/og.png`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url, languages: buildLanguageAlternates(opts.path) },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: 'Teamcore Engineering',
      images: [{ url: img }],
      locale: opts.locale,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [img]
    }
  };
}
