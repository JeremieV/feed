"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { displayUrl } from "@/lib/helpers"
import { useRouter } from "next/navigation"
import { useState, useRef } from 'react'

export default function ControlBar({ view, icons, feeds }: { view: 'list' | 'grid', icons: 'true' | 'false', feeds: string[] }) {
  const [showAddInput, setShowAddInput] = useState(false)
  const router = useRouter()

  function updateIcons(icons: 'true' | 'false') {
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  function updateView(view: 'list' | 'grid') {
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  function setFeeds(feeds: string[]) {
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

  const popularFeeds = [
    // news

    // tech
    "https://www.wired.com/feed/rss",
    "https://www.theverge.com/rss/index.xml",
    "https://www.techradar.com/rss",
    "https://www.techrepublic.com/rssfeeds/articles/",
    "https://www.techmeme.com/feed.xml",
    "https://www.techcrunch.com/feed",
    "https://www.recode.net/rss/index.xml",
    "https://www.polygon.com/rss/index.xml",
    "https://www.pcmag.com/rss.xml",
    "https://www.npr.org/rss/rss.php",
    "https://www.nytimes.com/section/technology/rss.xml",
    // blogs

    "https://voussoir.net/writing/writing.atom",
    // 
  ]

  return (
    <div>
      <div className="flex justify-between mb-4">
        {/* tag selection */}
        <div className="flex flex-wrap gap-2 mr-2">
          {feeds.map(f => (
            <Badge
              key={f}
              role='button'
              tabIndex={0}
              title={f}
              variant={"outline"}
              className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10`}
              onClick={() => setFeeds(feeds.filter(x => x !== f))}
              onKeyDown={() => setFeeds(feeds.filter(x => x !== f))}
            >
              {displayUrl(f)}
            </Badge>
          ))}
          <Badge
            variant={"secondary"}
            role='button'
            tabIndex={0}
            className={`
              cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10
              `}
            onClick={() => setShowAddInput(!showAddInput)}
            onKeyDown={() => setShowAddInput(!showAddInput)}
          >
            {showAddInput ? 'Collapse' : 'Add feed'}
          </Badge>
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
      {showAddInput && (
        <div>
          <p className="font-semibold mb-4">Popular feeds</p>
          <div className="flex flex-wrap gap-2">
            {popularFeeds.filter(f => !feeds.includes(f)).map(f => (
              <Badge
                key={f}
                title={f}
                role='button'
                tabIndex={0}
                variant={"outline"}
                className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10`}
                onClick={() => setFeeds(feeds.includes(f) ? feeds : [...feeds, f])}
                onKeyDown={() => setFeeds(feeds.includes(f) ? feeds : [...feeds, f])}
              >
                {displayUrl(f)}
              </Badge>
            ))}
          </div>
          <div className="flex w-full max-w-sm items-center space-x-2 my-4 mb-8">
            <Input
              type="text"
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add RSS feed"
            />
            <Button type='submit' disabled onSubmit={(e) => {
              e.preventDefault()
              addFeed()
            }}>Add</Button>
          </div>
          <div />

        </div>
      )}
    </div>
  )
}