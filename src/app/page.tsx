"use client"

import { getRecommendedStories } from './server/queries'
import Stories from './Stories'

export default function Page() {
  return (
    <Stories
      queryFn={({ pageParam }) => getRecommendedStories()}
      queryKey={['recommedended']} />
  )
}
