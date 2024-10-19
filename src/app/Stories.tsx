"use client"

import { Fragment, useState } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import LoadingIndicator from "@/components/LoadingIndicator";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/state";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getItemsFromMultipleFeeds, getRecommendedStories } from "./server/feedsCRUD";
import { Button } from "@/components/ui/button";

export default function Stories({ feeds }: { feeds: string[] }) {
  const [view] = useAtom(viewAtom)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const {
    data: stories,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['landing', feeds],
    queryFn: async ({ pageParam }) => {
      if (feeds.length === 0) {
        return await getRecommendedStories()
      }
      return await getItemsFromMultipleFeeds(feeds, pageParam)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) return undefined
      return lastPageParam + 1
    },
  })

  if (isPending && !isFetchingNextPage) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.name} {error.message}</div>
  }

  const currentStories = stories?.pages.flatMap(page => page) || []

  if (feeds.length === 0 && !showSuggestions) {
    return (
      <div className="w-full text-center py-4 grow flex flex-col justify-center">
        <div>
          <p className="text-muted-foreground mb-4">Welcome to the open feed reader!</p>
          <Button variant="outline" onClick={() => setShowSuggestions(true)}>Show home page suggestions</Button>
        </div>
      </div>
    )
  }

  return (
    <Fragment>
      {view === 'grid' ? (
        <GridView currentStories={currentStories} />
      ) : (
        <ListView currentStories={currentStories} />
      )}
      {hasNextPage &&
        <div className="flex justify-center">
          <Button
            onClick={() => !isFetching && fetchNextPage()}
            disabled={isFetching}
            variant="outline"
          >
            More stories
          </Button>
        </div>
      }
    </Fragment>
  )
}