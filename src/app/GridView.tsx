"use client"

import { fetchMetadata, Metadata } from "@/lib/fetchMetadata"
import { displayTimeAgo, displayUrl } from "@/lib/helpers"
import { Story } from "@/lib/types"
import Thumbnail from "./Thumbnail"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export default function GridView({ currentStories }: { currentStories: Story[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {currentStories.map((story) => (
        <GridComponent key={story.id} story={story} />
      ))}
    </div>
  )
}

function GridComponent({ story }: { story: Story }) {
  const [metadata, setMetadata] = useState<Metadata | null>(null)

  useEffect(() => {
    async function request() {
      const metadata = await fetchMetadata(story.url)
      setMetadata(metadata)
    }

    request()
  }, [story.url])

  if (!metadata) {
    return <GridComponentSkeleton />
  }

  return (
    <a
      key={story.id}
      href={story.url}
      title={story.title}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md"
    >
      <div className='aspect-video w-full overflow-hidden' title={metadata.description ?? ''}>
        {metadata.thumbnail ?
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={metadata.thumbnail}
            alt={story.title}
            className="w-full h-full object-cover rounded-md"
          />
          :
          <Thumbnail title={story.title} />
        }
      </div>
      <div className="flex">
        <div className='pt-3 min-w-10'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(story.url).hostname)}.ico`}
            alt=""
            className="aspect-square rounded-md w-10 h-10 object-cover" />
        </div>
        <div className="p-3 flex flex-col gap-1">
          <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
          <div className="text-sm text-muted-foreground flex flex-col gap-1">
            <div title={story.url} className="hover:text-primary transition-colors">{displayUrl(story.url)}</div>
            <span>{displayTimeAgo(story.published)}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

function GridComponentSkeleton() {
  return (
    <div className="block rounded-md text-transparent">
      <div className='aspect-video w-full overflow-hidden'>
        <Skeleton className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="flex">
        <div className='pt-3 min-w-10'>
          <Skeleton className='aspect-square rounded-md w-10 h-10 object-cover'></Skeleton>
        </div>
        <div className="p-3 flex flex-col gap-1">
          <Skeleton className="font-semibold line-clamp-2 flex w-full">Pretending to be a title and to be a long title</Skeleton>
          <div className="text-sm flex flex-col gap-1 max-w-[50%]">
            <Skeleton>host</Skeleton>
            <Skeleton>date skeleton</Skeleton>
          </div>
        </div>
      </div>
    </div>
  )
}