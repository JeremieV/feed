"use client"

import { ArrowLeft, Search } from "lucide-react";
import { urlToRSS } from "@/lib/helpers"
import { useRouter } from "next/navigation";
import { searchFeeds } from "@/app/server/queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useDebounce } from "@/lib/hooks";
import { useAtom } from "jotai";
import { searchBarOpenAtom, searchTermAtom } from "@/lib/state";

function InputField() {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  // const [indexFocused, setIndexFocused] = useState(0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    const handleFocus = () => {
      setShowSuggestions(true)
    }

    document.addEventListener('mousedown', handleClickOutside)
    inputRef.current?.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      inputRef.current?.removeEventListener('focus', handleFocus)
    }
  }, [searchTerm])

  const router = useRouter();
  function gotoFeedPage(url: string) {
    setShowSuggestions(false)
    console.log('navigating to', url)
    router.push(`/feed/${encodeURIComponent(url)}`)
  }

  function isValidUrl(url: string) {
    try { new URL(url); return true } catch { return false }
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: suggestions } = useQuery({
    queryKey: ['feeds-search', debouncedSearchTerm],
    queryFn: async () => {
      return await searchFeeds(debouncedSearchTerm)
    },
  })

  // const placeholder = "Search or paste URL (RSS, youtube, medium, substack, reddit)"

  return (
    <div className="flex gap-2 mx-auto w-full max-w-2xl justify-end md:justify-between">
      <div className="relative grow">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value
            console.log(value)
            setSearchTerm(value)
            setShowSuggestions(true)
          }}
          onKeyDown={async (e) => {
            // shortcut
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              inputRef.current?.focus()
            }
            // search
            if (e.key === "Enter") {
              console.log('enter pressed')
              if (isValidUrl(searchTerm)) {
                console.log('url', searchTerm)
                const url = await urlToRSS(searchTerm)
                console.log(url)
                gotoFeedPage(url)
                return
              } else {
                console.log('not url', searchTerm)
                // TODO replace this wih search
                gotoFeedPage(searchTerm)
              }
            }
          }}
          onFocus={() => setShowSuggestions(true)}
          className="mx-0">
        </Input>
        {
          showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full max-w-2xl bg-card border border-muted mt-2 rounded-md shadow-lg max-h-[70svh] overflow-scroll"
            >
              {suggestions?.length ? (
                suggestions.map((s, index) => (
                  <a
                    // onMouseOver={() => setIndexFocused(index)}
                    href={`/feed/${encodeURIComponent(s.url)}`}
                    key={index}
                    className={`px-4 py-2 cursor-pointer flex items-center`} // ${index === (indexFocused % suggestions.length) ? 'bg-muted' : ''}
                  >
                    <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                    {s.title}
                  </a>
                ))
              ) : (
                <div className="px-4 py-2">No suggestions found</div>
              )}
            </div>
          )
        }
      </div>
      <Button variant={"ghost"} className="mx-0">
        <Search size={20} strokeWidth={1.2} className="md:mx-1" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  )
}

export default function SearchBar() {
  const [searchBarOpen, setSearchBarOpen] = useAtom(searchBarOpenAtom)

  return (
    <>
      <div className="w-full hidden lg:block">
        <div className="flex gap-2 mx-auto md:w-full max-w-2xl justify-end md:justify-between">
          <InputField />
        </div>
      </div >
      <div>
        <Button variant={"ghost"} className="mx-0 lg:hidden" onClick={() => setSearchBarOpen(!searchBarOpen)}>
          <Search size={20} strokeWidth={1.2} className="md:mx-1" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      {searchBarOpen && (
        <div className="fixed left-0 lg:pl-72 z-50 w-full bg-[#ffffff] dark:bg-[#0a0a0a] lg:hidden">
          <div className="px-4 flex">
            <Button variant={"ghost"} className="mr-2">
              <ArrowLeft size={20} strokeWidth={1.2} className="md:mx-1" onClick={() => setSearchBarOpen(false)} />
            </Button>
            <InputField />
          </div >
        </div>
      )
      }
    </>

  )
}