import { db, feedItems, links } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { fetchFeedItems } from '@/lib/fetchRSS';
import { NextResponse } from 'next/server';

export async function GET(request: never, { params: { url } }: { params: { url: string } }) {
  const feedUrl = decodeURIComponent(url);

  const latest = await fetchFeedItems(feedUrl);

  console.log(latest);

  if (!latest) {
    return NextResponse.json(
      { error: 'Feed not found or invalid.' },
      { status: 404 }
    );
  }

  // insert the latest items into the database
  await db.transaction(async (tx) => {
    await tx.insert(links)
      .values(latest.map((item) => ({
        url: item.url,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
      })))
      .onConflictDoUpdate({
        target: links.url,
        set: { title: sql`excluded.title`, description: sql`excluded.description`, thumbnail: sql`excluded.thumbnail` },
      })
      .execute();

    await tx.insert(feedItems)
      .values(latest.map((item) => ({
        feedUrl: feedUrl,
        pubDate: item.published,
        linkUrl: item.url,
      })))
      // when is this ever going to happen? At the risk of a hard to detect bug
      // .onConflictDoUpdate({
      //   target: [feedItems.feedUrl, feedItems.linkUrl],
      //   set: { pubDate: sql`excluded.pub_date` },
      // })
      .execute();
  })

  return NextResponse.json({});
}
