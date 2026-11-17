---
title: Draft Duel
summary: "A quick 1v1 card auction for Android. Two players with 20 points each bid on ten cards, and the stronger team wins. Four themes: football, basketball, movies and food."
layer: mobile
stack: [Kotlin Multiplatform, Compose Multiplatform, Coroutines, kotlinx.serialization, Python]
team: Solo
context: Personal project, in closed testing on Google Play
status: preparing-release
repo: https://github.com/vidanstojic/Draft-Duel
icon: ../../assets/projects/draft-duel-icon.png
gallery:
  - src: ../../assets/projects/draft-duel-home.png
    alt: Home screen with a green card table and four modes - find opponent, play vs bot, same device and play a friend
    caption: Home screen. Every mode is a quick 1v1 duel.
  - src: ../../assets/projects/draft-duel-themes.png
    alt: New match screen with theme tiles for movies and food, rule presets and a card pool by league
    caption: Four themes, each with its own table surface and card pack.
  - src: ../../assets/projects/draft-duel-rules.png
    alt: Custom rules with points per player, cards per match, equal split, hand-over cost and turn time
    caption: Custom rules. Bots are tuned for the Default and Classic presets.
  - src: ../../assets/projects/draft-duel-leagues.png
    alt: Card pool chosen by category, with England, France, Germany, Italy and Spain at 30 cards each
    caption: Football cards come from five leagues, 30 players each.
  - src: ../../assets/projects/draft-duel-states.svg
    alt: Match engine states - draw card, bidding, choosing, awarded, discarded and finished
    caption: The match engine, one card at a time. Every arrow is a pure state transition.
featured: true
order: 5
---

## Problem and goal

Two players share ten cards and 20 points each. Cards come up one at a time: the opener bids, the rival raises or passes, and whoever takes the card pays their bid. Ratings stay hidden until you own a card, so you bid on what you know about the player, the film or the dish. A match takes three to five minutes, against one of six bots or with a friend on the same phone.

## Architecture and technical decisions

- **One codebase for Android and iOS.** Kotlin Multiplatform with Compose Multiplatform; every screen lives in shared code. Audio, haptics and storage sit behind `expect`/`actual` platform services.
- **Rules as a pure reducer.** `MatchEngine.reduce(state, action)` returns the next state with no I/O and no clock. The UI, the bots and the tests all call the same function; a separate driver owns the turn timer and pauses.
- **Six bots with personalities.** Each one values a card from the pack's statistics and its budget per empty slot. The strongest looks ahead with the expected best *k* of the remaining *n* cards (order statistics), cached per pack and rule set and computed off the UI thread.
- **Card packs as data.** Python scripts build JSON packs from rating tables: 150 footballers from five leagues, 250 basketball players from the NBA and EuroLeague, 150 films and 20 dishes. A validator checks every pack.
- **A score that looks like the sport.** The rating total decides the winner; `ScoreProjection` turns the gap per card into a football or basketball result, seeded so the same match always gives the same score.

The full design is on the [Architecture](/projects/draft-duel/architecture/) page, and the bots have a [page of their own](/projects/draft-duel/bots/).

## Challenges and how they were solved

- **Stars were worth too little.** With unlimited cards, cheap cards beat stars. The default rules give each player exactly five slots, so every card bought takes the place of a better one. A paid hand-over (1, then 2, then 3 points) lets the opener avoid a card they don't want.
- **Balance.** 1,000 bot-versus-bot matches per pair set each bot's difficulty and check that the first opener wins about 48% of matches.
- **Cards repeating between matches.** A shuffle bag per theme, saved across restarts, brings a card back only after the rest of the pack has been played.
- **Food doesn't fit ratings.** Recipe mode scores ingredients instead: the right ones add up to 100 and wrong ones subtract points. The opener may skip a card, otherwise every wrong ingredient would land on them.

Every change since the first build is in the [Changelog](/projects/draft-duel/changelog/).

## What's next

Online matches against real players need a server. Today the online modes pair you with a bot, so the rest of the app can be tested first.

## Privacy

The app has no account, no analytics, no ads and no internet permission. Settings and the list of cards already played stay on the phone. Details are in the [Privacy policy](/projects/draft-duel/privacy/).
