import { fetchMetadata } from "@/lib/fetchMetadata"
import { displayUrl } from "@/lib/helpers"
import { Story } from "@/lib/types"
import { Suspense } from "react"
import Thumbnail from "./Thumbnail"
import { Skeleton } from "@/components/ui/skeleton"

export default function GridView({ currentStories, icons }: { currentStories: Story[], icons: 'true' | 'false' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {currentStories.map((story) => (
        <Suspense key={story.id} fallback={<GridComponentSkeleton />}>
          <GridComponent story={story} icons={icons} />
        </Suspense>
      ))}
    </div>
  )
}

async function GridComponent({ story, icons }: { story: Story, icons: 'true' | 'false' }) {
  const metadata = await fetchMetadata(story.url)

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
        {icons === 'true' && (
          <div className='pt-3 min-w-10'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(story.url).hostname)}.ico`}
              alt=""
              className="aspect-square rounded-md w-10 h-10 object-cover" />
          </div>
        )}
        <div className="p-3">
          <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
          <div className="text-sm text-muted-foreground flex flex-col">
            <div title={story.url} className="hover:text-black transition-colors">{displayUrl(story.url)}</div>
            <span>{new Date(story.published).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </a>
  )
}

async function GridComponentSkeleton() {
  return (
    <a className="block rounded-md">
      <div className='aspect-video w-full overflow-hidden'>
        <Skeleton className="w-full h-full object-cover rounded-md" />
      </div>
      <div className="flex">
        <div className='pt-3 min-w-10'>
          <Skeleton className='aspect-square rounded-md w-10 h-10 object-cover'></Skeleton>
        </div>
        <div className="p-3">
          <Skeleton className="font-semibold text-foreground line-clamp-2">Pretending to be a title!</Skeleton>
          <div className="text-sm text-muted-foreground flex flex-col">
            <div className="hover:text-black transition-colors">host</div>
            <span>date skeleton</span>
          </div>
        </div>
      </div>
    </a>
  )
}