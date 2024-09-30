"use client"

import { Fragment, useEffect, useState } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import { fetchStories } from '@/lib/fetchRSS'
import BottomBar from "./BottomBar"
import LoadingIndicator from "@/components/LoadingIndicator";
import { Story } from "@/lib/types";

export default function Stories({ view, feeds }: { view: 'list' | 'grid', feeds: string[] }) {
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function request() {
      setIsLoading(true)
      const stories = await fetchStories(feeds)
      setStories(stories)
      setIsLoading(false)
    }

    request()
  }, [feeds])

  const storiesPerPage = 60

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)
  const totalPages = Math.ceil(stories.length / storiesPerPage)

  if (feeds.length === 0) {
    return (
      <div className="w-full text-center py-4 grow flex flex-col justify-center">
        <p className="text-muted-foreground">Welcome to the open feed reader!</p>
        <p className="text-muted-foreground">Here you can build any feed you like. To save it, bookmark the resulting URL.</p>
        <p className="text-muted-foreground">Add some feeds to get started (top left)</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <Fragment>
      {view === 'grid' ? (
        <GridView currentStories={currentStories} />
      ) : (
        <ListView currentStories={currentStories} currentPage={currentPage} />
      )}
      <BottomBar currentPage={currentPage} totalPages={totalPages} paginate={setCurrentPage} />
    </Fragment>
  )
}
// {/* {false ? ( // was error
//     <div className="w-full text-center py-4">
//       <p className="text-red-500">{error}</p>
//     </div>
// */}