import { NextResponse } from 'next/server';

/**
 * Devto, hacker news, youtube, RSS...
 */
// interface Feed {
//   /** The title has to be unique */
//   title: string
//   domain: string
//   description: string

//   /** Ingest new items to database */
//   ingest: () => void
// }

// class RssFeedAdapter {
//   constructor(private url: string) { }

//   async fetch(): Promise<void> {
//     // fetch rss feed
//     // parse feed
//     // save to database
//   }
// }

// const feeds: Feed[] = [
//   {
//     title: `Hacker News`,
//     icon: `https://news.ycombinator.com/favicon.ico`,
//     description: ``,
//     ingest: () => { },
//   },
//   {
//     title: `Al Jazeera`,
//     icon: ``,
//     description: ``,
//     ingest: () => { },
//   }
// ]

// an endpoint for ingesting all new items from all feed

// list all feeds for a given domain

// an endpoint for searching for a feed (from feed titles and descriptions)


export async function GET() {
  return NextResponse.json({ message: 'Hello, World!' });
}
