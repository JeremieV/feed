import { updateFeedItems } from '@/app/server/feedsCRUD';
import { db, feeds } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== "development" && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("Unauthorized request to update all feeds.");
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.info("Running cron job to update the most out of date feeds...");

  // const mostOutdated = await db.select({ url: feeds.url })
  //   .from(feeds)
  //   .orderBy(feeds.itemsUpdatedAt)
  //   .limit(1);

  // if (mostOutdated.length < 1) {
  //   console.warn("No feeds found to update.");
  //   return NextResponse.json({});
  // }

  // console.info(`Updating feed: ${mostOutdated[0].url}`);
  // await updateFeedItems(mostOutdated[0].url);

  // select all feeds from the database
  const allFeeds = await db.select({ url: feeds.url })
    .from(feeds)
    .limit(4000);

  for (const { url } of allFeeds) {
    await updateFeedItems(url);
  }

  return NextResponse.json({});
}
