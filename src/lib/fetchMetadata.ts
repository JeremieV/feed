'use server'

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

import axios from 'axios';
import { load } from 'cheerio';

export async function fetchMetadata(url: string) {
  try {
    // Fetch the HTML content from the URL
    const { data: html } = await axios.get(url);

    // Load the HTML using Cheerio for parsing
    const $ = load(html);

    // Extract metadata
    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    const image = $('meta[property="og:image"]').attr('content');
    const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');

    // Send metadata as response
    // res.status(200).json({
    //   title: title || 'No title found',
    //   image: image || 'No image found',
    //   favicon: favicon || 'No favicon found',
    // });
    console.log('Metadata:', { title, image, favicon });
    return {
      title: title,
      image: image,
      favicon: favicon,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
    // res.status(500).json({ error: 'Failed to fetch metadata' });
  }
}
