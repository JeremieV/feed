"use client"

import ControlBar from "./ControlBar"
import Stories from './Stories'
import { Button } from "@/components/ui/button";
import { faviconUrl } from "@/lib/helpers";

import { Input } from "@/components/ui/input";
// import { displayUrl, urlToRSS } from "@/lib/helpers"
import React, { useState, useRef } from 'react'
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'

export default function Page({ searchParams }: { searchParams: { view: string, feeds: string } }) {
  const view: 'list' | 'grid' = searchParams.view === 'list' ? 'list' : 'grid';
  const feeds: string[] = searchParams.feeds?.split(',').filter(x => x).map(decodeURIComponent) || [];

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const subscriptions: { name: string, url: string }[] = [
    { name: "BBC", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "NPR", url: "https://www.npr.org/rss/rss.php" },
    { name: "Pew Research", url: "https://www.pewresearch.org/feed/" },
    { name: "Al Jazeera", url: "http://www.aljazeera.com/xml/rss/all.xml" },
  ]

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

  const Logo = () => (
    <div className="h-16 flex items-center">
      <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span className="sr-only">Open sidebar</span>
        <Menu />
      </Button>
      <div className="grow text-center">
        <h1 className="text-xl font-bold"><a href="/">OpenFeed</a></h1>
      </div>
    </div>
  )

  const SideBar = () => (
    <div className="h-svh overflow-hidden sticky top-0 flex flex-col px-4 bg-card border-r">
      <Logo />
      <p className='p-8 mb-4 text-sm text-center bg-muted rounded-md text-muted-foreground'>
        <a href="https://github.com/jeremiev/feed" className='underline'>Open source</a>, made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a>
      </p>
      <h2 className="font-semibold mb-2">Subscriptions</h2>
      {subscriptions.map(s => (
        <Button variant="ghost" className="justify-start gap-4 overflow-clip" key={s.url}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={faviconUrl(s.url)} alt="" className="aspect-square w-6 h-6 rounded-md" />
          <span>{s.name}</span>
        </Button>
      ))}
    </div>
  )

  return (
    <>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />
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
      <div className="lg:pl-72">
        {/* header */}
        <div className="sticky top-0 z-40 bg-card px-4">
          <div className="flex h-16 shrink-0 items-center gap-x-2">
            <div className="lg:hidden">
              <Logo />
            </div>
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
          <div className="pt-2 pb-4 mb-1">
            <ControlBar view={view} feeds={feeds} />
          </div>
        </div>

        <main className="w-full max-w-6xl mx-auto flex flex-col pb-4 px-4" id='top'>
          <Stories view={view} feeds={feeds}></Stories>
        </main>
      </div>
    </>
  )
}
