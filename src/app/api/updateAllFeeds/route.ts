import { updateFeedItems } from '@/app/server/feedsCRUD';
import { db, feeds } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30; // seconds

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development" && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("Unauthorized request to update all feeds.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.info("Running cron job to update all feeds...");

  // select all feeds from the database
  const allFeeds = await db.select({ url: feeds.url })
    .from(feeds)
    .limit(4000);

  for (const { url } of allFeeds) {
    await updateFeedItems(url);
  }

  return NextResponse.json({});
}
