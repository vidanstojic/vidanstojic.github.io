---
title: Focus Flow
summary: An Android app that tracks screen time and enforces the limits you set — app limits, schedules, a Shorts/Reels blocker and a smart alarm.
layer: interface
stack: [Kotlin, Jetpack Compose, Room, WorkManager, UsageStatsManager, AccessibilityService, JUnit]
team: Solo
context: Personal project, preparing for Google Play
status: in-progress
repo: https://github.com/vidanstojic/Screen-Manager
featured: true
order: 1
---

Focus Flow reads Android's usage events, rebuilds them into app sessions and enforces the rules the user sets: daily limits per app, schedules, session limits, a blocker for short-video feeds and a morning alarm that keeps distracting apps locked until the user is up.

## How it is built

- **One source of truth for usage.** A single sync job turns raw `UsageStatsManager` events into sessions, splits them by hour and stores hourly rollups in Room. Every screen and the enforcement service read from those tables; nothing else writes usage.
- **One source of truth for blocking.** `RulesEngine` is a plain Kotlin class with no Android dependencies. The rules the user edits in the UI are exactly the rules the foreground service evaluates.
- **Logic separated from the platform.** Session reconstruction, hourly splitting, the rules and interval mode live in pure Kotlin domain packages, tested with JUnit without an emulator. Android classes are thin adapters around them.
- **Blocking.** A foreground service evaluates the rules and shows a full-screen overlay when a limit is hit. An `AccessibilityService` detects Shorts and Reels feeds.
- **Time is hard.** Day boundaries, rolling 7-day windows and daylight-saving transitions each have explicit handling and tests.

## Things I fixed along the way

- ANR errors caused by an accessibility service traversing the whole view hierarchy recursively on the main thread.
- Slow cold starts caused by blocking (`runBlocking`, `Thread.sleep`) initialization in the `Application` class.
- Corrupted statistics for past days, traced to day-boundary and rolling-week calculations.
