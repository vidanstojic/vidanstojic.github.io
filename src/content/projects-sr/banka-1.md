---
summary: Mikroservisni backend za bankarski sistem — računi, kartice, krediti, transferi, menjačnica i trgovanje — koji je napravio studentski tim.
team: Timski projekat
context: Timski projekat, RAF
---

## Problem i cilj

Modelovati backend banke: klijente i zaposlene, račune i kartice, kredite, transakcije i transfere, menjanje valuta, kao i naloge za trgovanje i akcije. Veliki tim je morao da radi paralelno, a da ne kvari servise jedni drugima.

## Arhitektura i tehničke odluke

- **Jedan servis po domenu** (računi, kartice, klijenti, zaposleni, krediti, transakcije, transferi, menjačnica, nalozi, akcije, obaveštenja, verifikacija) iza API gateway-a.
- **PostgreSQL** za skladištenje i **RabbitMQ** za razmenu poruka između servisa.
- **Zajednička infrastruktura jednom komandom.** Baza, broker i servisi za obaveštenja i korisnike pokreću se jednim Docker Compose fajlom.

## Izazovi i kako su rešeni

- **Doslednost velike baze koda.** Svaki `git push` pokreće četiri provere preko Git hook-ova i ponovo u GitHub Actions-u: testove za svaki servis, Checkstyle, proveru dokumentacije i validaciju OpenAPI specifikacije.
- **Dokumentacija koja prati kod.** Svaki servis mora da ima README sa uputstvom za Docker Compose, promenljivim okruženja i primerima endpoint-a, kao i OpenAPI specifikaciju. Push bez njih se odbija.
