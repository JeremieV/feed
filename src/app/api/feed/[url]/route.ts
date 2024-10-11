import { db, feeds } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { fetchFeedMeta } from '@/lib/fetchRSS';
import { NextResponse } from 'next/server';

/**
 * Fetch a feed's info by URL.
 */
export async function GET(request: never, { params: { url } }: { params: { url: string } }) {
  const feedUrl = decodeURIComponent(url);
  let feed;

  // fetch from the database
  feed = await db.select()
    .from(feeds)
    .where(eq(feeds.url, feedUrl))
    .limit(1);  // Get one feed (since URL is unique)

  console.log(feed);

  if (feed.length === 0) {
    feed = await fetchFeedMeta(feedUrl);
    if (!feed) {
      return NextResponse.json(
        { error: 'Feed not found or invalid.' },
        { status: 404 }
      );
    }
    // insert the result into the database
    await db.insert(feeds)
      .values({
        url: feed.url,
        title: feed.title,
        link: feed.link,
        description: feed.description,
        image: feed.image,
      })
      .execute();

    await fetch(`/api/updateFeed/${encodeURIComponent(feed.url)}`);
  }

  return NextResponse.json(feed);
}
