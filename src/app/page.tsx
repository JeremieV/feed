"use client"

import Stories from './Stories'

export default function Page({ searchParams }: { searchParams: { view: string, feeds: string } }) {
  const view: 'list' | 'grid' = searchParams.view === 'list' ? 'list' : 'grid';
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];

  return (
    <Stories view={view} feeds={feeds}></Stories>
  )
}
