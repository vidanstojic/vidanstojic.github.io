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

- Builds RGB histograms with configurable bin counts and averages them into a profile per class.
- Classifies an unknown image by cosine similarity between its histogram and each class profile.
- Written only with `map`, `filter`, `reduce`, lambdas and iterators: no explicit loops and no comprehensions, even for utilities such as length.
