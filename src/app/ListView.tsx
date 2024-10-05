import { displayTimeAgo, displayUrl } from "@/lib/helpers";
import { Story } from "@/lib/types";

export default function ListView({ currentStories }: { currentStories: Story[], currentPage: number }) {
  return (
    <div className="overflow-hidden mb-4">
      {currentStories.map((story) => (
        <a
          key={story.id}
          href={story.url}
          target="_blank"
          title={story.title}
          rel="noopener noreferrer"
          className="flex py-2"
        >
          <div className='flex flex-col'>
            <span className='hover:underline text-foreground line-clamp-3'>{story.title}</span>
            <div className='text-muted-foreground text-sm flex'>
              <a href={`/feed/${encodeURIComponent(story.feedUrl)}`} title={story.feedTitle} className="hover:text-primary transition-colors">{displayUrl(story.url)}</a>
              <span className="mx-1">{`•`}</span><span>{displayTimeAgo(story.published)}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}