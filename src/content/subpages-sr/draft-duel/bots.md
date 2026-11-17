---
title: Šest botova, šest stilova
tab: Botovi
summary: Kako botovi pogađaju skrivene ocene, odlučuju koliko karta vredi i planiraju ostatak partije, i kako su izbalansirani.
---

## Licitiranje na osnovu procene

Ocene su skrivene dok se licitira, pa ih ni pošten bot ne vidi. Svaki bot licitira na osnovu svoje procene: prave ocene pomerene njegovim sklonostima i zamućene za nekoliko poena. Sunday Sam može da pogreši za 9 poena i precenjuje napadače; Scout Nina greši najviše za 2.

## Koliko karta vredi

Fer cena karte za bota je njegov budžet podeljen brojem praznih mesta, skaliran prema tome koliko karta izgleda dobro u odnosu na ostatak paketa. Osnova te skale je donja četvrtina paketa, pa prosečna karta vredi nešto, ali ne mnogo. Svaka ličnost zatim dodaje svoj stil: koliko diže, da li „krade“ u poslednjem trenutku, kada plaća da preda kartu.

Scout Nina ide dalje. Ostatak partije planira modelom koji gleda unapred: očekivani zbir najboljih *k* od *n* karata koje tek dolaze (statistike poretka), uključujući pravilo da onaj ko bira dok je protivnik na 0 uzima najbolje od preostalog. Model se kešira po paketu i pravilima, a prvi potez se računa van UI niti.

## Botovi

| Bot | Stil | Težina | Pobede, fudbal | Pobede, filmovi | Predaje po partiji |
| --- | --- | --- | --- | --- | --- |
| Scout Nina | Zna ocene skoro tačno i planira unapred | Teško | 74% | 71% | 1,8 |
| Galáctico Gio | Sve na zvezde, ostalima nudi malo | Srednje | 65% | 61% | 1,6 |
| Bargain Bea | Nikad ne preplaćuje, čeka prilike | Srednje | 56% | 57% | 1,4 |
| Steady Stefan | Originalna formula iz specifikacije | Srednje | 42% | 50% | 0,8 |
| Hustler Hugo | Diže cene samo da isprazni tvoj budžet | Lako | 36% | 33% | 0 |
| Sunday Sam | Licitira po osećaju i voli napadače | Lako | 27% | 28% | 0 |

Procenti pobeda su proseci protiv ostalih pet botova, iz 1.000 partija po paru po podrazumevanim pravilima (po pet karata, plaćena predaja). Otvarač prve karte pobeđuje u 48,3% fudbalskih i 47,9% filmskih partija, pa prvi potez nije prednost.

## Balansiranje

- **Scout je bila prejaka.** Sa tačnim ocenama i gledanjem unapred dobijala je 89–96% partija sa ocenama. Sada procenjuje sa greškom do 2 poena i igra malo opreznije po klasičnim pravilima.
- **Hrana je razbila formulu.** Botovi su pogrešne sastojke računali kao karte vredne kupovine i premalo plaćali prave. Fer udeo sada broji samo korisne karte.
- **Pet mesta je promenilo poredak.** Galáctico je bio najslabiji bot kad nema limita karata. Sa pet mesta svaka jeftina karta zauzima mesto boljoj, pa zvezde ponovo vrede i on je skočio na drugo mesto.
- **Težina zavisi od pravila.** Izbor bota prikazuje težinu za izabranu temu i pravila, jer stil koji je lak u jednoj postavci može biti srednji u drugoj.
