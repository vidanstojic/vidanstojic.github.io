---
title: xv6 kernel extensions
summary: Three extensions to the xv6 teaching kernel in C — shell history in the console driver, symbolic links in the file system, and named shared memory between processes.
layer: kernel
stack: [C, xv6, x86]
context: Operating Systems course, RAF
featured: true
order: 3
---

Three assignments, each one a change that cuts through the xv6 kernel and its user space.

## Shell history

[Repository](https://github.com/vidanstojic/OS-HW1)

- Command history kept in a fixed-size circular buffer inside the console input path.
- Browsing history with keyboard shortcuts while preserving whatever the user had already typed.
- Recalled commands can be edited in place; recalled text and newly typed text are rendered in different colors with ANSI sequences.

## Symbolic links and disk usage

[Repository](https://github.com/vidanstojic/OS-HW2)

- A new inode type and a system call for creating symbolic links.
- Path resolution that follows links recursively, with a depth limit to stop cycles, and an open flag that skips dereferencing.
- `stat` extended with physical block counts, plus user-space tools to create and inspect links and a recursive `du`.

## Shared memory

[Repository](https://github.com/vidanstojic/OS-HW3)

- A kernel registry of shared memory objects identified by name, so unrelated processes can find the same object.
- Mapping the same physical pages into several processes' page tables, with read/write permissions per mapping.
- Reference counting, so physical pages are freed only when the last process closes its descriptor.
