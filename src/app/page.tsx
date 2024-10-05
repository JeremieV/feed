"use client"

import { Fragment } from "react";
import ControlBar from "./ControlBar"
import Stories from './Stories'

export default function Page({ searchParams }: { searchParams: { view: string, feeds: string } }) {
  const view: 'list' | 'grid' = searchParams.view === 'list' ? 'list' : 'grid';
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];

  return (
    <Fragment>
      <ControlBar view={view} feeds={feeds} />
      <Stories view={view} feeds={feeds}></Stories>
    </Fragment>
  )
}
