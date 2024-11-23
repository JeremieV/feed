"use client"

import Stories from "../../Stories";
import { faviconUrl } from "@/lib/helpers";
import { SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscriptionsAtom } from "@/lib/state";
import { useAtom } from "jotai";
import { useQuery } from "@tanstack/react-query";
import { getFeedInfo } from "@/app/server/feedsCRUD";
import LoadingIndicator from "@/components/LoadingIndicator";

export default function FeedPage({ params }: { params: { feed: string } }) {
  const [subscriptions, setSubscriptions] = useAtom(subscriptionsAtom)

  const { isPending, error, data } = useQuery({
    queryKey: ['feed', decodeURIComponent(params.feed)],
    queryFn: async () => {
      console.log("starting to load")
      return await getFeedInfo(decodeURIComponent(params.feed))
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
          {subscriptions.find(s => s.url === decodeURIComponent(params.feed)) ?
            <Button onClick={() => setSubscriptions(subscriptions.filter(s => s.url !== data?.url))} variant="outline">Unsubscribe</Button> :
            <Button onClick={() => setSubscriptions([{ name: data?.title ?? '', url: data?.url ?? '' }, ...subscriptions])}>Subscribe</Button>
          }
        </div>
      </div>
      <Stories feeds={[decodeURIComponent(params.feed)]} />
    </div>
  )
}