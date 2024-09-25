# Progressive feed

A simple hacker news clone except it gets progressively more complicated.

Can be found here: https://progressive-feed.vercel.app

I captured the first few iterations as just to show my process ^[And to kind of motivate me to have no "zero days"]. It's not worth much in the end because there were many more very slow or broken along the way than I expected:
- https://progressive-feed-1.vercel.app very first draft, titles and links
- https://progressive-feed-2.vercel.app added an alternative grid view
- https://progressive-feed-3.vercel.app added the option to choose the feed (hacker news / dev.to / RSS feed (draft))
- https://progressive-feed-4.vercel.app fixed RSS fetching (using RSS2JSON free tier, limited to 10.000 requests/day) and enabled users to read any RSS feed they like. Stories sorted by date published, which has its drawbacks.
- https://progressive-feed-5.vercel.app this is going to be the last iteration that I deploy to a separate URL. It's mostly a UI update
  - UI changes
    - made a toggle to change favicon
    - display choices are encoded as url parameters so they persist when reloading
    - [x] grid view:
      - [x] in the absence of a metadata cover image, I display a generated thumnail
        - [x] a background gradient, and a noise filter to give them texture, and the title in large, white font on top.
        - [x] color pairs (and gradient direction) are randomly generated
        - [x] thumbnail text is trimmed 
      - [x] added favicon
      - [x] added author next to domain if there is one
      - [x] can now hover on link title and image to get full title and description respectively
    - [x] list view:
      - [x] added domain name
      - [x] added favicon
- [ ] https://progressive-feed-6.vercel.app change the way to control the feeds by making the badges topic-based (curated by the community) rather than single RSS feeds.

## Roadmap 

- [ ] add a way to go to either the url target, or the channel's page
  - [ ] add "topics" which are curated collections of feeds 
  - [ ] choose what the starting page should display, if indeed it should display anything
- [ ] add a sidebar
- [ ] performance work (thumbnail images, display skeleton while loading)
  - [ ] fix the tailwind css pattern which is over optimistic
- [ ] branding
  - [ ] name
  - [ ] logo / favicon
  - [ ] url
  - [ ] metadata also
