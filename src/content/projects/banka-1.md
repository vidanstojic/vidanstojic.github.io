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

## Problem and goal

Model the backend of a bank: clients and employees, accounts and cards, credits, transactions and transfers, currency exchange, and trading orders and stocks. A large team had to work on it in parallel without breaking each other's services.

## Architecture and technical decisions

- **One service per domain** (accounts, cards, clients, employees, credits, transactions, transfers, exchange, orders, stocks, notifications, verification) behind an API gateway.
- **PostgreSQL** for storage and **RabbitMQ** for messaging between services.
- **Shared infrastructure in one command.** The database, the broker and the notification and user services start with a single Docker Compose file.

## Challenges and how they were solved

- **Keeping a large codebase consistent.** Every `git push` runs four checks through Git hooks and again in GitHub Actions: tests for every service, Checkstyle linting, documentation checks and OpenAPI validation.
- **Documentation that keeps up.** Each service must ship a README with Docker Compose instructions, environment variables and endpoint examples, plus an OpenAPI specification. Pushes without them are rejected.
