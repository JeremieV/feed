'use client'

import { useState, useEffect, useRef } from 'react'
import Link from "next/link"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchMetadata } from '@/lib/fetchMetadata'
// import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { Story } from "@/lib/types"
import { fetchRSSFeed } from '@/lib/fetchRSS'

// skeleton

// import { Skeleton } from "@/components/ui/skeleton"

// export function SkeletonDemo() {
//   return (
//     <div className="flex items-center space-x-4">
//       <Skeleton className="h-12 w-12 rounded-full" />
//       <div className="space-y-2">
//         <Skeleton className="h-4 w-[250px]" />
//         <Skeleton className="h-4 w-[200px]" />
//       </div>
//     </div>
//   )
// }


export default function Feed() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [gridView, setGridView] = useState(false)
  const [showAddInput, setShowAddInput] = useState(false)

  const storiesPerPage = 50
  const [feeds, setFeeds] = useState([
    "https://hnrss.org/best?count=99",
    "https://www.wired.com/feed/rss",
    "https://www.theverge.com/rss/index.xml",
  ])

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const stories: Story[] = []
        setIsLoading(true)
        for (const feed of feeds) {
          stories.push(...await fetchRSSFeed(feed));
        }
        stories.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
        setStories(stories)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch stories. Please try again later.')
        setIsLoading(false)
      }
    }
    fetchStories()
  }, [feeds])

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)

  const totalPages = Math.ceil(stories.length / storiesPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const popularFeeds = [
    // ai generated
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
    "https://www.nytimes.com/section/technology/rss.xml"
  ]

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
    setFeeds(x => [...x, inputValue])
    setInputValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4" id='top'>
      <h1 className="text-2xl font-bold">Customizable Feed</h1>
      <p className='mb-8'>Made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
      <div className="flex justify-between mb-4">
        {/* tag selection */}
        <div className="flex flex-wrap gap-2 mr-2">
          {feeds.map(f => (
            <Badge
              key={f}
              variant={"outline"}
              className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10`}
              onClick={() => setFeeds(feeds => feeds.filter(x => x !== f))}
            >
              {f}
            </Badge>
          ))}
          <Badge
            variant={"secondary"}
            className={`
              cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10
            `}
            onClick={() => setShowAddInput(!showAddInput)}
          >
            Add feed
          </Badge>
        </div>
        {/* tag selection end */}
        <Button onClick={() => setGridView(!gridView)} variant="outline">
          {gridView ? 'List view' : 'Grid view'}
        </Button>
      </div>
      {showAddInput && (
        <div>
          <div>
            <p className="font-semibold mb-4">Popular feeds</p>
            <div className="flex flex-wrap gap-2">
              {popularFeeds.filter(f => !feeds.includes(f)).map(f => (
                <Badge
                  key={f}
                  variant={"outline"}
                  className={`cursor-pointer transition-all bg-background text-foreground hover:bg-primary/10`}
                  onClick={() => setFeeds(x => x.includes(f) ? x : [...x, f])}
                >
                  {f}
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
        </div>
      )}
      {error ? (
        <div className="w-full text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) :
        isLoading ? (
          <div className="w-full max-w-6xl mx-auto p-4 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) :
          gridView ? (
            <GridView currentStories={currentStories} />
          ) : (
            <TableView currentStories={currentStories} currentPage={currentPage} />
          )
      }
      <div className="flex justify-between items-center">
        <Button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <span className="text-foreground">Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => {
            paginate(currentPage + 1)
            const topElement = document.getElementById('top');
            topElement?.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

          }}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function TableView({ currentStories, currentPage }: { currentStories: Story[], currentPage: number }) {
  return (
    <div className="border border-border rounded-md overflow-hidden mb-4">
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            <th className="text-left p-3 font-semibold">Title</th>
            <th className="text-right p-3 font-semibold">Index</th>
          </tr>
        </thead>
        <tbody>
          {currentStories.map((story, index) => (
            <tr key={story.id} className={`border-t border-border transition-colors bg-background`}>
              <td className="p-3">
                <Link
                  href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {story.title}
                </Link>
              </td>
              <td className="p-3 text-right font-mono">
                {/* {new Date(story.time * 1000).toLocaleDateString()}  */}
                {currentPage * 50 + index - 49}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GridView({ currentStories }: { currentStories: Story[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {currentStories.map((story) => (
        <GridComponent key={story.id} story={story} />
      ))}
    </div>
  )
}

function GridComponent({ story }: { story: Story }) {
  const [image, setImage] = useState("https://placehold.co/600x400")

  useEffect(() => {
    (async () => {
      if (!story.thumbnail) {
        // try {
        //   const metaResponse = await fetch(`https://api.microlink.io?url=${encodeURIComponent(story.url)}`)
        //   const metaData = await metaResponse.json()
        //   if (metaData.data.image && metaData.data.image.url) {
        //     setImage(metaData.data.image.url)
        //   }
        // } catch (error) {
        //   console.error('Error fetching meta data:', error)
        // }
        const metadata = await fetchMetadata(story.url)
        if (metadata?.thumbnail) {
          setImage(metadata.thumbnail)
        }
      }
    })()
  }, [])

  return (
    <Link
      key={story.id}
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={story.thumbnail ?? image}
        alt={story.title}
        width={320}
        height={180}
        className="w-full h-60 object-cover rounded-md overflow-hidden"
      />
      <div className="p-3">
        <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
        <p className="text-sm text-muted-foreground">
          {new URL(story.url).host.replace(/^www\./, '')} <br />
          {new Date(story.published).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}