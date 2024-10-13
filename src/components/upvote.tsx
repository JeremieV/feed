import { upvote } from "@/app/server/upvote";

export default function Upvote({ upvoted, count }: { upvoted: boolean, count: number }) {
  return (
    <button
      title="+1"
      className={`${upvoted ? 'text-primary' : 'text-muted-foreground'} hover:text-primary z-30`}
      onClick={() => upvote()
      }>
      {count} upvotes
    </button >
  )
}