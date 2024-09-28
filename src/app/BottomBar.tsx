"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation"

export default function BottomBar({ currentPage, totalPages, view, icons, feeds }: { currentPage: number, totalPages: number, view: 'list' | 'grid', icons: 'true' | 'false', feeds: string[] }) {
  const router = useRouter()

  function paginate(n: number) {
    // const topElement = document.getElementById('top');
    // topElement?.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start'
    // });
    router.push(`?view=${view}&icons=${icons}&feeds=${feeds.map(encodeURIComponent).join(',')}&page=${n}`)
  }

  return (
    <div className="flex justify-between items-center">
      <Button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <span className="text-foreground">Page {currentPage} of {totalPages}</span>
      <Button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}