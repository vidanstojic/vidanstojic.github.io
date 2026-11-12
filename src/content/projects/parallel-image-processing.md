---
title: Parallel image processing
summary: A Python system that applies filters to large batches of images in parallel and keeps a registry of every image and task.
layer: data
stack: [Python, multiprocessing, JSON]
team: Team of 2
context: Parallel Algorithms course, RAF
repo: https://github.com/vidanstojic/Parallel-algorithms-first
order: 60
---

- Grayscale with weighted luminance, Gaussian blur with a convolution kernel, and brightness adjustment, executed in parallel.
- A JSON registry of original and processed images, linked to the task that produced them.
- Tasks tracked through pending, in-progress and completed, with processing time and file sizes before and after.
