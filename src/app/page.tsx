"use client"

import ControlBar from "./ControlBar"
import Stories from './Stories'
import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { faviconUrl } from "@/lib/helpers";

export default function Page({ searchParams }: { searchParams: { view: string, feeds: string } }) {
  const view: 'list' | 'grid' = searchParams.view === 'list' ? 'list' : 'grid';
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];

  const subscriptions = [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.npr.org/rss/rss.php",
    "https://www.pewresearch.org/feed/",
    "http://www.aljazeera.com/xml/rss/all.xml",
  ]


  return (
    <div className="flex">
      {/* sidebar div */}
      <div className="h-svh max-w-60 overflow-hidden sticky top-0 flex flex-col border-r p-2">
        <div className="flex pb-4 items-center">
          <Button variant="ghost"><Menu /></Button>
          <div className="grow text-center">
            <h1 className="text-xl font-bold"><a href="/">OpenFeed</a></h1>
          </div>
        </div>
        <p className='p-8 mb-4 text-sm text-center bg-muted rounded-md text-muted-foreground'>
          <a href="https://github.com/jeremiev/feed" className='underline'>Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a>
        </p>
        <h2 className="font-semibold mb-2">Subscriptions</h2>
        {subscriptions.map(feed => (
          <Button variant="ghost" className="justify-start gap-2 overflow-clip" key={feed}>
            <img src={faviconUrl(feed)} alt="" className="aspect-square w-6 h-6 rounded-md" />
            {feed}
          </Button>
        ))}
      </div>
      <div className="w-full max-w-6xl mx-auto min-h-svh flex flex-col pb-4" id='top'>
        <div className="sticky top-0 bg-white dark:bg-black pt-2 pb-4 z-20 mb-1">
          <SearchBar />
          <ControlBar view={view} feeds={feeds} />
        </div>
        <Stories view={view} feeds={feeds}></Stories>
      </div>
    </div>
  )
}
