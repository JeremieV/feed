"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BottomBar({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
  return (
    <div className="flex justify-between items-center">
      <Button
        // onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <span className="text-foreground">Page {currentPage} of {totalPages}</span>
      <Button
        // onClick={() => {
        //   paginate(currentPage + 1)
        //   const topElement = document.getElementById('top');
        //   topElement?.scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'start'
        //   });
        // }}
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}