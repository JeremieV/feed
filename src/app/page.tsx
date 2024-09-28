'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchMetadata, Metadata } from '@/lib/fetchMetadata'
import { Badge } from "@/components/ui/badge"
import { Story } from "@/lib/types"
import { fetchRSSFeed } from '@/lib/fetchRSS'
import { useSearchParams, useRouter } from 'next/navigation'
// import { Checkbox } from '@/components/ui/checkbox'

// skeleton

// import { Skeleton } from "@/components/ui/skeleton"

// function SkeletonDemo() {
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

function displayUrl(url: string): string {
  return new URL(url).host.replace(/^www\./, '').replace(/.com$/, '')
}

export default function Feed() {
  const router = useRouter()
  const searchParams = useSearchParams();

  // view
  const view: 'list' | 'grid' = searchParams.get('view') === 'list' ? 'list' : 'grid';
  function updateView(view: 'list' | 'grid') {
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  // icons
  const icons: 'false' | 'true' = searchParams.get('icons') === 'false' ? 'false' : 'true';
  function updateIcons(icons: 'true' | 'false') {
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddInput, setShowAddInput] = useState(false)

  const storiesPerPage = 50
  // const [feeds, setFeeds] = useState([
  //   "https://hnrss.org/best?count=99",
  //   "https://www.wired.com/feed/rss",
  //   "https://www.theverge.com/rss/index.xml",
  // ])

  const feeds: string[] = searchParams.get('feeds')?.split(',').filter(x => x).map(decodeURIComponent) || [];
  function setFeeds(feeds: string[]) {
    // this comma separator should work every time... but I'm a bit scared
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}`)
  }

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
  }, [searchParams])

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)

  const totalPages = Math.ceil(stories.length / storiesPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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

  return (
    <div className="w-full max-w-6xl mx-auto p-4 min-h-svh flex flex-col" id='top'>
      <h1 className="text-2xl font-bold">Customizable Feed</h1>
      <p className='mb-8'><a href="https://github.com/jeremiev/rss-feed" className='underline'>Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
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
      {error ? (
        <div className="w-full text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      ) : feeds.length === 0 ? (
        <div className="w-full text-center py-4 grow flex flex-col justify-center">
          <p className="text-muted-foreground">Welcome to the open feed reader!</p>
          <p className="text-muted-foreground">Here you can build any feed you like. To save it, bookmark the resulting URL.</p>
          <p className="text-muted-foreground">Add some feeds to get started (top left)</p>
        </div>
      )
        :
        isLoading ? (
          <div className="w-full max-w-6xl mx-auto p-4 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) :
          view === 'grid' ? (
            <GridView currentStories={currentStories} icons={icons} />
          ) : (
            <TableView currentStories={currentStories} currentPage={currentPage} icons={icons} />
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
    </div >
  )
}

function TableView({ currentStories, icons }: { currentStories: Story[], currentPage: number, icons: 'true' | 'false' }) {
  return (
    <div className="border border-border rounded-md overflow-hidden mb-4">
      <table className="w-full">
        <thead>
          <tr className="bg-muted">
            <th className="text-left p-3 font-semibold">Title</th>
          </tr>
        </thead>
        <tbody>
          {currentStories.map((story) => (
            <tr key={story.id} className={`border-t border-border transition-colors bg-background`}>
              <td className="p-3">
                <a
                  href={story.url}
                  target="_blank"
                  title={story.title}
                  rel="noopener noreferrer"
                  className="flex"
                >
                  {icons === 'true' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(story.url).hostname)}.ico`}
                      alt=""
                      className="aspect-square rounded-md w-5 h-5 object-cover mt-1 mr-3" />
                  )}
                  <div className='flex flex-col'>
                    <span className='hover:underline'>{story.title}</span>
                    <div className='text-muted-foreground text-sm'>
                      <a href={story.url} title={story.url} className="hover:text-primary transition-colors">{displayUrl(story.url)}</a>
                      <span>
                        {` · `} {new Date(story.published).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GridView({ currentStories, icons }: { currentStories: Story[], icons: 'true' | 'false' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {currentStories.map((story) => (
        <GridComponent key={story.id} story={story} icons={icons} />
      ))}
    </div>
  )
}

function Thumbnail({ title }: { title: string }) {
  const colorCombinations = [
    { from: 'from-purple-600', to: 'to-orange-600' },
    { from: 'from-purple-600', to: 'to-blue-600' },
    { from: 'from-red-600', to: 'to-yellow-600' },
    { from: 'from-green-600', to: 'to-teal-600' },
    { from: 'from-pink-500', to: 'to-purple-600' },
    { from: 'from-yellow-400', to: 'to-orange-500' },
    { from: 'from-blue-400', to: 'to-indigo-600' },
    { from: 'from-teal-400', to: 'to-blue-500' },
    { from: 'from-orange-500', to: 'to-red-600' },
  ]

  const gradientDirections = [
    'bg-gradient-to-r',
    'bg-gradient-to-br',
    'bg-gradient-to-b',
    'bg-gradient-to-bl',
    'bg-gradient-to-l',
    'bg-gradient-to-tl',
    'bg-gradient-to-t',
    'bg-gradient-to-tr',
  ]

  const [gradientStyle, setGradientStyle] = useState({
    colors: colorCombinations[0],
    direction: gradientDirections[0],
  })

  useEffect(() => {
    const randomColorIndex = Math.floor(Math.random() * colorCombinations.length)
    const randomDirectionIndex = Math.floor(Math.random() * gradientDirections.length)
    setGradientStyle({
      colors: colorCombinations[randomColorIndex],
      direction: gradientDirections[randomDirectionIndex],
    })
  }, [])

  const id = Math.random().toString(36).substring(7)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div className={`absolute inset-0 ${gradientStyle.direction} ${gradientStyle.colors.from} ${gradientStyle.colors.to}`} />
      <div className="absolute inset-0 opacity-50 mix-blend-multiply">
        <svg className='w-full h-full' xmlns="http://www.w3.org/2000/svg">
          <filter id={`${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id})`} />
        </svg>
      </div>
      <div className="relative flex items-center justify-center h-full p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-left leading-tight drop-shadow-lg line-clamp-3">
          {title}
        </h1>
      </div>
    </div>
  )
}

function GridComponent({ story, icons }: { story: Story, icons: 'true' | 'false' }) {
  const [metadata, setMetaData] = useState<Metadata | null>(null)
  // const metadata = await fetchMetadata(story.url)

  useEffect(() => {
    if (!story.thumbnail) {
      fetchMetadata(story.url).then(meta => meta && setMetaData(meta))
    }
  }, [story.thumbnail, story.url])

  return (
    <a
      key={story.id}
      href={story.url}
      title={story.title}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className='aspect-video w-full overflow-hidden' title={metadata?.description ?? ''}>
        {metadata?.thumbnail ?
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
            <a href={story.url} title={story.url} className="hover:text-black transition-colors">{displayUrl(story.url)}</a>
            <span>{new Date(story.published).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </a>
  )
}