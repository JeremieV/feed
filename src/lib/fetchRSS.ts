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

export async function youtubeToRSS(youtubeUrl: string): Promise<string | null> {
  // check if the url is a youtube.com url
  console.log("HELLO THERE");
  // Extract the channel name from the URL
  const channelNameMatch = youtubeUrl.match(/youtube\.com\/@([a-zA-Z0-9_-]+)/);
  console.log(channelNameMatch);
  if (!channelNameMatch || !channelNameMatch[1]) {
    return null;
  }

  const channelName = channelNameMatch[1];
  console.log(channelName);

  // Fetch the channel ID using the YouTube Data API
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${process.env.YOUTUBE_API_KEY}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    console.error(`Failed to fetch channel ID: ${response.statusText}`);
    return null;
  }

  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const channelId = data.items[0].snippet.channelId;
    // Construct the RSS feed URL
    return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  }

  return null; // Return null if the channel isn't found
}

export async function fetchRSSFeed(url: string): Promise<Story[]> {
  try {
    // interface RSSFeed {
    //   status: string
    //   feed: {
    //     url: string
    //     title: string
    //     link: string
    //     author: string
    //     description: string
    //     image: string
    //   }
    //   items: RSSItem[]
    // }

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

    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=100&api_key=${process.env.RSS2JSON_API_KEY}`,
      { next: { revalidate: 60 * 60 } } // cache for one hour
    )
    const data = await response.json()
    if (data.items) {
      return data.items.map((item: RSSItem) => ({
        id: item.guid,
        title: item.title,
        url: item.link,
        published: item.pubDate,
        thumnail: item.thumbnail,
      }))
    }
    return []
  } catch (error) {
    console.error('Error fetching rss:', error);
    return [];
  }
}

export async function fetchStories(feedUrls: string[]) {
  const stories: Story[] = []
  for (const feed of feedUrls) {
    stories.push(...await fetchRSSFeed(feed));
  }
  stories.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
  return stories;
}