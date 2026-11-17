---
title: Six bots, six styles
tab: Bots
summary: How the bots guess hidden ratings, decide what a card is worth and plan the rest of the match, and how they were balanced.
order: 2
---

## Bidding on a guess

Ratings are hidden while players bid, so a fair bot cannot see them either. Every bot bids on its own guess: the true rating shifted by its biases and blurred by a few points. Sunday Sam's guess can be off by 9 points and he overrates forwards; Scout Nina is off by at most 2.

## What a card is worth

A bot's fair price for a card is its budget divided by its empty slots, scaled by how good the card looks next to the rest of the pack. The base of that scale is the pack's lower quartile, so an average card is worth something, but not much. Each personality then adds its own style: how big its raises are, whether it snipes at the last moment, when it pays to hand a card over.

Scout Nina goes further. She plans the rest of the match with a lookahead model: the expected total of the best *k* of the *n* cards still to come (order statistics), including the rule that whoever chooses while the rival is at 0 takes the best of what is left. The model is cached per pack and rule set, and the first move is computed off the UI thread.

## The roster

| Bot | Style | Difficulty | Wins, football | Wins, movies | Hand-overs per match |
| --- | --- | --- | --- | --- | --- |
| Scout Nina | Knows ratings almost exactly and plans ahead | Hard | 74% | 71% | 1.8 |
| Galáctico Gio | All in on stars, lowballs everyone else | Medium | 65% | 61% | 1.6 |
| Bargain Bea | Never overpays, waits for steals | Medium | 56% | 57% | 1.4 |
| Steady Stefan | The original formula from the specification | Medium | 42% | 50% | 0.8 |
| Hustler Hugo | Pushes prices just to drain your budget | Easy | 36% | 33% | 0 |
| Sunday Sam | Bids on gut feeling and loves forwards | Easy | 27% | 28% | 0 |

Win rates are averages against the other five bots, from 1,000 matches per pair under the default rules (five cards each, paid hand-over). The opener of the first card wins 48.3% of football matches and 47.9% of movie matches, so going first is not an advantage.

## Balancing

- **Scout was too good.** With exact ratings and a lookahead she won 89–96% of rating matches. She now guesses within 2 points and plays a little cautious in classic rules.
- **Food broke the formula.** Bots counted wrong ingredients as cards worth buying and underpaid for the real ones. The fair share now counts only useful cards.
- **Five slots changed the ranking.** Galáctico was the weakest bot with unlimited cards. With five slots every cheap card takes the place of a better one, so stars matter again and he moved up to second.
- **Difficulty depends on the rules.** The bot picker shows the difficulty for the chosen theme and rules, because a style that is easy in one setup can be medium in another.
