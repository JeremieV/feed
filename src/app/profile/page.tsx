"use client"

import { Plus } from "lucide-react"

export default function Page() {
  return (
    <div>
      <div>profile picture</div>
      <h1>Name</h1>
      <p>Description</p>
      <p>Make your account public (others will be able to follow you & see your upvotes and subscriptions)</p>
      <div className="grid grid-cols-3">
        <div className="border-2 border-dashed aspect-video rounded-md place-content-center cursor-pointer">
          <Plus className="w-20 h-20 stroke-border stroke-[1.5] mx-auto"></Plus>
        </div>
      </div>
    </div>
  )
}