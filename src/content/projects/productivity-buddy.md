---
title: ProductivityBuddy
summary: A JavaFX desktop app that watches running processes, lets you tag them as work or fun, and shows where your computer time goes in real time.
layer: desktop
stack: [Java 21, JavaFX, Maven, OSHI]
repo: https://github.com/vidanstojic/ProductivityBuddy
context: University project
order: 30
---

## Problem and goal

Show, live, how computer time splits between work, fun and everything else, based on the processes that are actually running.

## Architecture and technical decisions

- **Multi-module Maven build:** data service, OS scanner, analytics engine and JavaFX view, each with one responsibility.
- **Real-time scanner** that polls running processes at a configurable interval (1 s by default) through OSHI.
- **Categories, aliases and freezing:** tag a process as Work, Fun or Other, give it a friendly name, or pause its time tracking without killing it.

## Challenges and how they were solved

- **State that survives restarts.** Categories, aliases, total time and freeze state are stored as JSON.
- **Edits made outside the app.** A file watcher reloads the JSON mapping when it is changed externally.
- **Getting data out.** CSV snapshots are exported on a schedule or at times the user picks.
