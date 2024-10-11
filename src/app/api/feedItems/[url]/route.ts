import { db, feedItems, links } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

/**
 * Fetch a feed's items by URL.
 * TODO protect this endpoint with the cron key
 */
export async function GET(request: never, { params: { url } }: { params: { url: string } }) {
  const feedUrl = decodeURIComponent(url);

  // fetch items from the database
  const items = await db.select({
    feedUrl: feedItems.feedUrl,
    pubDate: feedItems.pubDate,
    url: links.url,
    title: links.title,
    description: links.description,
    tumbnail: links.thumbnail,
  })
    .from(feedItems)
    .innerJoin(links, eq(feedItems.linkUrl, links.url))  // Join with 'links' table on page URL
    .where(eq(feedItems.feedUrl, feedUrl))               // Filter by feed URL
    .orderBy(desc(feedItems.pubDate))
    .limit(100)

  return NextResponse.json(items);
}
