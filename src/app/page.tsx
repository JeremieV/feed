"use client"

import Stories from './Stories'

export default function Page({ searchParams }: { searchParams: { feeds: string } }) {
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];

  return (
    <Stories feeds={feeds}></Stories>
  )
}
