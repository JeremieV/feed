"use client"

import { useQuery } from "@tanstack/react-query"
import { getProfile, getUserUpvotedLinks } from "../server/queries"
import Stories from "../Stories"

export default function Page() {
  const { isPending, error, data: profile } = useQuery({
    refetchOnWindowFocus: false,
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
          <div>
            <h1 className="text-3xl">{profile?.username}</h1>

          </div>
          <p>{profile?.description}</p>
        </div>
      </div>

      <p>Make your account public (others will be able to follow you & see your upvotes and subscriptions)</p>

      {/* {profile} */}
      {/* <FormField
        control={form.control}
        name="security_emails"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Security emails</FormLabel>
              <FormDescription>
                Receive emails about your account security.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled
                aria-readonly
              />
            </FormControl>
          </FormItem>
        )}
      /> */}

      <h2 className="text-3xl my-4">Upvotes</h2>
      <Stories
        queryFn={({ pageParam }) => getUserUpvotedLinks(profile!.userId, pageParam)}
        queryKey={['upvoted_stories']} />
    </div>
  )
}