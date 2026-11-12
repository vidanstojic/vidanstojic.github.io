---
title: Interplanetary relocation database
summary: A Java desktop application over a SQL database for planning moves to habitable planets — habitability filters, housing and transport bookings.
layer: data
stack: [Java, JDBC, MySQL]
context: Databases course, RAF
repo: https://github.com/vidanstojic/Data-Base-Project
order: 80
---

- Filters planets and moons by orbital distance, rotation, temperature, atmosphere and gravity to decide where a species can live.
- Accounts, buying residential space and booking departures, all through a GUI.
- Raw SQL through JDBC `PreparedStatement`s, without an ORM.
