// export async function fetchMetadata(url: string) {
//   try {
//     const response = await fetch(url);
//     const html = await response.text();
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(html, 'text/html');
//     // Fetch title
//     const title = doc.querySelector('meta[property="og:title"]')?.content || doc.querySelector('title')?.textContent;
//     // Fetch image
//     const image = doc.querySelector('meta[property="og:image"]')?.content;
//     // Fetch favicon
//     const favicon = doc.querySelector('link[rel="icon"]')?.href || doc.querySelector('link[rel="shortcut icon"]')?.href;

//     console.log('Metadata:', { title, image, favicon });
//     return { title, image, favicon };
//   } catch (error) {
//     console.error('Error fetching metadata:', error);
//     return null;
//   }
// }

import { load } from 'cheerio';

export interface Metadata {
  title?: string;
  description?: string;
  thumbnail?: string;
}

export async function fetchMetadata(url: string) {
  try {
    // Fetch the HTML content from the URL
    const response = await fetch(url, { next: { revalidate: 86400 } });

    // Ensure the request was successful (status code 200)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Get the HTML content as text
    const html = await response.text();


    // Load the HTML using Cheerio for parsing
    const $ = load(html);

    // Extract metadata
    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
    const thumbnail = $('meta[property="og:image"]').attr('content');

    return {
      title: title,
      description: description,
      thumbnail: thumbnail,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: '',
      description: undefined,
      thumbnail: undefined,
    };;
  }
}
