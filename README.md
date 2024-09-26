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
      - [x] added author next to domain if there is one (reverted)
      - [x] can now hover on link title and image to get full title and description respectively
    - [x] list view:
      - [x] added domain name
      - [x] added favicon

## Roadmap 

- [ ] encode the feeds in the url
- [ ] transform the Badges into Buttons and use the feed titles rather than the feed urls
- [ ] starting page should display nothing at the start
- [ ] display url/author chain like this: `feed -> target url -> article author` (if `author` and `feed != target`)
- [ ] fix the tailwind css pattern which is over optimistic
<!--  -->
- [ ] get the first 3 users
  - [ ] announce project somewhere
  - [ ] put some interested people in a group (discord?)
<!--  -->
- [ ] branding
  - [ ] name
  - [ ] logo / favicon
  - [ ] url
  - [ ] metadata also
<!--  -->
- [ ] add feed/channel pages, where you can see desc, img, icon, and other feeds from url
- [ ] perform all the metadata requests together in async?
- [ ] display skeleton while loading
- [ ] create an rss feed from the feeds selection (meta!)
- [ ] recommend community curated feeds?
<!--  -->
- [ ] more official launch
<!--  -->
- [ ] need an api that will do: 
  - [ ] search for a feed
  - [ ] fetch and cache feed names
  - [ ] fetch and cache url metadata
  - [ ] and ultimately customer accounts to save subscriptions