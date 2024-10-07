"use client"

import { useAtom } from 'jotai'
import Stories from './Stories'
import { frontPageFeedsAtom } from '@/lib/state'

export default function Page() {
  const [feeds] = useAtom(frontPageFeedsAtom)

  return (
    <Stories feeds={feeds}></Stories>
  )
}
