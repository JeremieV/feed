"use client"

import Stories from "../../Stories";
import { faviconUrl } from "@/lib/helpers";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addSubscription, getFeedInfo, getItemsFromMultipleFeeds } from "@/app/server/queries";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function FeedPage({ params }: { params: { feed: string } }) {
  // const [subscriptions] = useAtom(loadableSubscriptionsAtom)
  const decodedFeedURI = decodeURIComponent(params.feed)

  const subscribe = useMutation({
    mutationFn: () => addSubscription(decodedFeedURI),
    onError: (error) => {
      // An error happened!
      console.log(`There was an error adding the subscription: ${error}`)
    },
    onSuccess: () => {
      console.log('success')
    },
  })


  const { isPending, error, data } = useQuery({
    queryKey: ['feed', decodedFeedURI],
    queryFn: async () => {
      console.log("starting to load")
      return await getFeedInfo(decodedFeedURI)
    }
  })

  if (isPending) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.name} {error.message}</div>
  }

  return (
    <div>
      {/* feed cover image */}
      {/* commented next line because of horrendous result */}
      {/* {feedMeta?.image && <img src={feedMeta?.image} alt="" className="w-full rounded-md mb-6" />} */}
      <div className="flex mb-10">
        {/* webiste favicon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={faviconUrl(data?.link ?? "")} alt="" className="aspect-square w-20 h-20 object-cover rounded-md mr-4" />
        <div>
          <h1 className="font-semibold text-2xl flex items-center gap-2"><a href={data?.link ?? ''} target="_blank" className="hover:underline">{data?.title}</a><SquareArrowOutUpRight className="w-5 h-5" /></h1>
          <p className="text-muted-foreground">{data?.url}</p>
          <p className="mb-4">{data?.description}</p>
          {/* {subscriptions.state === 'hasData' ?
            subscriptions.data.find(s => s.url === decodedFeedURI) ?
              <Button onClick={() => { }} variant="outline">Unsubscribe</Button> :
              <Button onClick={() => { subscribe.mutate() }}>Subscribe</Button>
            : 
          } */}
          <Button onClick={() => { }} disabled>Loading...</Button>
          {/* setSubscriptions(subscriptions.filter(s => s.url !== data?.url)) */}
          {/* setSubscriptions([{ name: data?.title ?? '', url: data?.url ?? '' }, ...subscriptions]) */}
        </div>
      </div>
      <Stories queryFn={({ pageParam }) => getItemsFromMultipleFeeds([decodedFeedURI], pageParam)}
        queryKey={['feed', params.feed]} />
    </div>
  )
}