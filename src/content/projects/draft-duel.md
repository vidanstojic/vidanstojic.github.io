---
title: Draft Duel
summary: A three-minute 1v1 mobile game where two players with the same budget bid on athletes to build the stronger starting five.
layer: services
stack: [Kotlin Multiplatform, Compose Multiplatform, Ktor, WebSocket, PostgreSQL]
team: Solo
context: Personal project, in design
status: in-progress
featured: true
order: 5
---

Two players share a pool of ten athlete cards and a budget of 20 points each. Cards come up one at a time and the players take turns raising or passing; whoever ends with the higher combined rating wins. Matches are played against a friend through a link, or offline against a bot.

## Design decisions

- **One rules module, three consumers.** The game rules live in a pure Kotlin `commonMain` module with no I/O and a seeded shuffle. The Android client, the server and a bot-versus-bot simulator all run the same code.
- **Authoritative server.** Online matches run on a Ktor WebSocket server. Clients send only intents (raise, pass, assign); the server validates turn, round and budget, and answers duplicate or late messages with `STALE` without changing state.
- **Explicit state machine.** A match moves through drawing, bidding, choosing, awarded, scoring and finished, with pause and abandon for dropped connections.
- **Only the order is secret.** Ratings and bids are public by design. The server shuffles the pool and never sends upcoming cards to the client.
- **Balance by simulation.** 10,000 bot-versus-bot matches check that the first opener wins 45–55% of the time and that the budget is sized right; property-based tests check invariants such as "a budget never goes negative".

The specification and UI design are done; implementation is next.
