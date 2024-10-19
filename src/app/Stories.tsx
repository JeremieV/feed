"use client"

import { Fragment, useEffect, useState } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import BottomBar from "./BottomBar"
import LoadingIndicator from "@/components/LoadingIndicator";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/state";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getItemsFromMultipleFeeds } from "./server/feedsCRUD";
import { Button } from "@/components/ui/button";

export default function Stories({ feeds }: { feeds: string[] }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [view] = useAtom(viewAtom)

  useEffect(() => {
    setCurrentPage(1)
  }, [feeds])

  const { isPending, error, data: stories } = useQuery({
    queryKey: ['landing', feeds, currentPage],
    queryFn: async () => {
      return await getItemsFromMultipleFeeds(feeds, currentPage)
    },
    placeholderData: keepPreviousData
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
  const currentStories = stories.items.slice(indexOfFirstStory, indexOfLastStory)
  const totalPages = Math.ceil(stories.totalItems / storiesPerPage)

  if (feeds.length === 0) {
    return (
      <div className="w-full text-center py-4 grow flex flex-col justify-center">
        <div>
          <p className="text-muted-foreground mb-4">Welcome to the open feed reader!</p>
          <Button variant="outline">Show home page suggestions</Button>
        </div>
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