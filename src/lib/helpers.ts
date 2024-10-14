import { youtubeToRSS } from "./fetchRSS";

export function displayUrl(url: string): string {
  return new URL(url).host.replace(/^www\./, '') // .replace(/.com$/, '')
}

export function faviconUrl(url: string): string {
  try {
    return `https://icons.duckduckgo.com/ip3/${encodeURIComponent(new URL(url).hostname)}.ico`;
  } catch {
    return "https://icons.duckduckgo.com/ip3/"
  }
}

export function displayTimeAgo(date: string | Date): string {
  const inputDate = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return "just now";
}

export function redditToRSS(redditUrl: string): string | null {
  const subredditRegex = /reddit\.com\/r\/([a-zA-Z0-9_]+)/;
  const userRegex = /reddit\.com\/user\/([a-zA-Z0-9_]+)/;

  // Check for a subreddit URL
  let match = redditUrl.match(subredditRegex);
  if (match) {
    return `https://www.reddit.com/r/${match[1]}/.rss`;
  }

  // Check for a user URL
  match = redditUrl.match(userRegex);
  if (match) {
    return `https://www.reddit.com/user/${match[1]}/.rss`;
  }

  // If no known format matches
  return null;
}

export function substackToRSS(substackUrl: string): string | null {
  const substackRegex = /https?:\/\/([a-zA-Z0-9_-]+)\.substack\.com/;

  // Check if the URL matches a valid Substack URL
  const match = substackUrl.match(substackRegex);
  if (match) {
    const publicationName = match[1];
    return `https://${publicationName}.substack.com/feed`;
  }

  // If no valid Substack URL is found
  return null;
}

function mediumToRSS(mediumUrl: string): string | null {
  const userRegex = /medium\.com\/@([a-zA-Z0-9_-]+)/;
  const publicationRegex = /medium\.com\/([a-zA-Z0-9_-]+)(\/|$)/;

  // Check if it's a user/author URL
  let match = mediumUrl.match(userRegex);
  if (match) {
    return `https://medium.com/feed/@${match[1]}`;
  }

  // Check if it's a publication URL
  match = mediumUrl.match(publicationRegex);
  if (match) {
    return `https://medium.com/feed/${match[1]}`;
  }

  // If no valid Medium URL is found
  return null;
}


export async function urlToRSS(url: string): Promise<string> {
  return (await youtubeToRSS(url)) || redditToRSS(url) || substackToRSS(url) || mediumToRSS(url) || url;
}