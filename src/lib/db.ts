import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
  pgTable,
  text,
  primaryKey,
  date,
} from 'drizzle-orm/pg-core';

/**

SCHEMA

feeds
- url (PK)
- title
- link
- description
- image

feed_items
- feed_url (FK)
- pub_date (date)
- page_url (FK)

links
- url (PK)
- title
- description
- thumbnail

*/

// Feeds Table
export const feeds = pgTable("feeds", {
  url: text("url").primaryKey(),   // Primary key (URL of the feed)
  title: text("title").notNull(),                      // Title of the feed
  link: text("link").notNull(),    // Link to the feed's homepage
  description: text("description").notNull(),          // Description of the feed
  image: text("image").notNull()   // Image URL for the feed
});

// Feed Items Table
export const feedItems = pgTable("feed_items", {
  feedUrl: text("feed_url").notNull().references(() => feeds.url),   // Foreign key referencing 'feeds.url'
  pubDate: date("pub_date").notNull(),                      // Publication date of the item
  linkUrl: text("link_url").notNull().references(() => links.url),   // Foreign key referencing 'links.url'
},
  (table) => {
    return {
      pk: primaryKey({ columns: [table.feedUrl, table.linkUrl] }),
    };
  }
);

// Links Table
export const links = pgTable("links", {
  url: text("url").primaryKey(),   // Primary key (URL of the link/page)
  title: text("title").notNull(),                      // Title of the page
  description: text("description").notNull(),          // Description of the page
  thumbnail: text("thumbnail").notNull() // Thumbnail image URL for the page
});


export const db = drizzle(sql)