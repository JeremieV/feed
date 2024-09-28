import GridView from "./GridView"
import TableView from "./TableView"
import { fetchStories } from '@/lib/fetchRSS'

export default async function Stories({ view, icons, feeds }: { view: 'list' | 'grid', icons: 'true' | 'false', feeds: string[] }) {
  const stories = await fetchStories(feeds);
  const currentPage = 1
  const storiesPerPage = 60

  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  // const paginate = (pageNumber: number) => 0
  const indexOfLastStory = currentPage * storiesPerPage
  const indexOfFirstStory = indexOfLastStory - storiesPerPage
  const currentStories = stories.slice(indexOfFirstStory, indexOfLastStory)
  // const totalPages = Math.ceil(stories.length / storiesPerPage)

  return (
    view === 'grid' ? (
      <GridView currentStories={currentStories} icons={icons} />
    ) : (
      <TableView currentStories={currentStories} currentPage={currentPage} icons={icons} />
    )
  )
}
// {/* {false ? ( // was error
//     <div className="w-full text-center py-4">
//       <p className="text-red-500">{error}</p>
//     </div>
//   ) : feeds.length === 0 ? (
//     <div className="w-full text-center py-4 grow flex flex-col justify-center">
//       <p className="text-muted-foreground">Welcome to the open feed reader!</p>
//       <p className="text-muted-foreground">Here you can build any feed you like. To save it, bookmark the resulting URL.</p>
//       <p className="text-muted-foreground">Add some feeds to get started (top left)</p>
//     </div>
//   )
//   } */}