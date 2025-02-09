# OpenFeed

The open source link aggregator.

This used to be a side project of mine, now unmaintained.

## Roadmap 

BUG FIXES:
- fix feed items duplication

- transfer db to neon
- redo the search bar
- review the youtube etc compatibility (and activitypub)
- implement upvotes (add an upvote_count to links), user profiles (name image description), and history
- implement a most upvoted (all time) and "hot" category <- upvotes divided by a power of the age of the link (can have different freshness parameters)
<!--  -->
<!-- - announce project somewhere
- put some interested people in a group (discord/slack) -->
<!--  -->
<!-- - branding
  - logo / favicon
  - metadata -->
<!--  -->
- import/export OPML
- limit the time window of the random stories
- curate "topics" better than the AI generated ones
- display skeleton while loading instead of loading indicator (grid & list view)
- let users create combined feeds
- fix the tailwind css pattern which is over optimistic
<!-- - choose a license (I am thinking about https://choosealicense.com/licenses/unlicense/) -->
<!--  -->
<!-- - launch -->

## Changelog (most recent first)

- 2024-12-09 feat: invalidate subscriptions after mutation (new subscription)
- 2024-10-19 feat: paginated feed items
- 2024-10-19 feat: many UI changes and prototyped certain features
- 2024-10-13 feat: added tweet previews
- add the created_at and updated_at for all database tables
- 2024-10-12 feat: added feed search functionality
- 2024-10-12 fix: topics only show on landing page
- 2024-10-11 fix: sidebar now grows to screen height on mobile
- 2024-10-11 feat: added database, endpoints to manage and update feeds
- 2024-10-08 fix: reset page number to 1 when changing feeds
- 2024-10-08 feat: added subscribe button
- 2024-10-08 feat: added feed pages, where you can see description, icon, items from url
