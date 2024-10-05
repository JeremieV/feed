"use client"

import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { faviconUrl } from "@/lib/helpers";

export default function Scaffold({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [sideBarExpanded, setSideBarExpanded] = useState(true)

  const subscriptions = [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.npr.org/rss/rss.php",
    "https://www.pewresearch.org/feed/",
    "http://www.aljazeera.com/xml/rss/all.xml",
  ]

  return (
    <div className="flex">
      {/* sidebar div */}
      <div className="h-svh flex flex-col border-r p-4">
        <div className="flex py-4">
          <Button variant="ghost"><Menu /></Button>
          <div>
            <h1 className="text-xl font-bold"><a href="/">OpenFeed</a></h1>
            <p className='mb-8 text-sm'>
              <a href="https://github.com/jeremiev/feed" className='underline'>Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a>
            </p>
          </div>
        </div>
        {subscriptions.map(feed => (
          <Button variant="ghost" className="justify-start gap-2" key={feed}>
            <img src={faviconUrl(feed)} alt="" className="aspect-square w-6 h-6 rounded-md" />
            {feed}
          </Button>
        ))}
      </div>
      <div className="w-full max-w-6xl mx-auto p-4 min-h-svh flex flex-col" id='top'>
        <SearchBar />
        {children}
      </div>
    </div>
  )
}