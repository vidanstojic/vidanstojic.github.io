---
title: Paralelna obrada slika
summary: Python sistem koji paralelno primenjuje filtere na velike skupove slika i vodi registar svake slike i zadatka.
team: Tim od 2
context: Predmet Paralelni algoritmi, RAF
gallery:
  - alt: "Petlja komandi koja pokreće niti za add, process, delete i list, skup procesa koji primenjuje filtere i registar slika"
    caption: "Komande rade u nitima, filteri u skupu procesa, a svaki rezultat završava u registru."
---

## Problem i cilj

Brzo primeniti filtere na velike skupove slika i uvek znati koja obrađena slika potiče od kog originala i kog zadatka.

## Arhitektura i tehničke odluke

- **Paralelno izvršavanje** pretvaranja u sivu sa ponderisanom osvetljenošću, Gausovog zamućenja sa konvolucionim jezgrom i podešavanja osvetljenosti.
- **JSON registar** originalnih i obrađenih slika, povezanih sa zadatkom koji ih je napravio.

## Izazovi i kako su rešeni

- **Praćenje istovremenog rada.** Zadaci prolaze kroz stanja na čekanju, u obradi i završeno, a beleže se vreme obrade i veličine fajlova pre i posle.
- **Životni vek slika.** Slike nose oznake za zakazano uklanjanje, a njihovi metapodaci se čuvaju u registru.
