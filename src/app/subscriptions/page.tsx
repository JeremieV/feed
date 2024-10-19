"use client"

import { subscriptionsAtom } from "@/lib/state";
import Stories from "../Stories";
import { useAtomValue } from "jotai";

export default function Page() {
  const subscriptions = useAtomValue(subscriptionsAtom)

  return (
    <Stories feeds={subscriptions.map(feed => feed.url)}></Stories>
  )
}