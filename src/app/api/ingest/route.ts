import { updateFeedItems } from '@/app/server/queries';
import { db, feeds } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development" && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("Unauthorized request to update all feeds.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.info("Starting ingestion process");

  while (true) {
    // select all feeds from the database
    const allFeeds = await db.select({ url: feeds.url })
      .from(feeds)
      .limit(4000);

    for (const { url } of allFeeds) {
      try {
        await updateFeedItems(url);
      } catch (e) {
        console.error(`Failed to ingest feed: ${url}`, e);
      }
    }

    console.log(new Date().toISOString(), " | Ran ingestion on all feeds");
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 60 * 12)); // every 12 hours
  }

  return NextResponse.json({});
}
