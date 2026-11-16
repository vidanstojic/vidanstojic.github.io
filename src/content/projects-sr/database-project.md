---
title: Baza za međuplanetarno preseljenje
summary: Java desktop aplikacija nad SQL bazom za planiranje preseljenja na nastanjive planete — filteri nastanjivosti, smeštaj i rezervacije prevoza.
context: Predmet Baze podataka, RAF
---

## Problem i cilj

Relaciona baza i desktop interfejs za izmišljeni servis koji ljude seli sa Zemlje na nastanjive planete i mesece.

## Arhitektura i tehničke odluke

- Čist SQL preko JDBC `PreparedStatement`-a, bez ORM-a.
- Interfejs sa formama za unos podataka, filtriranje i transakcije.

## Izazovi i kako su rešeni

- **Odluka gde ljudi mogu da žive.** Upiti filtriraju planete i mesece po udaljenosti orbite, rotaciji, temperaturi, atmosferi, gravitaciji i bezbednosnoj istoriji.
- **Trgovina nad podacima.** Korisnici kupuju stambeni prostor i rezervišu polaske sa Zemlje, a kontrolna tabla prati njihove transakcije.
