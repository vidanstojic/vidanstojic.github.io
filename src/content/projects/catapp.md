---
title: CatApp
summary: An Android app for browsing cat breeds, with search, breed details and a photo gallery, built on MVI.
layer: interface
stack: [Kotlin, Jetpack Compose, Hilt, Room, DataStore, Coroutines]
context: Mobile Application Development course, RAF
repo: https://github.com/vidanstojic/CatApp---Mobile-application-development
order: 40
---

## Problem and goal

A modern Android app built to current standards: a browsable catalogue of cat breeds with search, details and photos, plus a local user profile created on first launch.

## Architecture and technical decisions

- **Model-View-Intent** for predictable, unidirectional state.
- **Room** for cached breed data and **DataStore** for the local user profile.
- **Hilt** for dependency injection and **Coroutines** for background work.

## Challenges and how they were solved

- **Lots of images.** Breed lists show previews, and every breed has its own photo gallery with a dedicated full-screen viewer.
- **Onboarding without a backend.** The account is created locally on first launch and can be edited later from the profile screen.
