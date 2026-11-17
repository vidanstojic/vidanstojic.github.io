---
title: Interplanetary relocation database
summary: A Java desktop application over a SQL database for planning moves to habitable planets — habitability filters, housing and transport bookings.
layer: data
stack: [Java, JDBC, MySQL]
context: Databases course, RAF
repo: https://github.com/vidanstojic/Data-Base-Project
order: 80
gallery:
  - src: ../../assets/projects/database-project-schema.svg
    alt: "Database schema with planets, missions, housing, journeys, residents, registered users, bought housing and bought tickets"
    caption: "The schema. Planets and registered users are the two hubs everything else points to."
---

## Problem and goal

A relational database and a desktop GUI for a fictional service that relocates people from Earth to habitable planets and moons.

## Architecture and technical decisions

- Raw SQL through JDBC `PreparedStatement`s, without an ORM.
- A GUI with forms for data entry, filtering and transactions.

## Challenges and how they were solved

- **Deciding where people can live.** Queries filter planets and moons by orbital distance, rotation, temperature, atmosphere, gravity and safety record.
- **Commerce on top of the data.** Users buy residential space and book departures from Earth, and a dashboard tracks their transactions.
