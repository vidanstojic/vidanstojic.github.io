---
title: RAF Cloud
summary: A full-stack simulation of a cloud platform for provisioning, controlling and scheduling virtual machines, with a hand-built security layer.
layer: services
stack: [Kotlin, Spring Boot, Angular, WebSocket, JWT, AOP]
context: Web programming course, RAF
repo: https://github.com/vidanstojic/RAF-Cloud
featured: true
order: 2
---

RAF Cloud lets users create, start, stop, restart and destroy virtual machines from a web interface. Every action is governed by fine-grained permissions, and long-running operations report back in real time.

## Highlights

- **Custom security instead of Spring Security.** Authentication and authorization are implemented with JWT, reflection and aspect-oriented programming, so the permission checks are explicit and visible in the code.
- **Granular role-based access control.** Create, read, update and delete are separate permissions for both users and machines. The Angular client hides or disables actions the current user cannot perform.
- **Non-blocking machine operations.** Start, stop and restart return immediately with a 2xx response; the operation runs in the background (10+ seconds, simulated) and a WebSocket pushes the new status to the client when it finishes.
- **Scheduling.** Operations can be scheduled for a future time. A background service executes them and records failures in an error log the user can browse.
- **Search and soft delete.** Machines are filterable by name, status and creation date; destroying a machine marks it inactive instead of deleting the row.
