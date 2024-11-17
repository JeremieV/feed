import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
  pgTable,
  text,
  primaryKey,
  timestamp,
  // uuid,
} from 'drizzle-orm/pg-core';

// Base table mixin with created_at and updated_at
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
};

export const feeds = pgTable("feeds", {
  url: text("url").primaryKey(),
  title: text("title"),
  link: text("link"),
  description: text("description"),
  image: text("image"),
  itemsUpdatedAt: timestamp("items_updated_at").defaultNow(),
  ...timestamps,
});

export const feedItems = pgTable("feed_items", {
  feedUrl: text("feed_url").notNull().references(() => feeds.url),
  title: text("title"),
  description: text("description"),
  pubDate: timestamp("pub_date"),
  linkUrl: text("link_url").references(() => links.url),
  ...timestamps,
},
  (table) => {
    return {
      pk: primaryKey({ columns: [table.feedUrl, table.linkUrl, table.pubDate] }),
    };
  }
);

export const links = pgTable("links", {
  url: text("url").primaryKey(),
  title: text("title"),
  description: text("description"),
  thumbnail: text("thumbnail"),
  datePublished: timestamp("date_published"),
  dateLastEdited: timestamp("date_last_edited"),
  ...timestamps,
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  description: text("description").notNull(),
  avatar: text("avatar").notNull(),
  ...timestamps,
});

// export const upvotes = pgTable("upvotes", {
//   userId: text("user_id").notNull().references(() => users.id),
//   linkUrl: text("link_url").notNull().references(() => links.url),
//   timestamp: timestamp("timestamp").defaultNow(),
// },
//   (table) => {
//     return {
//       pk: primaryKey({ columns: [table.userId, table.linkUrl] }),
//     };
//   }
// );

// export const subscriptions = pgTable('subscriptions', {
//   id: uuid('id').primaryKey(),
//   followerId: text("user_id").notNull().references(() => users.id),
//   feedUrl: text("feed_url").references(() => feeds.url),
//   broadcasterId: text("broadcaster_id").references(() => users.id),
//   timestamp: timestamp("timestamp").defaultNow(),
// })

export const db = drizzle(sql)