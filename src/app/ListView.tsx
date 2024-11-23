import Upvote from "@/components/upvote";
import { displayTimeAgo, displayUrl } from "@/lib/helpers";
import { Story } from "@/lib/types";

export default function ListView({ currentStories }: { currentStories: Story[] }) {
  return (
    <div className="overflow-hidden mb-4">
      {currentStories.map((story) => (
        <div key={story.url} className='flex flex-col py-2 px-[1px] items-start'>
          <a href={story.url ?? ''} target="_blank" title={story.title ?? ''} rel="noopener noreferrer" className='hover:underline text-foreground line-clamp-3'>{story.title}</a>
          <div className='text-muted-foreground text-sm flex'>
            <a href={`/feed/${encodeURIComponent(story.feedUrl ?? '')}`} title={story.title ?? ''} className="hover:text-primary transition-colors">{displayUrl(story.url ?? '')}</a>
            <span className="mx-1">{`•`}</span><Upvote upvoted={false} count={0} />
            <span className="mx-1">{`•`}</span><span>{displayTimeAgo(story.pubDate ?? '')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}