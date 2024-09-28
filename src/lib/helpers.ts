export function displayUrl(url: string): string {
  return new URL(url).host.replace(/^www\./, '').replace(/.com$/, '')
}