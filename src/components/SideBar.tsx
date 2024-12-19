import { useAuth } from "@clerk/nextjs";
import { CircleFadingArrowUp, House, Rss, SquareUserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link";
import Logo from "./Logo";
import { Separator } from "./ui/separator";
import { sidebarOpenAtom } from "@/lib/state";
import { useAtom } from "jotai";
import { faviconUrl } from "@/lib/helpers";
import { useSubscriptions } from "@/lib/hooks";

export default function SideBar() {
  const [, setSidebarOpen] = useAtom(sidebarOpenAtom)
  const { isSignedIn } = useAuth();
  const { isPending: subsIsPending, error: subsError, data: subsData } = useSubscriptions()

  return (
    <div className="h-screen overflow-hidden sticky top-0 bg-card border-r">
      <div className="h-svh flex flex-col overflow-y-scroll px-4">
        <Logo />
        <Link onClick={() => setSidebarOpen(false)} href={"/"} className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`}>
          <House strokeWidth={1.3} className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link onClick={() => setSidebarOpen(false)} href={"/subscriptions"} className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`}>
          <Rss strokeWidth={1.3} className="w-6 h-6" />
          <span>Subscriptions</span>
        </Link>
        <Separator className="my-4"></Separator>
        <h2 className="font-semibold mb-2">Your account</h2>
        <Link onClick={() => setSidebarOpen(false)} href="/profile" className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`}>
          <SquareUserRound strokeWidth={1.3} className="w-6 h-6" />
          <span>Your profile</span>
        </Link>
        {/* <Link onClick={() => setSidebarOpen(false)} href={""} className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`}>
          <History strokeWidth={1.3} className="w-6 h-6" />
          <span>History</span>
        </Link> */}
        <Link onClick={() => setSidebarOpen(false)} href={""} className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`}>
          <CircleFadingArrowUp strokeWidth={1.3} className="w-6 h-6" />
          <span>Upvotes</span>
        </Link>
        {/* <h2 className="font-semibold mb-2">Your topics</h2>
        <div className="flex flex-wrap gap-2 mr-2">
          {Object.getOwnPropertyNames(topics).map(topic => (
            <Button
              key={topic}
              title={topic}
              variant={topic === frontPageTopic ? "default" : "secondary"}
              onClick={() => topic === frontPageTopic ? setFrontPageTopic(undefined) : setFrontPageTopic(topic)}
            >
              {topic}
            </Button>
          ))}
        </div> */}
        <Separator className="my-4"></Separator>
        <h2 className="font-semibold mb-2">Subscriptions</h2>
        {isSignedIn ?
          (subsIsPending || subsError) ?
            <p>Loading subscriptions...</p>
            : subsData.length ? subsData.map(s => (
              <Link onClick={() => setSidebarOpen(false)} href={`/feed/${encodeURIComponent(s.url ?? '')}`} className={`${buttonVariants({ variant: "ghost" })} !justify-start gap-4 overflow-hidden`} key={s.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={faviconUrl(s.url ?? '')} alt="" className="aspect-square w-6 h-6 rounded-md" />
                <span>{s.title}</span>
              </Link>
            ))
            : <p className="text-sm p-4 text-muted">You have no subscriptions yet.</p>
          : <p className="text-sm p-4 text-muted">Sign in to access subscriptions.</p>
        }
        <div className="p-6 my-4 space-y-4 text-sm text-left bg-muted rounded-md text-muted-foreground">
          <p>Feeds are our windows on the world, so we need one that is <a href="https://github.com/jeremiev/feed" className='underline'>open source</a> and codetermined.</p>
          <p>Made by <a href="https://jeremievaney.com" className='underline'>Jérémie Vaney</a></p>
        </div>
      </div>
    </div>
  )
}