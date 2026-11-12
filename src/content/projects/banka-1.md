---
title: Banka 1
summary: A microservice backend for a banking system — accounts, cards, credits, transfers, exchange and trading — built by a student team.
layer: services
stack: [Java 21, Spring Boot, Gradle, PostgreSQL, RabbitMQ, Docker, OpenAPI]
team: Team project
context: Team project, RAF
repo: https://github.com/vidanstojic/Banka-1-Backend
order: 10
---

A backend split into services for accounts, cards, clients, employees, credits, transactions, transfers, currency exchange, orders and stocks, behind an API gateway, with PostgreSQL for storage and RabbitMQ for messaging.

## How the team worked

- Every push runs four automatic checks through Git hooks and GitHub Actions: tests for every service, Checkstyle linting, documentation checks and OpenAPI validation.
- Each service must ship a README with Docker Compose instructions, environment variables and endpoint examples, plus an OpenAPI specification.
- Shared infrastructure (database, broker, notification and user services) starts with one Docker Compose file.
