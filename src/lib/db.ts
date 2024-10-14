import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
  pgTable,
  text,
  primaryKey,
  timestamp,
} from 'drizzle-orm/pg-core';

// Base table mixin with created_at and updated_at
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
};

export const feeds = pgTable("feeds", {
  url: text("url").primaryKey(),
  title: text("title").notNull(),
  link: text("link").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  ...timestamps,
});

export const feedItems = pgTable("feed_items", {
  feedUrl: text("feed_url").notNull().references(() => feeds.url),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  pubDate: timestamp("pub_date").notNull(),
  linkUrl: text("link_url").notNull().references(() => links.url),
  ...timestamps,
},
  (table) => {
    return {
      pk: primaryKey({ columns: [table.feedUrl, table.linkUrl] }),
    };
  }
);

export const links = pgTable("links", {
  url: text("url").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnail: text("thumbnail").notNull(),
  datePublished: timestamp("date_published"),
  dateLastEdited: timestamp("date_last_edited"),
  ...timestamps,
});

export const db = drizzle(sql)