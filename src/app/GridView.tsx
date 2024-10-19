"use client"

import { displayTimeAgo, displayUrl, faviconUrl } from "@/lib/helpers"
import { Story } from "@/lib/types"
import Thumbnail from "./Thumbnail"
import { TwitterTweetEmbed } from 'react-twitter-embed'
import Upvote from "@/components/upvote"
// import { Skeleton } from "@/components/ui/skeleton"

export default function GridView({ currentStories }: { currentStories: Story[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      {currentStories.map((story) => (
        <GridComponent key={story.url} story={story} />
      ))}
    </div>
  )
}

function GridComponent({ story }: { story: Story }) {
  // if (!metadata) {
  //   return <GridComponentSkeleton />
  // }

  function isTweet(url: string) {
    const regex = /status\/(\d+)$/;
    const match = url.match(regex);
    return match && (story.url.startsWith('https://twitter.com') || story.url.startsWith('https://x.com'))
  }

  function tweetId(url: string) {
    const regex = /status\/(\d+)$/;
    const match = url.match(regex)!;
    return match[1]
  }

  return (
    <a
      key={story.url}
      href={story.url}
      title={story.title}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md overflow-hidden"
    >
      <div className='aspect-video w-full overflow-hidden' title={story.description ?? ''}>
        {isTweet(story.url) ?
          (
            <div className="aspect-video w-full overflow-scroll rounded-xl overscroll-none">
              <div className="pointer-events-none">
                <TwitterTweetEmbed
                  onLoad={function noRefCheck() { }}
                  tweetId={tweetId(story.url)}
                />
              </div>
            </div>
          )
          :
          story.thumbnail ?
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={story.thumbnail}
              alt={story.title}
              className="w-full h-full object-cover rounded-md text-left leading-tight line-clamp-3"
            />
            :
            <Thumbnail title={story.title} />
        }
      </div>
      <div className="flex">
        <div className='pt-3 min-w-10'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconUrl(story.url)}
            alt=""
            className="aspect-square rounded-md w-10 h-10 object-cover" />
        </div>
        <div className="p-3 flex flex-col gap-1">
          <h2 className="font-semibold text-foreground line-clamp-2">{story.title}</h2>
          <div className="text-sm text-muted-foreground flex flex-col gap-1">
            <div><a href={`/feed/${encodeURIComponent(story.feedUrl)}`} title={story.feedUrl} className="hover:text-primary transition-colors">{displayUrl(story.url)}</a></div>
            <div><Upvote upvoted={false} count={0} /><span className="mx-1">{`•`}</span><span>{displayTimeAgo(story.pubDate)}</span></div>
          </div>
        </div>
      </div>
    </a>
  )
}

// function GridComponentSkeleton() {
//   return (
//     <div className="block rounded-md text-transparent overflow-hidden">
//       <div className='aspect-video w-full overflow-hidden'>
//         <Skeleton className="w-full h-full object-cover rounded-md" />
//       </div>
//       <div className="flex">
//         <div className='pt-3 min-w-10'>
//           <Skeleton className='aspect-square rounded-md w-10 h-10 object-cover'></Skeleton>
//         </div>
//         <div className="p-3 flex flex-col gap-1">
//           <Skeleton className="font-semibold line-clamp-2 flex w-full">Pretending to be a title and to be a long title</Skeleton>
//           <div className="text-sm flex flex-col gap-1 max-w-[50%]">
//             <Skeleton>host</Skeleton>
//             <Skeleton>date skeleton</Skeleton>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }