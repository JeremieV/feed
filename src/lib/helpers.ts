export function displayUrl(url: string): string {
  return new URL(url).host.replace(/^www\./, '').replace(/.com$/, '')
}

export function displayTimeAgo(dateStr: string): string {
  const inputDate = new Date(dateStr);
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