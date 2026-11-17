---
title: App architecture
tab: Architecture
summary: How one Kotlin codebase runs the match on Android and iOS, why the rules are a pure function, and how card packs are built.
order: 1
---

## Three rules the design follows

- **One codebase, thin platforms.** Every screen and every rule lives in `commonMain`. Android and iOS only provide audio, haptics, storage and sharing, through `expect`/`actual` platform services.
- **Rules without side effects.** `MatchEngine` takes a state and an action and returns the next state. It has no clock, no randomness of its own and no I/O, so the UI, the bots and the tests all drive the same function.
- **Time lives outside the rules.** The turn clock, pauses and bot thinking time belong to `MatchDriver`, which turns time into actions such as `Timeout`. The engine never waits for anything.

## Layers and packages

| Package | Role | Platform code? |
| --- | --- | --- |
| `domain/match/` | `MatchEngine`, `MatchState`, `MatchRules`, `ScoreProjection` | No |
| `domain/bot/` | Personalities, rating perception, valuation, lookahead | No |
| `domain/model/` | Themes, cards, packs, match pools, `ShuffleBag` | No |
| `data/pack/` | Loads the bundled JSON packs | No |
| `data/prefs/` | Remembers played cards across restarts | No |
| `feedback/` | Music, sound effects and vibration behind three settings | No |
| `platform/` | Key-value store, audio, haptics, share sheet | `expect`/`actual` |
| `ui/` | Compose screens, `MatchDriver`, themed table surfaces | No |
| `androidMain/`, `iosMain/` | Entry points and platform implementations | Yes |

## One card, step by step

1. **Draw.** The engine looks at both players. If both have points, the opener for this card must bid. If one is at 0, the other chooses who takes the card for free. If a player's slots are full, the card goes to the other one.
2. **Bid.** Players raise by 1, 2 or 5 points or pass. A bid higher than the rival's whole budget wins the card at once. When the clock runs out, the engine raises by 1 if it can; otherwise the rival's last bid takes the card.
3. **Hand over.** Before the first bid, the opener may pay 1, then 2, then 3 points over the match to make the rival open the card instead.
4. **Award.** The winner pays their bid and takes the card. In food, the opener may skip a card, and then nobody gets it.
5. **Advance.** The next card is drawn, or the match ends after the last one.

The diagram on the [Overview](/projects/draft-duel/) page shows these states and transitions.

## The match driver

`MatchDriver` runs one match on a coroutine. It counts down the 10-second turn, asks the bot for a move after a short human-like pause and reports events (your turn, raise, pass, card won, last seconds) to the feedback layer. It keeps a set of pause reasons, such as the pause menu or handing the phone to the other player, and pauses by itself when the app goes to the background. While the match is paused, the clock and the bot wait.

## Card packs

Packs are JSON files bundled with the app and built by Python scripts, so ratings are data, not code.

| Theme | Cards | Source of ratings |
| --- | --- | --- |
| Football | 150, 30 from each of five leagues | A rating database, 3 stars, 9 strong and 18 solid players per league |
| Basketball | 250, NBA and EuroLeague | Hand-assigned from the 2025/26 season, each league on its own scale |
| Movies | 150, six genres | Hand-assigned |
| Food | 20 dishes | Ingredients that add up to 100, plus wrong ones with negative points |

A validator checks every pack: rating ranges, categories, and recipes that sum to exactly 100.

## The final score

The rating total always decides the winner. `ScoreProjection` only translates it into a result that reads like the sport. The margin comes from the rating gap per card, so it does not depend on how many cards were played: in football under 3 points per card is a one-goal win and 15 or more is five goals. The score is seeded from the cards and prices, so the same match always shows the same result.

## Tests

71 unit tests run on the shared code: the engine against the rules table, five-slot and custom rules, recipe mode, every bot personality, bot-versus-bot simulations, the score projection, the shuffle bag, pack parsing, sound and vibration feedback, and the order of driver events.

## Privacy

Everything runs on the phone. The app has no internet permission and no analytics. See the [Privacy policy](/projects/draft-duel/privacy/).
