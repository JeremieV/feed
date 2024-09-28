import { Suspense } from "react"
import ControlBar from "./ControlBar"
import Stories from './Stories'

export default async function Page({ searchParams }: { searchParams: { view: string, icons: string, feeds: string, page: number } }) {
  const view: 'list' | 'grid' = searchParams.view === 'list' ? 'list' : 'grid';
  const icons: 'false' | 'true' = searchParams.icons === 'false' ? 'false' : 'true';
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];
  const page: number = searchParams.page > 0 ? searchParams.page : 1;
  // typeof searchParams.page === 'number' &&

  return (
    <div className="w-full max-w-6xl mx-auto p-4 min-h-svh flex flex-col" id='top'>
      <h1 className="text-2xl font-bold">Customizable Feed</h1>
      <p className='mb-8'><a href="https://github.com/jeremiev/rss-feed" className='underline'>
        Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
      <ControlBar view={view} icons={icons} feeds={feeds} page={page} />
      <Suspense fallback={<LoadingIndicator />}>
        <Stories view={view} icons={icons} feeds={feeds} page={page}></Stories>
      </Suspense>
    </div>
  )
}

import { Loader2 } from "lucide-react";
function LoadingIndicator() {
  return (
    <div className="w-full mx-auto p-4 grow flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
