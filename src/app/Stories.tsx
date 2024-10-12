"use client"

import { Fragment, useEffect, useState } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import BottomBar from "./BottomBar"
import LoadingIndicator from "@/components/LoadingIndicator";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/state";
import { useQuery } from "@tanstack/react-query";
import { getItemsFromMultipleFeeds } from "./server/feedsCRUD";

export default function Stories({ feeds }: { feeds: string[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [view] = useAtom(viewAtom)

  useEffect(() => {
    setCurrentPage(1)
  }, [feeds])

  const { isPending, error, data: stories } = useQuery({
    queryKey: ['landing', feeds],
    queryFn: async () => {
      return await getItemsFromMultipleFeeds(feeds)
    },
  })

  if (isPending) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.name} {error.message}</div>
  }

  const storiesPerPage = 60
  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)
  const totalPages = Math.ceil(stories.length / storiesPerPage)

  if (feeds.length === 0) {
    return (
      <div className="w-full text-center py-4 grow flex flex-col justify-center">
        <p className="text-muted-foreground">Welcome to the open feed reader!</p>
        <p className="text-muted-foreground">Add some feeds to get started (top left)</p>
      </div>
    )
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