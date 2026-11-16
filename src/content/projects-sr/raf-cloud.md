---
summary: Full-stack simulacija cloud platforme za kreiranje, upravljanje i zakazivanje virtuelnih mašina, sa ručno napravljenim slojem bezbednosti.
context: Predmet Veb programiranje, RAF
gallery:
  - alt: Angular klijent poziva Spring Boot server sa JWT i AOP bezbednošću, RBAC-om, servisom za mašine, planerom i WebSocket kanalom nazad ka klijentu
    caption: Zahtevi prolaze kroz sopstveni JWT i AOP sloj; završene operacije se šalju nazad preko WebSocket-a.
---

## Problem i cilj

Korisnici iz veb interfejsa prave, pokreću, zaustavljaju, restartuju i uništavaju virtuelne mašine. Svaka akcija zavisi od detaljnih dozvola, a operacije koje traju javljaju rezultat u realnom vremenu, umesto da korisnik osvežava stranicu.

## Arhitektura i tehničke odluke

- **Sopstvena bezbednost umesto Spring Security-ja.** Autentifikacija i autorizacija su napravljene pomoću JWT-a, refleksije i aspektno orijentisanog programiranja, pa je svaka provera dozvola eksplicitna i vidljiva u kodu.
- **Detaljna kontrola pristupa po ulogama.** Kreiranje, čitanje, izmena i brisanje su posebne dozvole i za korisnike i za mašine. Angular klijent sakriva ili onemogućava akcije koje trenutni korisnik ne sme da izvrši.
- **Neblokirajuće operacije nad mašinama.** Pokretanje, zaustavljanje i restart odmah vraćaju 2xx odgovor; operacija se izvršava u pozadini (10+ sekundi, simulirano).
- **Meko brisanje.** Uništavanje mašine je označava kao neaktivnu umesto da briše red iz baze.

## Izazovi i kako su rešeni

- **Duge operacije bez zamrznutog interfejsa.** Server odmah odgovara i šalje novi status mašine preko WebSocket-a kad se posao u pozadini završi.
- **Operacije u budućnosti.** Korisnici zakazuju pokretanje, zaustavljanje ili restart za određeno vreme. Pozadinski servis ih izvršava i beleži neuspehe u dnevnik grešaka koji korisnik može da pregleda.
- **Pronalaženje prave mašine.** Pretraga filtrira aktivne mašine po imenu, statusu i periodu kreiranja.
