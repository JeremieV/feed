"use client"

import { Button } from "@/components/ui/button"
import { frontPageTopicAtom, topics, viewAtom } from "@/lib/state"
import { useAtom } from "jotai"

export default function ControlBar() {
  const [view, setView] = useAtom(viewAtom)
  const [frontPageTopic, setFrontPageTopic] = useAtom(frontPageTopicAtom)

  return (
    <div>
      <div className="flex justify-between">
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
        <Button onClick={() => setView(view === 'list' ? 'grid' : 'list')} variant="outline">
          {view === 'grid' ? 'List' : 'Grid'}
        </Button>
      </div>
    </div>
  )
}