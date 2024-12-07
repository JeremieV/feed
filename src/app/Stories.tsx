"use client"

import { Fragment } from "react";
import GridView from "./GridView"
import ListView from "./ListView"
import LoadingIndicator from "@/components/LoadingIndicator";
import { useAtom } from "jotai";
import { viewAtom } from "@/lib/state";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/types";

export default function Stories({ queryKey, queryFn }: { queryKey: string[], queryFn: ({ pageParam }: { pageParam: number }) => Promise<Link[]> }) {
  const [view] = useAtom(viewAtom)

  const {
    data: stories,
    isPending,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
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

  if (!stories?.pages) {
    return <div>Error</div>
  }

  const currentStories = stories?.pages.flatMap(page => page) ?? []

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