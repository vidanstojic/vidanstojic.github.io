---
title: Color histogram classifier
summary: An image classifier based on 3D color histograms and cosine similarity, written in a strictly functional style with no loops.
layer: data
stack: [Python, Functional programming]
team: Team of 2
context: Parallel Algorithms course, RAF
repo: https://github.com/vidanstojic/Parallel-algorithms
order: 70
---

## Problem and goal

Predict the category of an image from its colors alone, and do it in a strictly functional style.

## Architecture and technical decisions

- Builds RGB histograms with configurable bin counts and averages them into a profile per class.
- Classifies an unknown image by cosine similarity between its histogram and each class profile.

## Challenges and how they were solved

- **No loops allowed.** Everything is written with `map`, `filter`, `reduce`, lambdas and iterators: no explicit loops and no comprehensions, even for utilities such as length.
- **Memory with large image sets.** Lazy iterators process images one at a time instead of loading them all.
