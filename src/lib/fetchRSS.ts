"use server"

import { Story } from "./types"

// async function fetchHackerNewsTopStories(): Promise<Story[]> {
//   const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
//   const storyIds = await response.json()

//   const storyPromises = storyIds.slice(0, 500).map((id: number) =>
//     fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
//   )

//   const storyDetails = await Promise.all(storyPromises)
//   return storyDetails
// }

// async function fetchDevToTopStories(): Promise<Story[]> {
//   interface DevToPost {
//     id: number
//     title: string
//     url: string
//     cover_image: string
//     user: { name: string }
//     published_timestamp: string
//   }

//   const response = await fetch(`https://dev.to/api/articles?top=500`)
//   const stories = (await response.json()).map((e: DevToPost) => ({
//     id: e.id,
//     title: e.title,
//     url: e.url,
//     cover_image: e.cover_image,
//     author: e.user.name,
//     published: e.published_timestamp,
//   }))
//   return stories
// }

export async function fetchRSSFeed(url: string): Promise<Story[]> {
  try {
    interface RSSItem {
      title: string
      pubDate: string
      link: string
      guid: string
      author: string
      thumbnail: string
      description: string
      content: string
    }

    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=500&api_key=${process.env.RSS2JSON_API_KEY}`)
    const data = await response.json()
    return data.items.map((item: RSSItem) => ({
      id: item.guid,
      title: item.title,
      url: item.link,
      published: item.pubDate,
      thumnail: item.thumbnail,
    }))
  } catch (error) {
    console.error('Error fetching rss:', error);
    return [];
  }
}