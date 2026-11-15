---
title: xv6 kernel extensions
summary: Three extensions to the xv6 teaching kernel in C — shell history in the console driver, symbolic links in the file system, and named shared memory between processes.
layer: kernel
stack: [C, xv6, x86]
context: Operating Systems course, RAF
repos:
  - label: Shell history
    url: https://github.com/vidanstojic/OS-HW1
  - label: Symbolic links
    url: https://github.com/vidanstojic/OS-HW2
  - label: Shared memory
    url: https://github.com/vidanstojic/OS-HW3
gallery:
  - src: ../../assets/projects/xv6-shared-memory.svg
    alt: Two processes whose page tables map the same physical page, found through a named shared memory registry
    caption: Named shared memory. The physical page is freed when the last process closes it.
featured: true
order: 3
---

## Problem and goal

Three assignments, each one a change that cuts through the xv6 kernel and its user space: better input in the shell, a richer file system and a way for processes to share memory.

## Architecture and technical decisions

### Shell history

- Command history kept in a fixed-size circular buffer inside the console input path.
- Browsing history with keyboard shortcuts while preserving whatever the user had already typed.
- Recalled text and newly typed text are rendered in different colors with ANSI sequences.

### Symbolic links and disk usage

- A new inode type and a `symlink` system call.
- `stat` extended with physical block counts, plus user-space tools to inspect links and a recursive `du`.

### Shared memory

- A kernel registry of shared memory objects identified by name, so unrelated processes can find the same object with `shm_open`.
- `shm_trunc` sets the size, `shm_map` maps the same physical pages into each process's page table with read or write permission, and `shm_close` releases it.

## Challenges and how they were solved

- **Editing recalled commands.** Switching between history and live input must not lose what the user typed. The active input buffer is saved before browsing and restored when the user returns to it.
- **Link cycles.** A link pointing to itself would loop forever during path resolution. Resolution follows links with a depth limit, and the `O_NOFOLLOW` flag opens a link without following it.
- **Freeing shared pages safely.** Physical pages are reference-counted and freed only when the last process closes its descriptor.
