import { atomWithStorage } from 'jotai/utils'

export const viewAtom = atomWithStorage<'list' | 'grid'>('view', 'list')

export const subscriptionsAtom = atomWithStorage<{ name: string, url: string }[]>('subscriptions', [
  { name: "BBC", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "NPR", url: "https://www.npr.org/rss/rss.php" },
  { name: "Pew Research", url: "https://www.pewresearch.org/feed/" },
  { name: "Al Jazeera", url: "http://www.aljazeera.com/xml/rss/all.xml" },
])

