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
  const [indexFocused, setIndexFocused] = useState(0)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowSuggestions(true)
  }

  const router = useRouter();
  async function gotoFeedPage(url: string) {
    setShowSuggestions(false)
    router.push(`/feed/${encodeURIComponent(url)}`)
  }

  // TODO implement up/down keys navigation, and 'Enter' to submit
  useEffect(() => {
    const down = (e: KeyboardEvent) => {

      // search bar shortcut
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // keys to navigate the suggestions
      // if (showSuggestions && suggestions?.length) {
      // }
      if (e.key === "ArrowDown") {
        setIndexFocused((prev) => (prev + 1))
      }
      if (e.key === "ArrowUp") {
        setIndexFocused((prev) => (prev - 1))
      }
      if (e.key === "Enter") {
        console.log('enter pressed')
        if (indexFocused === 0 && isValidUrl(searchTerm)) {
          // TODO url to RSS conversion and real search
          const url = urlToRSS(searchTerm)
          gotoFeedPage(searchTerm)
        } else if (indexFocused !== 0) {
          const focused = suggestions?.[indexFocused].url;
          if (focused) {
            gotoFeedPage(focused)
          }
        }
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  function isValidUrl(url: string) {
    try { new URL(url) } catch { return false }
    return true;
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { isPending, data: suggestions } = useQuery({
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
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="mx-0"></Input>
        {
          showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full max-w-2xl bg-card border border-muted mt-2 rounded-md shadow-lg max-h-[70svh] overflow-scroll"
            >
              {suggestions?.length ? (
                suggestions.map((s, index) => (
                  <a
                    onMouseOver={() => setIndexFocused(index)}
                    href={`/feed/${encodeURIComponent(s.url)}`}
                    key={index}
                    className={`px-4 py-2 ${index === (indexFocused % suggestions.length) ? 'bg-muted' : ''} cursor-pointer flex items-center`}
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
    // <>
    //   <div className="lg:hidden grow"></div>
    //   <Button variant="outline" className="gap-2 md:w-full max-w-2xl justify-end md:justify-between mx-auto" onClick={() => setOpen(true)}>
    //     <span className="sr-only md:not-sr-only min-w-80 text-left text-muted-foreground">Search</span>
    //     <div className="grow hidden lg:block"></div>
    //     <kbd className="hidden lg:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
    //       <span className="text-xs">⌘</span>K
    //     </kbd>
    //     <Separator orientation="vertical" className="hidden lg:block" />
    //     <Search size={20} strokeWidth={1.2} className="md:mx-1" />
    //   </Button>
    //   {/* CommandDialog is giving a lot of trouble. Maybe use a select instead? */}
    //   <CommandDialog open={open} onOpenChange={setOpen}>
    //     <CommandInput placeholder={placeholder} onInput={v => setInputValue(v?.currentTarget.value)} onKeyDown={async (e) => e.code === 'Enter' && isValidUrl(inputValue) && gotoFeedPage(await urlToRSS(inputValue))} />
    //     <CommandList>
    //       <CommandEmpty>{isPending ? 'Loading...' : 'No results found.'}</CommandEmpty>
    //       {suggestions?.map(s =>
    //         <CommandItem key={s.url} className="rounded-none hover:cursor-pointer" onSelect={() => gotoFeedPage(s.url)}>
    //           {/* eslint-disable-next-line @next/next/no-img-element */}
    //           <img src={faviconUrl(s.link ?? '')} alt="" className="aspect-square w-6 h-6 rounded-md mr-4" />
    //           <span>{s.title}</span>
    //         </CommandItem>
    //       )}
    //     </CommandList>
    //   </CommandDialog>
    // </>
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