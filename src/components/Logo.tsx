import { Button } from "@headlessui/react";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="h-16 flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu strokeWidth={1.5} />
      </Button>
      <div>
        <h1 className="text-xl font-bold"><Link href="/">OpenFeed</Link></h1>
      </div>
    </div>
  )
}