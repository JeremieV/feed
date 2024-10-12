"use client"

import { Button } from "@/components/ui/button"
import { frontPageTopicAtom, topics, viewAtom } from "@/lib/state"
import { useAtom } from "jotai"
import { usePathname } from "next/navigation"

export default function ControlBar() {
  const [view, setView] = useAtom(viewAtom)
  const [frontPageTopic, setFrontPageTopic] = useAtom(frontPageTopicAtom)
  const pathname = usePathname();

  return (
    <div className="flex justify-between">
      {pathname === '/' ?
        <div className="flex flex-wrap gap-2 mr-2">
          {Object.getOwnPropertyNames(topics).map(topic => (
            <Button
              key={topic}
              title={topic}
              variant={topic === frontPageTopic ? "default" : "secondary"}
              onClick={() => topic === frontPageTopic ? setFrontPageTopic(undefined) : setFrontPageTopic(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
        : <div></div>
      }
      <Button onClick={() => setView(view === 'list' ? 'grid' : 'list')} variant="outline">
        {view === 'grid' ? 'List' : 'Grid'}
      </Button>
    </div>
  )
}