---
title: RAF Cloud
summary: A full-stack simulation of a cloud platform for provisioning, controlling and scheduling virtual machines, with a hand-built security layer.
layer: services
stack: [Kotlin, Spring Boot, Angular, WebSocket, JWT, AOP]
context: Web programming course, RAF
repo: https://github.com/vidanstojic/RAF-Cloud
gallery:
  - src: ../../assets/projects/raf-cloud-architecture.svg
    alt: Angular client calling a Spring Boot server with JWT and AOP security, RBAC, a machine service, a scheduler and a WebSocket channel back to the client
    caption: Requests pass a custom JWT and AOP layer; finished operations are pushed back over WebSocket.
featured: true
order: 2
---

## Problem and goal

Users create, start, stop, restart and destroy virtual machines from a web interface. Every action is governed by fine-grained permissions, and operations that take time report back in real time instead of making the user refresh.

## Architecture and technical decisions

- **Custom security instead of Spring Security.** Authentication and authorization are implemented with JWT, reflection and aspect-oriented programming, so every permission check is explicit and visible in the code.
- **Granular role-based access control.** Create, read, update and delete are separate permissions for both users and machines. The Angular client hides or disables actions the current user cannot perform.
- **Non-blocking machine operations.** Start, stop and restart return a 2xx response immediately; the operation runs in the background (10+ seconds, simulated).
- **Soft delete.** Destroying a machine marks it inactive instead of deleting the row.

## Challenges and how they were solved

- **Long operations without a frozen UI.** The server answers at once and pushes the new machine status over a WebSocket when the background work completes.
- **Operations in the future.** Users schedule start, stop or restart for a given time. A background service runs them and records failures in an error log the user can browse.
- **Finding the right machine.** Search filters active machines by name, status and creation date range.
