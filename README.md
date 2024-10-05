# OpenFeed

The open source link aggregator.

If people like this, it might very well become a more fully-featured app and long term community project. Support the project by starring it on GitHub and sharing it.

## Roadmap 

- when changing feeds reset page number to 1, & improve page navigation
- put some better feeds and "topics" than the AI generated ones
<!--  -->
- get the first 3 users
  - announce project somewhere
  - put some interested people in a group (discord?)
<!--  -->
- branding
  - logo / favicon
  - metadata
<!--  -->
- add buttons to add topics at the center of the page when feed is empty
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

## Changelog

The first few iterations have their own URLs because I thought it would be interesting to see how my open-ended project evolved. (I started with the following theme: "A simple hacker news clone except it gets progressively more complicated.")

- https://progressive-feed-1.vercel.app very first draft, titles and links
- https://progressive-feed-2.vercel.app added an alternative grid view
- https://progressive-feed-3.vercel.app added the option to choose the feed (hacker news / dev.to / RSS feed (draft))
- https://progressive-feed-4.vercel.app fixed RSS fetching (using RSS2JSON free tier, limited to 10.000 requests/day) and enabled users to read any RSS feed they like. Stories sorted by date published, which has its drawbacks.
- https://progressive-feed-5.vercel.app this is going to be the last iteration that I deploy to a separate URL. It's mostly a UI update
  - made a toggle to change favicon
  - display choices are encoded as url parameters so they persist when reloading
  - grid view:
    - in the absence of a metadata cover image, I display a generated thumnail
    - a background gradient, and a noise filter to give them texture, and the title in large, white font on top.
    - color pairs (and gradient direction) are randomly generated
    - thumbnail text is trimmed 
    - added favicon
    - added author next to domain if there is one (reverted)
    - can now hover on link title and image to get full title and description respectively
  - list view:
    - added domain name
    - added favicon
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
  - renamed to OpenFeed
  - changed meta & readme

More recent changes:

- 