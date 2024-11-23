CREATE TABLE IF NOT EXISTS "feed_items" (
	"feed_url" text NOT NULL,
	"title" text,
	"description" text,
	"pub_date" timestamp,
	"link_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "feed_items_feed_url_link_url_pub_date_pk" PRIMARY KEY("feed_url","link_url","pub_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feeds" (
	"url" text PRIMARY KEY NOT NULL,
	"title" text,
	"link" text,
	"description" text,
	"image" text,
	"items_updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "links" (
	"url" text PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"thumbnail" text,
	"date_published" timestamp,
	"date_last_edited" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"feed_url" text,
	"user_id" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_feed_url_user_id_pk" PRIMARY KEY("feed_url","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upvotes" (
	"user_id" text NOT NULL,
	"link_url" text NOT NULL,
	"timestamp" timestamp DEFAULT now(),
	CONSTRAINT "upvotes_user_id_link_url_pk" PRIMARY KEY("user_id","link_url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"description" text NOT NULL,
	"avatar" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_feed_url_feeds_url_fk" FOREIGN KEY ("feed_url") REFERENCES "public"."feeds"("url") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_link_url_links_url_fk" FOREIGN KEY ("link_url") REFERENCES "public"."links"("url") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_feed_url_feeds_url_fk" FOREIGN KEY ("feed_url") REFERENCES "public"."feeds"("url") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upvotes" ADD CONSTRAINT "upvotes_link_url_links_url_fk" FOREIGN KEY ("link_url") REFERENCES "public"."links"("url") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
