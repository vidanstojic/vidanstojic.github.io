---
title: ProductivityBuddy
summary: A JavaFX desktop app that watches running processes, lets you tag them as work or fun, and shows where your computer time goes in real time.
layer: interface
stack: [Java 21, JavaFX, Maven, OSHI]
repo: https://github.com/vidanstojic/ProductivityBuddy
context: University project
order: 30
---

- **Multi-module Maven build:** data service, OS scanner, analytics engine and JavaFX view, each with one responsibility.
- **Real-time scanner** that polls running processes at a configurable interval through OSHI.
- **Categories, aliases and freezing:** tag a process as Work, Fun or Other, give it a friendly name, or pause its time tracking.
- **Persistence and export:** state survives restarts as JSON, a file watcher reloads external edits, and CSV snapshots are exported on a schedule.
