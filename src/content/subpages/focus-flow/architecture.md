---
title: System architecture
tab: Architecture
summary: How usage data flows from Android events to the charts and the block screen, and why the core logic has no Android dependencies.
order: 1
---

## Three rules the design follows

- **One writer for usage.** Only the sync job writes usage data. The UI, the enforcement service and the background worker only read it.
- **One place that decides to block.** `RulesEngine` is a plain Kotlin function. All inputs, including the current time and time zone, are passed in, so every scenario is tested without a device.
- **Logic separate from Android.** Session reconstruction, hourly splitting, the rules and interval mode live in `domain/usage` and `domain/rules`, which could move to their own Gradle module unchanged.

## Layers and packages

| Package | Role | Android? |
| --- | --- | --- |
| `model/` | User rules: app limits, schedules, session limits, Shorts config, wake-up, alarms | No |
| `domain/usage/` | `SessionReconstructor`, `ForegroundResolver`, `UsageSplitter` | No |
| `domain/rules/` | `RulesEngine`, `ScheduleWindows`, `SessionLimitTracker` | No |
| `data/local/` | Room entities, DAOs, database | Yes |
| `data/usage/` | `UsageEventSource`, the adapter over `UsageStatsManager` | Yes |
| `service/` | `FocusMonitorService`, `ShortsAccessibilityService`, overlay | Yes |
| `worker/` | `UsageAggregationWorker`: periodic sync and retention | Yes |
| `ui/` | Compose UI, navigation and one folder per screen | Yes |

## From events to sessions

`UsageEventSource` reads `UsageStatsManager.queryEvents` and maps system events to four kinds: resumed, paused, screen off and shutdown. Launchers, the system UI and the app itself are excluded, as Digital Wellbeing does.

`SessionReconstructor` then builds sessions with a "one app in the foreground" model:

- A resumed app closes whichever app was open and opens itself.
- A paused event closes an app only if it is the one currently open, because on Samsung the new app often resumes before the old one pauses.
- Screen off and shutdown close everything.
- If the same app returns within 5 s, it is the same session (moving between screens of one app). Sessions shorter than 1 s are dropped.

The result includes a `safeCursor`: the point the next sync may start reading from without losing the start of a session that is still open.

## The sync

The sync runs every 60 s while the screen is on, when the app comes to the foreground, and every 6 hours from WorkManager as a fallback. A global mutex makes sure only one runs at a time.

1. Without the usage-access permission it stops immediately and leaves the cursor alone.
2. It reads events from the cursor, or a full 10-day backfill when the stored history is incomplete.
3. Raw sessions are upserted by `(package, start)`, so an open session is extended rather than duplicated.
4. Sessions from the cursor's day onward are cut into hours by `UsageSplitter` and the hourly table is rebuilt in one transaction.
5. The cursor moves only if at least one event was read.

## Deciding to block

`RulesEngine.evaluate` collects every rule that applies right now (schedule, daily group limit, session cooldown, Shorts penalty, morning lockout) and returns the one that blocks the longest, so the user sees the real time until unlock. An active emergency pause overrides everything.

## Tests

131 JUnit tests cover the pure Kotlin core, including the real Samsung event order, hour splitting across the DST change on 25 October, rule priority and interval mode, and a check that every database version has a migration.

## Privacy

All of this runs on the device. The app has no internet permission, so usage data never leaves the phone. See the [Privacy policy](/projects/focus-flow/privacy/).
