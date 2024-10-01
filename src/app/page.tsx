"use client"

import ControlBar from "./ControlBar"
import Stories from './Stories'

export default function Page({ searchParams }: { searchParams: { view: string, feeds: string } }) {
  const view: 'list' | 'grid' = searchParams.view === 'list' ? 'list' : 'grid';
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 min-h-svh flex flex-col" id='top'>
      <h1 className="text-2xl font-bold">OpenFeed</h1>
      <p className='mb-8'><a href="https://github.com/jeremiev/rss-feed" className='underline'>
        Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
      <ControlBar view={view} feeds={feeds} />
      <Stories view={view} feeds={feeds}></Stories>
    </div>
  )
}
