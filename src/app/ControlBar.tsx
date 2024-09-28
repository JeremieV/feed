"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { displayUrl } from "@/lib/helpers"
import { useRouter } from "next/navigation"
import { useState, useRef, KeyboardEvent } from 'react'
import { ChevronRight } from "lucide-react"

export default function ControlBar({ view, icons, feeds }: { view: 'list' | 'grid', icons: 'true' | 'false', feeds: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()

  function updateIcons(icons: 'true' | 'false') {
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  function updateView(view: 'list' | 'grid') {
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  function setFeeds(feeds: string[]) {
    // deduplicate
    feeds = Array.from(new Set(feeds))
    // this comma separator should work every time... but I'm a bit scared
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  // RSS input
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // validate url
      addFeed()
    }
  }

  function addFeed() {
    // validate url
    if (!inputValue
      || !inputValue.startsWith('http')
      || feeds.includes(inputValue)) {
      return
    }
    setFeeds([...feeds, inputValue])
    setInputValue('')
    inputRef.current?.focus()
  }

  const topics: { name: string, feeds: string[] }[] = [
    {
      name: 'World news',
      feeds: [''],
    }
  ]

  const popularFeeds = [
    // aggregators
    "https://news.ycombinator.com/rss",

    // world news
    "https://www.nytimes.com/section/technology/rss.xml",
    "https://www.npr.org/rss/rss.php",


    // tech
    "https://www.wired.com/feed/rss",
    "https://www.techcrunch.com/feed",
    "https://www.theverge.com/rss/index.xml",
    "https://www.techradar.com/rss",
    "https://www.techrepublic.com/rssfeeds/articles/",
    "https://www.techmeme.com/feed.xml",
    "https://www.recode.net/rss/index.xml",
    "https://www.polygon.com/rss/index.xml",
    "https://www.pcmag.com/rss.xml",

    // blogs
    "https://voussoir.net/writing/writing.atom",
  ]

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* tag selection */}
        <div className="flex flex-wrap gap-2 mr-2">
          <Badge
            role='button'
            tabIndex={0}
            onClick={() => setExpanded(!expanded)}
            onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && setExpanded(!expanded)}
          >
            <ChevronRight className={`${expanded ? 'rotate-90' : ''} transition-transform`}></ChevronRight>
            <span className="ml-2">More feeds</span>
          </Badge>
          {feeds.map(f => (
            <Badge
              key={f}
              role='button'
              tabIndex={0}
              title={f}
              variant={"outline"}
              className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10`}
              onClick={() => setFeeds(feeds.filter(x => x !== f))}
              onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && setFeeds(feeds.filter(x => x !== f))}
            >
              {displayUrl(f)}
            </Badge>
          ))}
        </div>
        {/* tag selection end */}
        <div className='flex gap-2'>
          <Button onClick={() => updateIcons(icons === 'true' ? 'false' : 'true')} variant="outline">
            {icons === 'true' ? 'Hide icons' : 'Show icons'}
          </Button>
          <Button onClick={() => updateView(view === 'list' ? 'grid' : 'list')} variant="outline">
            {view === 'grid' ? 'List view' : 'Grid view'}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="my-6">
          <div className="flex w-full items-center space-x-2 my-4">
            <Input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add RSS feed"
            />
            <Button onClick={() => addFeed()}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <p className="font-semibold">Topics</p>
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
          <div className="flex flex-wrap gap-2">
            <p className="font-semibold">Popular feeds</p>
            {popularFeeds.filter(f => !feeds.includes(f)).map(f => (
              <Badge
                key={f}
                title={f}
                role='button'
                tabIndex={0}
                variant={"outline"}
                className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10`}
                onClick={() => setFeeds([...feeds, f])}
                onKeyDown={(event: KeyboardEvent) => event.key === 'Enter' && setFeeds([...feeds, f])}
              >
                {displayUrl(f)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}