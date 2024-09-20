'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes";

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
  const storiesPerPage = 50

  const { theme } = useTheme()

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
      The current theme is: {theme}
      <h1 className="text-2xl font-bold">Hacker News Top Stories</h1>
      <p className='mb-4'>Made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
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