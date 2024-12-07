"use client"

import ControlBar from "./ControlBar"
import { Button } from "@/components/ui/button";
import { faviconUrl } from "@/lib/helpers";
import { Separator } from "@/components/ui/separator";
import React, { useState } from 'react'
import { Search } from "lucide-react";
import { urlToRSS } from "@/lib/helpers"
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import { useRouter } from "next/navigation";
import { searchFeeds } from "./server/queries";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Provider, useAtom } from 'jotai'
import SideBar from "@/components/SideBar";
import Logo from "@/components/Logo";
import { sidebarOpenAtom } from "@/lib/state";

function SearchBar() {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
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

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient())
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        {/* Mobile sidebar */}
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop transition className="fixed inset-0 bg-black/60 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />
          <div className="fixed inset-0 flex">
            <DialogPanel transition className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full">
              <SideBar />
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <SideBar />
        </div>

        {/* Main content area */}
        <div className="lg:pl-72 min-h-svh [&>*]:max-w-6xl [&>*]:mx-auto">
          {/* header */}
          <div className="sticky top-0 z-40 bg-[#ffffff] dark:bg-[#0a0a0a] px-4">
            <div className="flex h-16 shrink-0 items-center gap-x-2">
              <div className="lg:hidden">
                <Logo />
              </div>
              <SearchBar />
              <SignedOut>
                <SignInButton>
                  <Button variant="outline">Sign in</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton>
                  <Button>Sign out</Button>
                </UserButton>
              </SignedIn>
            </div>
            <div className="pb-4 mb-1">
              <ControlBar />
            </div>
          </div>

          <main className="flex flex-col pb-4 px-4" id='top'>
            {children}
          </main>
        </div>
      </Provider>
    </QueryClientProvider>
  )
}
