import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const viewAtom = atomWithStorage<'list' | 'grid'>('view', 'list')

// export const frontPageTopicAtom = atom<string | undefined>(undefined)

// export const frontPageFeedsAtom = atom<string[]>(
//   get => {
//     const topic = get(frontPageTopicAtom)
//     if (!topic) return []
//     if (topic === 'subscriptions') return get(subscriptionsAtom).map(sub => sub.url)
//     // @ts-expect-error this is fine (*lying*)
//     return topics[topic] as string[]
//   }
// )

export const sidebarOpenAtom = atomWithStorage<boolean>('sidebarOpen', false)

// export const topics = {
//   // popular: [],
//   world: [
//     "https://feeds.bbci.co.uk/news/world/rss.xml",
//     "https://www.npr.org/rss/rss.php",
//     "https://www.pewresearch.org/feed/",
//     "http://www.aljazeera.com/xml/rss/all.xml",
//     "https://www.economist.com/latest/rss.xml",
//     "https://www.theguardian.com/world/rss",
//     "http://feeds.feedburner.com/time/world",
//     "https://www.vox.com/rss/index.xml",
//   ],
//   tech: [
//     "https://www.wired.com/feed/rss",
//     "https://www.techcrunch.com/feed",
//     "https://www.theverge.com/rss/index.xml",
//     "https://www.techradar.com/rss",
//     "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA",
//     "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA",
//   ],
// }

// function setFeeds(feeds: string[]) {
//   // deduplicate
//   feeds = Array.from(new Set(feeds))
//   // this comma separator should work every time... but I'm a bit scared
//   router.push(`?feeds=${feeds.map(encodeURIComponent).join(',')}`)
// }

// const topics: { name: string, feeds: string[] }[] = [
//   {
//     name: 'popular',
//     feeds: [],
//   },
//   {
//     name: 'subscriptions',
//     feeds: [],
//   },
//   {
//     name: 'recommended',
//     feeds: [],
//   },
//   {
//     name: 'world news',
//     feeds: [
//       // "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
//       "https://feeds.bbci.co.uk/news/world/rss.xml",
//       "https://www.npr.org/rss/rss.php",
//       "https://www.pewresearch.org/feed/",
//       "http://www.aljazeera.com/xml/rss/all.xml",
//       "https://www.economist.com/latest/rss.xml",
//       "https://www.theguardian.com/world/rss",
//       "http://feeds.feedburner.com/time/world",
//       // "http://www.independent.co.uk/news/world/rss", // this one is full of horrible stories
//       "https://www.vox.com/rss/index.xml",
//     ],
//   },
//   {
//     name: 'tech',
//     feeds: [
//       "https://www.wired.com/feed/rss",
//       "https://www.techcrunch.com/feed",
//       "https://www.theverge.com/rss/index.xml",
//       "https://www.techradar.com/rss",
//       "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA", // Fireship
//       "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA", // Theo - t3.gg
//     ],
//   }
// ]

// const popularFeeds = [
//   // aggregators
//   "https://news.ycombinator.com/rss",
//   "https://rss.beehiiv.com/feeds/4aF2pGVAEN.xml",
//   "https://en.wikinews.org/w/index.php?title=Special:NewsFeed&feed=atom&categories=Published",

//   // world news
//   "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
//   "https://www.npr.org/rss/rss.php",
//   "https://www.pewresearch.org/feed/",

//   // javascript
//   "https://javascriptweekly.com/rss/1b7d8b6e",

//   // tech
//   "https://www.wired.com/feed/rss",
//   "https://www.techcrunch.com/feed",
//   "https://www.theverge.com/rss/index.xml",
//   "https://www.techradar.com/rss",
//   "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA", // Fireship
//   "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA", // Theo - t3.gg

//   // science
//   "https://www.nature.com/nature.rss",
//   "https://www.wired.com/feed/category/science/latest/rss",

//   // business
//   "https://www.wired.com/feed/category/business/latest/rss",

//   // blogs
//   "https://voussoir.net/writing/writing.atom",
// ]