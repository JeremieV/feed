"use client"

import { faviconUrl } from "@/lib/helpers";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { urlToRSS } from "@/lib/helpers"
import { useRouter } from "next/navigation";
import { searchFeeds } from "@/app/server/queries";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const router = useRouter();
  async function gotoFeedPage(url: string) {
    setOpen(false)
    router.push(`/feed/${encodeURIComponent(url)}`)
  }

  function isValidUrl(url: string) {
    try { new URL(url) } catch { return false }
    return true;
  }

  const [inputValue, setInputValue] = useState('')
  const { isPending, data: suggestions } = useQuery({
    queryKey: ['allFeeds'],
    queryFn: async () => {
      return await searchFeeds('')
    },
  })

  const placeholder = "Search or paste URL (RSS, youtube, medium, substack, reddit)"
  return (
    <>
      <div className="lg:hidden grow"></div>
      <Button variant="outline" className="gap-2 md:w-full max-w-2xl justify-end md:justify-between mx-auto" onClick={() => setOpen(true)}>
        <span className="sr-only md:not-sr-only min-w-80 text-left text-muted-foreground">Search</span>
        <div className="grow hidden lg:block"></div>
        <kbd className="hidden lg:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
        <Separator orientation="vertical" className="hidden lg:block" />
        <Search size={20} strokeWidth={1.2} className="md:mx-1" />
      </Button>
      {/* CommandDialog is giving a lot of trouble. Maybe use a select instead? */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={placeholder} onInput={v => setInputValue(v?.currentTarget.value)} onKeyDown={async (e) => e.code === 'Enter' && isValidUrl(inputValue) && gotoFeedPage(await urlToRSS(inputValue))} />
        <CommandList>
          <CommandEmpty>{isPending ? 'Loading...' : 'No results found.'}</CommandEmpty>
          {suggestions?.map(s =>
            <CommandItem key={s.url} className="rounded-none hover:cursor-pointer" onSelect={() => gotoFeedPage(s.url)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={faviconUrl(s.link ?? '')} alt="" className="aspect-square w-6 h-6 rounded-md mr-4" />
              <span>{s.title}</span>
            </CommandItem>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}