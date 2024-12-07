"use client"

import ControlBar from "./ControlBar"
import { Button } from "@/components/ui/button";
import React, { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
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
import SearchBar from "@/components/SearchBar";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient())
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const [searchBarFocused, setSearchBarFocused] = useState(false)

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
