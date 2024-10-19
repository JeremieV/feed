"use server"

import { db, feeds, feedItems, links } from '@/lib/db';
import { eq, desc, inArray } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { fetchFeedItems, fetchFeedMeta } from '@/lib/fetchRSS';

/**
 * Fetch a feed's info by URL.
 * If there is no such feed in the database, fetches info and creates a new record.
 * 
 * @throws Error if the feed is not found or invalid.
 */
export async function getFeedInfo(url: string) {
  let feed;

  // fetch from the database
  feed = await db.select()
    .from(feeds)
    .where(eq(feeds.url, url))
    .limit(1);  // Get one feed (since URL is unique)

  await updateFeedItems(url);

  if (feed.length === 0) {
    feed = await fetchFeedMeta(url);
    if (!feed) {
      throw Error('Feed not found or invalid.');
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
  } else {
    feed = feed[0];
  }

  return feed;
}

/**
 * Fetch a feed's items by URL from the database.
 */
export async function getFeedItems(url: string) {
  const items = await db.select({
    feedUrl: feedItems.feedUrl,
    pubDate: feedItems.pubDate,
    url: links.url,
    title: links.title,
    description: links.description,
    thumbnail: links.thumbnail,
  })
    .from(feedItems)
    .innerJoin(links, eq(feedItems.linkUrl, links.url))  // Join with 'links' table on page URL
    .where(eq(feedItems.feedUrl, url))                   // Filter by feed URL
    .orderBy(desc(feedItems.pubDate))
    .limit(100)

  return items;
}

export async function getRecommendedStories() {
  // ideal mix (percentages to be determined):
  // random
  // top stories
  // new stories
  // subscriptions stories
  // old classics
  // "for you" stories

  const items = await db.select({
    feedUrl: feedItems.feedUrl,
    pubDate: feedItems.pubDate,
    url: links.url,
    title: links.title,
    description: links.description,
    thumbnail: links.thumbnail,
  })
    .from(feedItems)
    .innerJoin(links, eq(feedItems.linkUrl, links.url))  // Join with 'links' table on page URL
    .orderBy(sql`RANDOM()`)
    .limit(60)

  return items;
}

export async function getItemsFromMultipleFeeds(feedUrls: string[], page: number) {
  const itemsPerPage = 60; // 60 items per page
  const offset = (page - 1) * itemsPerPage;

  const items = await db.select({
    feedUrl: feedItems.feedUrl,
    pubDate: feedItems.pubDate,
    url: links.url,
    title: links.title,
    description: links.description,
    thumbnail: links.thumbnail,
  })
    .from(feedItems)
    .innerJoin(links, eq(feedItems.linkUrl, links.url))
    .where(inArray(feedItems.feedUrl, feedUrls))
    .orderBy(desc(feedItems.pubDate))
    .offset(offset)
    .limit(itemsPerPage)

  return items;
}

/**
 * Get all feeds containing a search string. If query string is empty, return the top 100 feeds.
 */
export async function searchFeeds(query: string) {
  if (!query) {
    return db.select()
      .from(feeds)
      .orderBy(feeds.title)
      .limit(100);
  }

  const results = await db.select()
    .from(feeds)
    .where(sql`title ILIKE ${`%${query}%`}`)
    .orderBy(feeds.title)
    .limit(100);

  return results;
}

/**
 * Add the latest items of a feed to the database.
 * 
 * @throws Error if the feed is not found or invalid.
 */
export async function updateFeedItems(url: string) {
  const latest = await fetchFeedItems(url);
  console.info(`Updating feed: ${url}`);

  if (!latest || latest.length === 0) {
    return
    // Error('Feed not found or invalid.');
  }

  // insert the latest items into the database
  await db.transaction(async (tx) => {
    await tx.insert(links)
      .values(latest.map((item) => ({
        url: item.url,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail,
        datePublished: item.datePublished ? new Date(item.datePublished) : null,
        dateLastEdited: item.dateLastEdited ? new Date(item.dateLastEdited) : null,
      })))
      .onConflictDoUpdate({
        target: links.url,
        set: { title: sql`excluded.title`, description: sql`excluded.description`, thumbnail: sql`excluded.thumbnail` },
      })
      .execute();

    await tx.insert(feedItems)
      .values(latest.map((item) => ({
        feedUrl: url,
        title: item.title,
        description: item.description,
        pubDate: new Date(item.pubDate),
        linkUrl: item.url,
      })))
      // when is this ever going to happen? At the risk of a hard to detect bug
      // .onConflictDoUpdate({
      //   target: [feedItems.feedUrl, feedItems.linkUrl],
      //   set: { pubDate: sql`excluded.pub_date` },
      // })
      .onConflictDoNothing()
      .execute();

    await db.update(feeds)
      .set({ itemsUpdatedAt: sql`NOW()` })
      .where(eq(feeds.url, url))
      .execute();
  })

}