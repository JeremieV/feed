'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchMetadata } from '@/lib/fetchMetadata'
// import Image from 'next/image'
import { Badge } from "@/components/ui/badge"

interface Story {
  id: number
  title: string
  cover_image?: string
  url: string
  published: string
  author?: string
}

async function fetchHackerNewsTopStories(): Promise<Story[]> {
  const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
  const storyIds = await response.json()

  const storyPromises = storyIds.slice(0, 500).map((id: number) =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
  )

  const storyDetails = await Promise.all(storyPromises)
  return storyDetails
}

async function fetchDevToTopStories(): Promise<Story[]> {
  interface DevToPost {
    id: number
    title: string
    url: string
    cover_image: string
    user: { name: string }
    published_timestamp: string
  }

  const response = await fetch(`https://dev.to/api/articles?top=500`)
  const stories = (await response.json()).map((e: DevToPost) => ({
    id: e.id,
    title: e.title,
    url: e.url,
    cover_image: e.cover_image,
    author: e.user.name,
    published: e.published_timestamp,
  }))
  return stories
}

async function fetchRSSFeed(url: string): Promise<Story[]> {
  interface RSSItem {
    guid: string
    title: string
    link: string
    pubDate: string
  }

  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
  const data = await response.json()
  return data.items.map((item: RSSItem) => ({
    id: item.guid,
    title: item.title,
    url: item.link,
    published: item.pubDate,
  }))
  // const response = await fetch(`https://rssjson.com/v1.1/${encodeURIComponent(url)}`)
  // const data = await response.json()
  // return data.items.map((item: any) => ({
  //   id: item.guid,
  //   title: item.title,
  //   url: item.link,
  //   published: item.pubDate,
  // }))
}

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
  const storiesPerPage = 50

  const [selectedTags, setSelectedTags] = useState<string[]>(["Dev.to"])

  const toggleTag = (tag: string) => {
    // multiple selectable
    // setSelectedTags(prev =>
    //   prev.includes(tag)
    //     ? prev.filter(t => t !== tag)
    //     : [...prev, tag]
    // )

    // single selectable
    setSelectedTags([tag])
  }

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setIsLoading(true)
        // const stories = await fetchDevToTopStories()
        console.log(selectedTags.includes("Hacker News Top Stories"))
        const stories: Story[] = [];
        if (selectedTags.includes("Hacker News Top Stories")) {
          stories.push(...await fetchHackerNewsTopStories());
        }
        if (selectedTags.includes("Dev.to")) {
          stories.push(...await fetchDevToTopStories());
        }
        if (selectedTags.includes("RSS")) {
          stories.push(...await fetchRSSFeed("https://www.wired.com/feed/rss"));
        }
        setStories(stories)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch stories. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [selectedTags])

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)

  const totalPages = Math.ceil(stories.length / storiesPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const tags = [
    "Hacker News Top Stories", "Dev.to", "RSS",
  ]

  return (
    <div className="w-full max-w-6xl mx-auto p-4" id='top'>
      <h1 className="text-2xl font-bold">Customizable Feed</h1>
      <p className='mb-4'>Made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
      <div className="flex justify-between mb-4">
        {/* tag selection */}
        <div className="flex flex-wrap gap-2 mr-2">
          {tags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className={`
              cursor-pointer transition-all
              ${selectedTags.includes(tag)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background text-foreground hover:bg-primary/10'
                }
            `}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
        {/* tag selection end */}
        <Button onClick={() => setGridView(!gridView)} variant="outline">
          {gridView ? 'List view' : 'Grid view'}
        </Button>
      </div>
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
      if (story.url) {
        // try {
        //   const metaResponse = await fetch(`https://api.microlink.io?url=${encodeURIComponent(story.url)}`)
        //   const metaData = await metaResponse.json()
        //   console.log(metaData)
        //   if (metaData.data.image && metaData.data.image.url) {
        //     setImage(metaData.data.image.url)
        //   }
        // } catch (error) {
        //   console.error('Error fetching meta data:', error)
        // }
        const metadata = await fetchMetadata(story.url)
        if (metadata?.image) {
          setImage(metadata.image)
        }
      }
    })()
  }, [])

  return (
    <Link
      key={story.id}
      href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={story.cover_image ?? image}
        alt={story.title}
        width={320}
        height={180}
        className="w-full h-60 object-cover rounded-md overflow-hidden"
      />
      <div className="p-3">
        <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {new URL(story.url || `https://news.ycombinator.com`).host.replace(/^www\./, '')} ·
          {new Date(story.published).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}