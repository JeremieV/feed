"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { displayUrl, urlToRSS } from "@/lib/helpers"
import { useState, useRef } from 'react'

export default function SearchBar() {
  async function addFeed() {
    // validate url
    // if (!inputValue
    //   || !inputValue.startsWith('http')
    //   || feeds.includes(inputValue)) {
    //   return
    // }
    // setFeeds([...feeds, await urlToRSS(inputValue)])
    // setInputValue('')
    // inputRef.current?.focus()
  }

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const handleKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // validate url
      addFeed()
    }
  }

  return (
    <div className="flex w-full items-center space-x-2 pb-4">
      <Input
        type="text"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter RSS feed url (or youtube, medium, substack, reddit...)"
      />
      <Button variant="secondary" onClick={() => addFeed()}>Add</Button>
    </div>
  )
}