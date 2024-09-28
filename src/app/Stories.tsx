import { Fragment } from "react";
import GridView from "./GridView"
import TableView from "./TableView"
import { fetchStories } from '@/lib/fetchRSS'
import BottomBar from "./BottomBar"

export default async function Stories({ view, icons, feeds, page }: { view: 'list' | 'grid', icons: 'true' | 'false', feeds: string[], page: number }) {
  const stories = await fetchStories(feeds);
  const currentPage = page
  const storiesPerPage = 60

  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)
  const totalPages = Math.ceil(stories.length / storiesPerPage)

  if (feeds.length === 0) {
    return (
      <div className="w-full text-center py-4 grow flex flex-col justify-center">
        <p className="text-muted-foreground">Welcome to the open feed reader!</p>
        <p className="text-muted-foreground">Here you can build any feed you like. To save it, bookmark the resulting URL.</p>
        <p className="text-muted-foreground">Add some feeds to get started (top left)</p>
      </div>
    )
  }

  return (
    <Fragment>
      {view === 'grid' ? (
        <GridView currentStories={currentStories} icons={icons} />
      ) : (
        <TableView currentStories={currentStories} currentPage={currentPage} icons={icons} />
      )}
      <BottomBar currentPage={page} totalPages={totalPages} view={view} icons={icons} feeds={feeds} />
    </Fragment>
  )
}
// {/* {false ? ( // was error
//     <div className="w-full text-center py-4">
//       <p className="text-red-500">{error}</p>
//     </div>
// */}