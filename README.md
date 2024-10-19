# OpenFeed

The open source link aggregator.

If people like this, it might very well become a more fully-featured app and long term community project. Support the project by starring it on GitHub and sharing it.

## Roadmap 

- review the youtube etc compatibility (and activitypub)
- recommendation algo (eg 50% most upvoted, 30% following, 20% random (to start))
- paginate API endpoint for feed items
- add the created_at and updated_at for all database tables
- curate "topics" better than the AI generated ones
- import/export OPML
<!--  -->
- get the first 3 users
  - announce project somewhere
  - put some interested people in a group (discord?)
<!--  -->
- branding
  - logo / favicon
  - metadata
<!--  -->
- display skeleton while loading instead of loading indicator (grid & list view)
- let users create combined feeds
- fix the tailwind css pattern which is over optimistic
- choose a license (I am thinking about https://choosealicense.com/licenses/unlicense/)
<!--  -->
- more official launch

## Changelog (most recent first)

- 2024-10-13 feat: added tweet previews
- 2024-10-12 feat: added feed search functionality
- 2024-10-12 fix: topics only show on landing page
- 2024-10-11 fix: sidebar now grows to screen height on mobile
- 2024-10-11 feat: added database, endpoints to manage and update feeds
- 2024-10-08 fix: reset page number to 1 when changing feeds
- 2024-10-08 feat: added subscribe button
- 2024-10-08 feat: added feed pages, where you can see description, icon, items from url

## Changelog (old)

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