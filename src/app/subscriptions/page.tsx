"use client"

import Stories from "../Stories";
import { getItemsFromMultipleFeeds } from "../server/queries";
import { useSubscriptions } from "@/lib/hooks";

export default function Page() {
  const subscriptions = useSubscriptions()

  // TODO display something if the user is not signed in

  if (subscriptions.isPending || subscriptions.isLoading) {
    return <div>Loading subscriptions...</div>
  }

  if (subscriptions.isError) {
    return <div>Error: {subscriptions.error.message}</div>
  }

  if (subscriptions.isSuccess) {
    return (
      <Stories queryFn={({ pageParam }) => getItemsFromMultipleFeeds(subscriptions.data.map(s => s.url), pageParam)}
        queryKey={['subscriptions-feed']} />
    )
  }
}