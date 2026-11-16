---
title: Arhitektura sistema
tab: Arhitektura
summary: Kako podaci o korišćenju putuju od Android događaja do grafikona i ekrana za blokadu, i zašto osnovna logika nema Android zavisnosti.
---

## Tri pravila kojih se dizajn drži

- **Jedan pisac za korišćenje.** Samo sync posao upisuje podatke o korišćenju. Interfejs, servis za sprovođenje pravila i pozadinski worker ih samo čitaju.
- **Jedno mesto koje odlučuje o blokadi.** `RulesEngine` je čista Kotlin funkcija. Svi ulazi, uključujući trenutno vreme i vremensku zonu, prosleđuju se spolja, pa se svaki scenario testira bez uređaja.
- **Logika odvojena od Androida.** Rekonstrukcija sesija, podela po satima, pravila i interval režim su u `domain/usage` i `domain/rules`, koji bi mogli bez izmena da pređu u poseban Gradle modul.

## Slojevi i paketi

| Paket | Uloga | Android? |
| --- | --- | --- |
| `model/` | Korisnička pravila: limiti aplikacija, rasporedi, ograničenja sesija, podešavanja za Shorts, buđenje, alarmi | Ne |
| `domain/usage/` | `SessionReconstructor`, `ForegroundResolver`, `UsageSplitter` | Ne |
| `domain/rules/` | `RulesEngine`, `ScheduleWindows`, `SessionLimitTracker` | Ne |
| `data/local/` | Room entiteti, DAO-ovi, baza | Da |
| `data/usage/` | `UsageEventSource`, adapter nad `UsageStatsManager`-om | Da |
| `service/` | `FocusMonitorService`, `ShortsAccessibilityService`, overlay | Da |
| `worker/` | `UsageAggregationWorker`: periodična sinhronizacija i čišćenje starih podataka | Da |
| `ui/` | Compose interfejs, navigacija i po jedan folder za svaki ekran | Da |

## Od događaja do sesija

`UsageEventSource` čita `UsageStatsManager.queryEvents` i svodi sistemske događaje na četiri vrste: nastavljeno, pauzirano, gašenje ekrana i isključivanje. Launcher-i, sistemski interfejs i sama aplikacija se izostavljaju, kao što radi i Digital Wellbeing.

`SessionReconstructor` zatim pravi sesije po modelu „jedna aplikacija u prvom planu":

- Aplikacija koja se nastavi zatvara onu koja je bila otvorena i otvara sebe.
- Događaj pauze zatvara aplikaciju samo ako je ona trenutno otvorena, jer se na Samsung telefonima nova aplikacija često nastavi pre nego što se stara pauzira.
- Gašenje ekrana i isključivanje zatvaraju sve.
- Ako se ista aplikacija vrati u roku od 5 s, to je ista sesija (prelazak između ekrana jedne aplikacije). Sesije kraće od 1 s se odbacuju.

Rezultat sadrži `safeCursor`: tačku od koje sledeća sinhronizacija može da čita, a da ne izgubi početak sesije koja je još otvorena.

## Sinhronizacija

Sinhronizacija se pokreće na svakih 60 s dok je ekran upaljen, kad aplikacija dođe u prvi plan i na svakih 6 sati preko WorkManager-a kao rezerva. Globalni mutex obezbeđuje da u jednom trenutku radi samo jedna.

1. Bez dozvole za pristup korišćenju odmah staje i ne dira kursor.
2. Čita događaje od kursora, ili radi punu dopunu za poslednjih 10 dana kad je sačuvana istorija nepotpuna.
3. Sirove sesije se upisuju po ključu `(paket, početak)`, pa se otvorena sesija produžava umesto da se duplira.
4. Sesije od dana kursora nadalje `UsageSplitter` seče po satima, a satna tabela se ponovo gradi u jednoj transakciji.
5. Kursor se pomera samo ako je pročitan bar jedan događaj.

## Odluka o blokadi

`RulesEngine.evaluate` skuplja svako pravilo koje se trenutno primenjuje (raspored, dnevni limit grupe, pauza posle sesije, kazna za Shorts, jutarnja blokada) i vraća ono koje blokira najduže, pa korisnik vidi stvarno vreme do otključavanja. Aktivna hitna pauza poništava sve.

## Testovi

131 JUnit test pokriva jezgro u čistom Kotlinu, uključujući stvaran redosled događaja na Samsung telefonu, podelu po satima pri pomeranju sata 25. oktobra, prioritet pravila i interval režim, kao i proveru da svaka verzija baze ima migraciju.

## Privatnost

Sve ovo radi na uređaju. Aplikacija nema dozvolu za internet, pa podaci o korišćenju nikad ne napuštaju telefon. Pogledajte [Politiku privatnosti](/sr/projects/focus-flow/privacy/).
