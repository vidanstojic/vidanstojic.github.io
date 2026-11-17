---
title: Draft Duel
summary: A three-minute 1v1 mobile game where two players with the same budget bid on athletes to build the stronger starting five.
layer: mobile
stack: [Kotlin Multiplatform, Compose Multiplatform, Ktor, WebSocket, PostgreSQL]
team: Solo
context: Personal project, in design
status: in-progress
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
    alt: Match state machine with states waiting, drawing, bidding, choosing, awarded, scoring, finished, paused and abandoned
    caption: The match state machine from the specification.
featured: true
order: 5
---

## Problem and goal

Two players share a pool of ten athlete cards and a budget of 20 points each. Cards come up one at a time and the players take turns raising or passing; whoever ends with the higher combined rating wins. A match should take three to five minutes, against a friend through a link or offline against a bot.

## Architecture and technical decisions

- **One rules module, three consumers.** The game rules live in a pure Kotlin `commonMain` module with no I/O and a seeded shuffle. The Android client, the server and a bot-versus-bot simulator all run the same code.
- **Authoritative server.** Online matches run on a Ktor WebSocket server. Clients send only intents (raise, pass, assign); the server validates turn, round and budget.
- **Explicit state machine.** A match moves through drawing, bidding, choosing, awarded, scoring and finished, with pause and abandon for dropped connections.
- **Only the order is secret.** Ratings and bids are public by design. The server shuffles the pool and never sends upcoming cards to the client.

## Challenges and how they were solved

- **Duplicate and late messages.** Every action carries a round id and turn number; anything that isn't for the current turn gets `STALE` and changes nothing.
- **Fair balance.** 10,000 bot-versus-bot matches will check that the first opener wins 45–55% of the time and that the budget is sized right. Property-based tests check invariants such as "a budget never goes negative".
- **Edge cases in the rules.** A player with no budget left, or one with a full team, follows explicit rules written as a table of examples that become unit tests.

The specification and UI design are done; implementation is next.

## Privacy

The app has no account, no analytics, no ads and no internet permission. Settings and the list of cards already played stay on the phone. Details are in the [Privacy policy](/privacy/draft-duel/).
