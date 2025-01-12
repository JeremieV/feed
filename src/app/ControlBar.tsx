"use client"

import { Button } from "@/components/ui/button"
import { viewAtom } from "@/lib/state"
import { useAtom } from "jotai"
import { Grid3X3, List } from "lucide-react"

export default function ControlBar() {
  const [view, setView] = useAtom(viewAtom)

  return (
    <Button onClick={() => setView(view === 'list' ? 'grid' : 'list')} variant="outline" size={"icon"}>
      <span className="sr-only">{view === 'grid' ? 'List' : 'Grid'}</span>
      {view === 'grid' ? <List strokeWidth={1.3} /> : <Grid3X3 strokeWidth={1.3} />}
    </Button>
  )
}