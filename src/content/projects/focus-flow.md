---
title: Focus Flow
summary: An Android app that tracks screen time and enforces the limits you set — app limits, schedules, a Shorts/Reels blocker and a smart alarm.
layer: mobile
stack: [Kotlin, Jetpack Compose, Room, WorkManager, UsageStatsManager, AccessibilityService, JUnit]
team: Solo
context: Personal project, preparing for Google Play
status: preparing-release
repo: https://github.com/vidanstojic/Screen-Manager
icon: ../../assets/projects/focus-flow-icon.png
gallery:
  - src: ../../assets/projects/focus-flow-home.png
    alt: Home screen with two sections, Screen Manager and Smart Alarms
    caption: "Home: screen time and alarms in one app."
  - src: ../../assets/projects/focus-flow-overview.png
    alt: Screen Manager overview with screen time today, an hourly chart, the most used apps and active protections
    caption: "Overview: today's screen time by hour and the most used apps."
  - src: ../../assets/projects/focus-flow-stats.png
    alt: Screen time statistics with day, week and month tabs, an hourly bar chart and a list of apps
    caption: "Statistics by day, week and month. Tap a bar to see that hour."
  - src: ../../assets/projects/focus-flow-limits.png
    alt: Limits screen with daily limits, session limits and schedules such as night focus and work hours
    caption: "Daily limits, session limits and schedules."
  - src: ../../assets/projects/focus-flow-shorts.png
    alt: Shorts and Reels daily budget, morning lock after waking up and an emergency pause for all limits
    caption: "Shorts and Reels blocker, morning lock and emergency pause."
  - src: ../../assets/projects/focus-flow-alarm.png
    alt: New alarm screen with tone, volume, a gradually louder start, vibration and snooze settings
    caption: "Smart alarm that starts quietly and gets louder."
  - src: ../../assets/projects/focus-flow-mission.png
    alt: Alarm settings with a wake-up mission (math, typing or steps), wake-up detox and a check that you are really up
    caption: "Wake-up missions, app blocking after waking and an \"are you up\" check."
  - src: ../../assets/projects/focus-flow-dataflow.svg
    alt: Data flow from Android usage events through session reconstruction and hourly rollups to the rules engine and the block screen
    caption: From raw Android events to a blocking decision. Orange parts are plain Kotlin, tested without an emulator.
featured: true
order: 1
---

## Problem and goal

Focus Flow goes beyond reporting screen time. It reads the system's usage events, rebuilds them into app sessions and enforces the rules the user sets: daily limits per app, schedules, session limits, a blocker for short-video feeds and a morning alarm that keeps distracting apps locked until the user is up.

The goal was numbers that match reality to the minute, and blocking that can't be bypassed by switching apps quickly.

## Architecture and technical decisions

- **One source of truth for usage.** A single sync job turns raw `UsageStatsManager` events into sessions, splits them by hour and stores hourly rollups in Room. Every screen and the enforcement service read from those tables; nothing else writes usage.
- **One source of truth for blocking.** `RulesEngine` is a plain Kotlin function with no Android dependencies. The rules the user edits in the UI are exactly the rules the foreground service evaluates.
- **Logic separated from the platform.** Session reconstruction, hourly splitting, the rules and interval mode live in pure Kotlin packages covered by 131 JUnit tests. Android classes are thin adapters around them.
- **Blocking.** A foreground service evaluates the rules and shows a full-screen overlay when a limit is hit. An `AccessibilityService` detects Shorts and Reels by player view IDs and their size on screen.

The full design is on the [Architecture](/projects/focus-flow/architecture/) page.

## Challenges and how they were solved

- **ANR errors.** The accessibility service traversed the whole view hierarchy recursively on the main thread. Scanning moved to a serial background dispatcher, is skipped when no rule needs it, and is throttled to once per 750 ms.
- **Wrong numbers for past days.** Sessions that crossed a sync boundary lost their start, and a whole session was counted in the hour it began. A safe sync cursor and a DST-aware hourly splitter fixed both.
- **The whole of YouTube counted as Shorts.** Detection matched the text "Shorts" in the bottom navigation tab. It now matches the player's view IDs and requires the player to cover at least 60% of the screen.

Every fix is listed in the [Changelog](/projects/focus-flow/changelog/).

## Privacy

Everything stays on the device: no account, no analytics, no ads and no internet permission. Details are in the [Privacy policy](/projects/focus-flow/privacy/).
