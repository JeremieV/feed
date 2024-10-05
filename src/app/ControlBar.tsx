"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { KeyboardEvent } from 'react'

export default function ControlBar({ view, feeds }: { view: 'list' | 'grid', feeds: string[] }) {
  const router = useRouter()

  function updateView(view: 'list' | 'grid') {
    router.push(`?view=${view}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  function setFeeds(feeds: string[]) {
    // deduplicate
    feeds = Array.from(new Set(feeds))
    // this comma separator should work every time... but I'm a bit scared
    router.push(`?view=${view}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  const topics: { name: string, feeds: string[] }[] = [
    {
      name: 'world news',
      feeds: [
        // "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "https://feeds.bbci.co.uk/news/world/rss.xml",
        "https://www.npr.org/rss/rss.php",
        "https://www.pewresearch.org/feed/",
        "http://www.aljazeera.com/xml/rss/all.xml",
        "https://www.economist.com/latest/rss.xml",
        "https://www.theguardian.com/world/rss",
        "http://feeds.feedburner.com/time/world",
        "http://www.independent.co.uk/news/world/rss",
        "https://www.vox.com/rss/index.xml",
      ],
    },
    {
      name: 'tech',
      feeds: [
        "https://www.wired.com/feed/rss",
        "https://www.techcrunch.com/feed",
        "https://www.theverge.com/rss/index.xml",
        "https://www.techradar.com/rss",
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA", // Fireship
        "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA", // Theo - t3.gg
      ],
    }
  ]

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

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* tag selection */}
        <div className="flex flex-wrap gap-2 mr-2">
          {/* <Badge
            role='button'
            tabIndex={0}
            onClick={() => setExpanded(!expanded)}
            onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && setExpanded(!expanded)}
          >
            <ChevronRight className={`${expanded ? 'rotate-90' : ''} transition-transform`}></ChevronRight>
            <span className="ml-2">More feeds</span>
          </Badge> */}
          {topics.map(topic => (
            <Badge
              key={topic.name}
              title={topic.name}
              role='button'
              tabIndex={0}
              variant="secondary"
              // className="cursor-pointer transition-all bg-foreground text-background hover:bg-primary/10"
              onClick={() => setFeeds([...feeds, ...topic.feeds])}
              onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && setFeeds([...feeds, ...topic.feeds])}
            >
              {topic.name}
            </Badge>
          ))}
        </div>
        {/* tag selection end */}
        <Button onClick={() => updateView(view === 'list' ? 'grid' : 'list')} variant="outline">
          {view === 'grid' ? 'List view' : 'Grid view'}
        </Button>
      </div>
    </div>
  )
}