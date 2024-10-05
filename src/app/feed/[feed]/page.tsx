"use client"
// https%3A%2F%2Fwww.vox.com%2Frss%2Findex.xml

import { useEffect, useState } from "react";
import Stories from "../../Stories";
import { fetchFeedMeta, RSSFeedMeta } from "@/lib/fetchRSS";
import { faviconUrl } from "@/lib/helpers";
import { SquareArrowOutUpRight } from "lucide-react";


export default function FeedPage({ params }: { params: { feed: string } }) {
  const [feedMeta, setFeedMeta] = useState<RSSFeedMeta | null>(null)

  useEffect(() => {
    async function request() {
      const feedMeta = await fetchFeedMeta(decodeURIComponent(params.feed))
      if (feedMeta) {
        setFeedMeta(feedMeta)
      }
    }

    request()
  }, [])

  return (
    <div>
      <img src={feedMeta?.image} alt="" className="" />
      {/* favicon */}
      <div className="flex mb-10">
        <img src={faviconUrl(feedMeta?.link ?? "")} alt="" className="aspect-square w-20 h-20 object-cover rounded-md p-1 mr-10" />
        <div>
          <h1 className="font-semibold text-2xl flex items-center gap-2 mb-4"><a href={feedMeta?.link} className="hover:underline">{feedMeta?.title}</a><SquareArrowOutUpRight className="w-5 h-5" /></h1>
          <p>{feedMeta?.description}</p>
        </div>
      </div>
      <Stories feeds={[decodeURIComponent(params.feed)]} view="list" />
    </div>
  )
}