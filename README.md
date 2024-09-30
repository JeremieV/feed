# Progressive feed

I decided to build an app in public. So I picked the following theme:

> A simple hacker news clone except it gets progressively more complicated.

I captured the first few iterations as just to show my process ^[And to kind of motivate me to have no "zero days"]. It's not worth much in the end because there were many more very slow or broken along the way than I expected:

I wanted myself and other people to be able to see the progress at each iteration to get a sense of how I work. I published different branches that each correspond to successive iterations.

I would love to have some users and to turn this into a more full-featured app if possible.

Here are the URLs to the first few iterations:

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
- https://progressive-feed-6.vercel.app 
  - added vercel analytics 
  - feeds are now encoded in the url
  - starting page displays nothing at the start
  - change default to grid view
  - greatly improved performance due to caching 
  - moved to server components, but reverted
  - improved the control bar and added "topics" functionality
  - fixed the "add" button in the rss feed url input
  - improved the feed "control bar" at the top
  - automatically get the RSS feed from a reddit, youtube, medium, or substack url.
  - added some "topics" that allow you to load a combination of pre-curated feeds in one click
  - improved loading skeleton
  - made the badges keyboard-friendly
  - changed the date format to a "x hours ago" format
- https://progressive-feed-7.vercel.app 
  - scroll to top when going to next or previous page
  - 

## Roadmap 

- put some better feeds and "topics" than the AI generated ones
- add buttons to add topics at the center of the page when feed is empty
<!--  -->
- get the first 3 users
  - announce project somewhere
  - put some interested people in a group (discord?)
<!--  -->
- branding
  - name
  - logo / favicon
  - url
  - metadata also
<!--  -->
- add feed/channel pages, where you can see desc, img, icon, and other feeds from url
- perform all the metadata requests together in async?
- display skeleton while loading
- create an rss feed from the feeds selection (meta!)
- recommend community curated feeds?
- fix the tailwind css pattern which is over optimistic
- choose a license (I am thinking about https://choosealicense.com/licenses/unlicense/)
<!--  -->
- more official launch
<!--  -->
- need an api that will do: 
  - search for a feed
  - fetch and cache feed names
  - fetch and cache url metadata
  - and ultimately customer accounts to save subscriptions, and share lists of feeds (and comments?)

