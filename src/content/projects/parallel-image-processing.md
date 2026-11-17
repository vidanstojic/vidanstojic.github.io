---
title: Parallel image processing
summary: A Python system that applies filters to large batches of images in parallel and keeps a registry of every image and task.
layer: data
stack: [Python, multiprocessing, JSON]
team: Team of 2
context: Parallel Algorithms course, RAF
repo: https://github.com/vidanstojic/Parallel-algorithms-first
order: 60
gallery:
  - src: ../../assets/projects/parallel-image-processing-flow.svg
    alt: "Command loop starting threads for add, process, delete and list, a process pool applying filters, and an image registry"
    caption: "Commands run in threads, filters run in a process pool, and every result lands in the registry."
---

## Problem and goal

Apply filters to large batches of images quickly, and always know which processed image came from which original and which task.

## Architecture and technical decisions

- **Parallel execution** of grayscale with weighted luminance, Gaussian blur with a convolution kernel, and brightness adjustment.
- **A JSON registry** of original and processed images, linked to the task that produced them.

## Challenges and how they were solved

- **Tracking concurrent work.** Tasks move through pending, in progress and completed, with processing time and file sizes recorded before and after.
- **Image lifecycle.** Images carry flags for scheduled removal, and their metadata is kept in the registry.
