---
title: Bugs found and fixed
tab: Changelog
summary: The bugs that shaped the current design, what caused each one and how it was fixed.
order: 2
---

## Engine refactor

| Problem | Cause | Fix |
| --- | --- | --- |
| Blocking never worked | The monitoring service was never started | Started from the main activity and on boot |
| A blocked app was usable after 15 s | Foreground app was "last resumed in 15 s" | Incremental `ForegroundResolver` |
| Usage counted twice | Service and sync both wrote sessions | The sync is the only writer |
| Past days were wrong | Sessions at a sync boundary lost their start | `safeCursor` |
| Wrong hours and days around DST | Whole session counted in its start hour | `UsageSplitter` with real calendar days |
| All of YouTube counted as Shorts | Matched the "Shorts" text in the nav tab | `ShortsDetector` by view ID and size |
| ANRs and battery drain | View tree scanned on the main thread | Serial background dispatcher, throttling |
| Emergency pause expired at midnight | Compared "HH:mm" labels | Stored as an absolute timestamp |
| Overlay crashed | WindowManager called from a background thread | Moved to the main thread |
| Usage showed 0 everywhere | Sync without permission got an empty result and moved the cursor | Permission check; cursor moves only with events |
| Previous days were empty | Self-healing for an empty table never ran | Explicit 10-day backfill with a version number |

## Stabilization (October 2026)

| Problem | Fix |
| --- | --- |
| After blocking Reels, Shorts still worked | One shared state and budget for all short-video apps |
| Up to 10 s of phantom time after a short exit | Time counted only between two active ticks |
| Morning lockout didn't trigger | `WakeUpDetector` that recognises the night from real usage |
| The steps mission counted shaking the phone | `StepValidator` using the accelerometer and walking rhythm |
| Alarm didn't ring after a restart before unlock | Direct boot support |
| A missing migration silently wiped the database | Destructive migration only for old versions, plus a test |
| Service put to sleep overnight | "Unrestricted battery" step in setup |

## Performance

- YouTube and Instagram were scanned up to 4 times a second. Now there is no scanning without an active rule, at most one scan per 0.75 s, and the fallback tree search at most once per 3 s.
- UI flows kept running in the background; they now collect with `collectAsStateWithLifecycle`.
- The app icon cache was unbounded in a long-lived process. It is now an LRU of about 4 MB that also trims on low memory.
