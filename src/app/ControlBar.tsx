"use client"

import { Button } from "@/components/ui/button"
import { viewAtom } from "@/lib/state"
import { useAtom } from "jotai"

export default function ControlBar() {
  const [view, setView] = useAtom(viewAtom)

  return (
    <div className="flex justify-end">
      <Button onClick={() => setView(view === 'list' ? 'grid' : 'list')} variant="outline">
        {view === 'grid' ? 'List' : 'Grid'}
      </Button>
    </div>
  )
}