---
title: Šta se menjalo i zašto
tab: Dnevnik izmena
summary: Izmene pravila, ispravke balansa i povratne informacije testera koje su oblikovale verziju u zatvorenom testiranju.
---

## Pravila i balans (oktobar 2026)

| Problem | Uzrok | Rešenje |
| --- | --- | --- |
| Jeftine karte su pobeđivale zvezde | Bez limita karata, količina je odlučivala | Podrazumevana pravila: po pet karata i plaćena predaja |
| Scout je dobijala 9 od 10 partija | Tačne ocene i savršeno gledanje unapred | Procena sa greškom do 2 poena, opreznija po klasičnim pravilima |
| Botovi su preplaćivali pogrešne sastojke | Fer udeo je brojao sve karte | Fer udeo broji samo korisne karte |
| Pogrešni sastojci su padali onome ko otvara | Otvarač je uvek morao da ponudi | U temi hrane otvarač sme da preskoči kartu |
| Podeljen ekran je prikazivao tanku traku terena | Podloga fiksne visine | Podloga pokriva ceo ekran, po polovina za svakog igrača |

## Prva runda testiranja (novembar 2026)

| Povratna informacija | Rešenje |
| --- | --- |
| „Outbid your rival.“ je bio odsečen na početnom ekranu | Viši sto i manje karte, pa tekst staje i sa velikim fontom |
| Botovi su pričali o napadačima u filmskoj partiji | Opisi botova po temi |
| Košarkaški tajmer se teško čitao | Isti prsten odbrojavanja kao u ostalim temama |
| Nije bilo pauze | Meni za pauzu sa nastavkom i predajom partije; partija se pauzira i kad aplikacija ode u pozadinu |
| Jedan igrač je završavao sa mnogo više karata (251:581) | Isti broj karata za oba igrača, uključeno podrazumevano |
| Rezultat 400:250 ne liči na fudbal | Realan rezultat iz razlike u oceni po karti |
| Isti igrači su se stalno vraćali | Shuffle bag po temi, sačuvan i posle restarta |
| Novi igrači nisu razumeli igru | Uputstvo od četiri strane koje se otvara pri prvom pokretanju |
| Igra je bila bez zvuka | Muzika, zvučni efekti i vibracija, svako sa svojim prekidačem |
| Telefon je vibrirao posle sopstvene ponude | Kratka vibracija kad potez dođe na tebe |

## Veći paketi

| Tema | Pre | Posle |
| --- | --- | --- |
| Fudbal | 50 | 150 |
| Košarka | 100 | 250 |
| Filmovi | 60 | 150 |
| Hrana | 10 jela | 20 jela |

## Priprema za Google Play

- Release verzija prikazuje broj verzije na početnom ekranu, pa testeri mogu da kažu koju su igrali.
- „Play a friend“ je označen kao „uskoro“ dok ne postoji server.
- Potpisane release verzije, opis u prodavnici, snimci ekrana i politika privatnosti za zatvoreno testiranje.
- *Tactical Rounds* je postala muzika partije.
