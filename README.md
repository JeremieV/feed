# OpenFeed

The open source link aggregator.

This is my side project at the moment.

## Roadmap 

- invalidate subscriptions after mutation (new subscription)
- review the youtube etc compatibility (and activitypub)
- redo the search bar
- implement upvotes, user profiles (name image description), and history
- recommendation algo (eg 50% most upvoted, 30% following, 20% random (to start))
- import/export OPML
<!--  -->
- announce project somewhere
- put some interested people in a group (discord/slack)
<!--  -->
- branding
  - logo / favicon
  - metadata
<!--  -->
- curate "topics" better than the AI generated ones
- display skeleton while loading instead of loading indicator (grid & list view)
- let users create combined feeds
- fix the tailwind css pattern which is over optimistic
- choose a license (I am thinking about https://choosealicense.com/licenses/unlicense/)
<!--  -->
- launch

## Changelog (most recent first)

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
