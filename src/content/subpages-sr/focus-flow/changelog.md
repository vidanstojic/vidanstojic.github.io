---
title: Pronađeni i ispravljeni bagovi
tab: Dnevnik izmena
summary: Bagovi koji su oblikovali sadašnji dizajn, šta je izazvalo svaki od njih i kako je ispravljen.
---

## Refaktorisanje mehanizma

| Problem | Uzrok | Rešenje |
| --- | --- | --- |
| Blokada nikad nije radila | Servis za praćenje nikad nije pokrenut | Pokreće se iz glavne aktivnosti i pri paljenju telefona |
| Blokirana aplikacija mogla je da se koristi posle 15 s | Aplikacija u prvom planu bila je „poslednja nastavljena u 15 s" | Inkrementalni `ForegroundResolver` |
| Korišćenje se računalo dvaput | I servis i sinhronizacija su upisivali sesije | Sinhronizacija je jedini pisac |
| Prethodni dani su bili pogrešni | Sesije na granici sinhronizacije gubile su početak | `safeCursor` |
| Pogrešni sati i dani oko pomeranja sata | Cela sesija se računala u satu u kom je počela | `UsageSplitter` sa stvarnim kalendarskim danima |
| Ceo YouTube se računao kao Shorts | Traženje teksta „Shorts" u navigaciji | `ShortsDetector` po ID-ju i veličini pogleda |
| ANR greške i trošenje baterije | Stablo pogleda skenirano na glavnoj niti | Serijski pozadinski dispečer, ograničavanje učestalosti |
| Hitna pauza je isticala u ponoć | Poređenje oznaka „HH:mm" | Čuva se kao apsolutni trenutak |
| Overlay je padao | WindowManager pozivan iz pozadinske niti | Prebačeno na glavnu nit |
| Korišćenje je svuda bilo 0 | Sinhronizacija bez dozvole dobijala je prazan rezultat i pomerala kursor | Provera dozvole; kursor se pomera samo uz događaje |
| Prethodni dani su bili prazni | Samopopravka za praznu tabelu nikad se nije pokrenula | Eksplicitna dopuna za 10 dana sa brojem verzije |

## Stabilizacija (oktobar 2026)

| Problem | Rešenje |
| --- | --- |
| Posle blokade Reels-a, Shorts je i dalje radio | Jedno zajedničko stanje i budžet za sve aplikacije sa kratkim snimcima |
| Do 10 s fantomskog vremena posle kratkog izlaska | Vreme se računa samo između dva aktivna otkucaja |
| Jutarnja blokada se nije aktivirala | `WakeUpDetector` koji prepoznaje noć po stvarnom korišćenju |
| Misija sa koracima je računala tresenje telefona | `StepValidator` koji koristi akcelerometar i ritam hoda |
| Alarm nije zvonio posle restarta pre otključavanja | Podrška za direct boot |
| Nedostajuća migracija tiho je brisala bazu | Destruktivna migracija samo za stare verzije, uz test |
| Sistem je uspavljivao servis preko noći | Korak „Neograničena baterija" u podešavanju |

## Performanse

- YouTube i Instagram su skenirani i do 4 puta u sekundi. Sada nema skeniranja bez aktivnog pravila, najviše jedno skeniranje na 0,75 s, a rezervna pretraga stabla najviše jednom u 3 s.
- Tokovi interfejsa su nastavljali da rade u pozadini; sada se skupljaju pomoću `collectAsStateWithLifecycle`.
- Keš ikonica aplikacija nije imao ograničenje u dugotrajnom procesu. Sada je LRU od oko 4 MB koji se smanjuje i kad ponestaje memorije.
