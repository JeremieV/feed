"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile, getUserUpvotedLinks } from "../server/queries"
import Stories from "../Stories"

export default function Page() {
  const { isPending, error, data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await getProfile()
    }
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.name} {error.message}</div>
  }

  return (
    <div>
      <div className="flex mb-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profile?.avatar} alt={`${profile?.username ?? 'user'}'s profile picture`} className="rounded-full aspect-square w-20 h-20 object-cover" />
        <div className="ml-8">
          <h1 className="text-3xl">{profile?.username}</h1>
          <p>{profile?.description}</p>
        </div>
      </div>

      <p>Make your account public (others will be able to follow you & see your upvotes and subscriptions)</p>

      <h2 className="text-3xl my-4">Upvotes</h2>
      <Stories
        queryFn={({ pageParam }) => getUserUpvotedLinks(profile!.userId, pageParam)}
        queryKey={['upvoted_stories']} />
    </div>
  )
}