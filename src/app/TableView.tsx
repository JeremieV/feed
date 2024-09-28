import { displayUrl } from "@/lib/helpers";
import { Story } from "@/lib/types";

export default function TableView({ currentStories, icons }: { currentStories: Story[], currentPage: number, icons: 'true' | 'false' }) {
  return (
    <div className="border border-border rounded-md overflow-hidden mb-4">
      <table className="w-full">
        <tbody>
          {currentStories.map((story) => (
            <tr key={story.id} className={`first:border-t-0 border-t border-border transition-colors bg-background`}>
              <td className="p-3">
                <a
                  href={story.url}
                  target="_blank"
                  title={story.title}
                  rel="noopener noreferrer"
                  className="flex"
                >
                  {icons === 'true' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(story.url).hostname)}.ico`}
                      alt=""
                      className="aspect-square rounded-md w-5 h-5 object-cover mt-1 mr-3" />
                  )}
                  <div className='flex flex-col'>
                    <span className='hover:underline'>{story.title}</span>
                    <div className='text-muted-foreground text-sm flex'>
                      <div title={story.url} className="hover:text-primary transition-colors">{displayUrl(story.url)}</div>
                      <span> {` · `} {new Date(story.published).toLocaleDateString()}</span>
                    </div>
                  </div>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}