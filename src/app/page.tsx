'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchMetadata } from '@/lib/fetchMetadata'
// import Image from 'next/image'

interface Story {
  id: number
  title: string
  url: string
  time: number
}

export default function HackerNewsFeed() {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [gridView, setGridView] = useState(false)
  const storiesPerPage = 50

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
        const storyIds = await response.json()

        const storyPromises = storyIds.slice(0, 500).map((id: number) =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        )

        const storyDetails = await Promise.all(storyPromises)
        setStories(storyDetails)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to fetch stories. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [])

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)

  const totalPages = Math.ceil(stories.length / storiesPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4" id='top'>
      <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
      <p className='mb-4'>Made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setGridView(!gridView)} variant="outline">
          {gridView ? 'List view' : 'Grid view'}
        </Button>
      </div>
      {gridView ? (
        <GridView currentStories={currentStories} />
      ) : (
        <TableView currentStories={currentStories} currentPage={currentPage} />
        )}
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
        src={image}
        alt={story.title}
        width={320}
        height={180}
        className="w-full h-60 object-cover rounded-md overflow-hidden"
      />
      <div className="p-3">
        <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
        <p className="text-xs text-muted-foreground mt-1">
          { new URL(story.url || `https://news.ycombinator.com`).host.replace(/^www\./, '')} · 
          {new Date(story.time * 1000).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}

// 'use client'

// import { useState, useEffect } from 'react'
// import Link from "next/link"
// import Image from "next/image"
// import { Loader2, ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Toggle } from "@/components/ui/toggle"

// interface Story {
//   id: number
//   title: string
//   url: string
//   time: number
//   metaImage?: string
// }

// export default function HackerNewsFeed() {
//   const [stories, setStories] = useState<Story[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
//   const storiesPerPage = 10

//   useEffect(() => {
//     const fetchStories = async () => {
//       try {
//         const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
//         const storyIds = await response.json()

//         const storyPromises = storyIds.slice(0, 50).map(async (id: number) => {
//           const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
//           const storyData = await storyResponse.json()
          
//           // Fetch meta information for grid view
//           let metaImage = '/placeholder.svg?height=120&width=200'
//           if (storyData.url) {
//             try {
//               const metaResponse = await fetch(`https://api.microlink.io?url=${encodeURIComponent(storyData.url)}`)
//               const metaData = await metaResponse.json()
//               if (metaData.data.image && metaData.data.image.url) {
//                 metaImage = metaData.data.image.url
//               }
//             } catch (error) {
//               console.error('Error fetching meta data:', error)
//             }
//           }

//           return { ...storyData, metaImage }
//         })

//         const storyDetails = await Promise.all(storyPromises)
//         setStories(storyDetails)
//         setIsLoading(false)
//       } catch (err) {
//         setError('Failed to fetch stories. Please try again later.')
//         setIsLoading(false)
//       }
//     }

//     fetchStories()
//   }, [])

//   const indexOfLastStory = currentPage * storiesPerPage
//   const indexOfFirstStory = indexOfLastStory - storiesPerPage
//   const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)

//   const totalPages = Math.ceil(stories.length / storiesPerPage)

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

//   if (isLoading) {
//     return (
//       <div className="w-full max-w-6xl mx-auto p-4 flex justify-center items-center h-screen">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="w-full max-w-6xl mx-auto p-4">
//         <p className="text-red-500 dark:text-red-400">{error}</p>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full max-w-6xl mx-auto p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-foreground">Hacker News Top Stories</h1>
//         <Toggle
//           aria-label="Toggle view"
//           pressed={viewMode === 'grid'}
//           onPressedChange={(pressed) => setViewMode(pressed ? 'grid' : 'table')}
//         >
//           {viewMode === 'table' ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
//         </Toggle>
//       </div>

//       {viewMode === 'table' ? (
//         <div className="border border-border rounded-md overflow-hidden mb-4">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-muted">
//                 <th className="text-left p-3 font-semibold text-foreground">Title</th>
//                 <th className="text-left p-3 font-semibold text-foreground w-32">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentStories.map((story, index) => (
//                 <tr key={story.id} className={`border-t border-border transition-colors ${index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}`}>
//                   <td className="p-3">
//                     <Link 
//                       href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-primary hover:underline"
//                     >
//                       {story.title}
//                     </Link>
//                   </td>
//                   <td className="p-3 text-muted-foreground">
//                     {new Date(story.time * 1000).toLocaleDateString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//           {currentStories.map((story) => (
//             <Link
//               key={story.id}
//               href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="block border border-border rounded-md overflow-hidden hover:shadow-md transition-shadow"
//             >
//               <Image
//                 src={story.metaImage}
//                 alt={story.title}
//                 width={320}
//                 height={180}
//                 className="w-full h-40 object-cover"
//               />
//               <div className="p-3">
//                 <h2 className="text-sm font-semibold text-foreground line-clamp-2">{story.title}</h2>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {new Date(story.time * 1000).toLocaleDateString()}
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <Button
//           onClick={() => paginate(currentPage - 1)}
//           disabled={currentPage === 1}
//           variant="outline"
//         >
//           <ChevronLeft className="h-4 w-4 mr-2" />
//           Previous
//         </Button>
//         <span className="text-foreground">Page {currentPage} of {totalPages}</span>
//         <Button
//           onClick={() => paginate(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           variant="outline"
//         >
//           Next
//           <ChevronRight className="h-4 w-4 ml-2" />
//         </Button>
//       </div>
//     </div>
//   )
// }