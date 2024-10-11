import { db, feeds } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // select all feeds from the database
  const allFeeds = await db.select({ url: feeds.url })
    .from(feeds)
    .limit(4000);

  for (const { url } of allFeeds) {
    fetch(`/api/updateFeed/${encodeURIComponent(url)}`);
  }

  return NextResponse.json({});
}
