---
title: Arhitektura aplikacije
tab: Arhitektura
summary: Kako jedan Kotlin kod pokreće partiju na Androidu i iOS-u, zašto su pravila čista funkcija i kako nastaju paketi karata.
---

## Tri pravila dizajna

- **Jedan kod, tanke platforme.** Svi ekrani i sva pravila su u `commonMain`. Android i iOS daju samo zvuk, vibraciju, čuvanje podataka i deljenje, preko `expect`/`actual` platformskih servisa.
- **Pravila bez sporednih efekata.** `MatchEngine` prima stanje i akciju i vraća sledeće stanje. Nema sat, sopstvenu slučajnost ni I/O, pa interfejs, botovi i testovi pokreću istu funkciju.
- **Vreme je van pravila.** Tajmer poteza, pauze i vreme razmišljanja bota pripadaju `MatchDriver`-u, koji vreme pretvara u akcije kao što je `Timeout`. Mehanizam pravila nikad ništa ne čeka.

## Slojevi i paketi

| Paket | Uloga | Platformski kod? |
| --- | --- | --- |
| `domain/match/` | `MatchEngine`, `MatchState`, `MatchRules`, `ScoreProjection` | Ne |
| `domain/bot/` | Ličnosti, procena ocena, vrednovanje, gledanje unapred | Ne |
| `domain/model/` | Teme, karte, paketi, bazeni partije, `ShuffleBag` | Ne |
| `data/pack/` | Učitava JSON pakete koji idu uz aplikaciju | Ne |
| `data/prefs/` | Pamti odigrane karte i posle restarta | Ne |
| `feedback/` | Muzika, zvučni efekti i vibracija iza tri podešavanja | Ne |
| `platform/` | Skladište ključ-vrednost, zvuk, vibracija, deljenje | `expect`/`actual` |
| `ui/` | Compose ekrani, `MatchDriver`, podloge po temama | Ne |
| `androidMain/`, `iosMain/` | Ulazne tačke i platformske implementacije | Da |

## Jedna karta, korak po korak

1. **Izvlačenje.** Mehanizam gleda oba igrača. Ako oba imaju poena, otvarač ove karte mora da ponudi. Ako je jedan na 0, drugi bira ko dobija kartu besplatno. Ako su igraču popunjena mesta, karta ide drugom.
2. **Licitiranje.** Igrači podižu za 1, 2 ili 5 poena ili odustaju. Ponuda veća od celog protivnikovog budžeta odmah osvaja kartu. Kad istekne vreme, mehanizam podiže za 1 ako može; inače kartu uzima poslednja protivnikova ponuda.
3. **Predaja.** Pre prve ponude otvarač može da plati 1, pa 2, pa 3 poena tokom partije da bi protivnik otvorio kartu umesto njega.
4. **Dodela.** Pobednik plaća svoju ponudu i uzima kartu. U temi hrane otvarač sme da preskoči kartu i tada je niko ne dobija.
5. **Sledeća karta.** Izvlači se sledeća karta, a posle poslednje partija se završava.

Dijagram na stranici [Pregled](/sr/projects/draft-duel/) prikazuje ova stanja i prelaze.

## Drajver partije

`MatchDriver` vodi jednu partiju na korutini. Odbrojava potez od 10 sekundi, traži potez od bota posle kratke pauze nalik ljudskoj i javlja događaje (tvoj potez, podizanje, odustajanje, osvojena karta, poslednje sekunde) sloju za zvuk i vibraciju. Čuva skup razloga za pauzu, kao što su meni za pauzu ili predaja telefona drugom igraču, a sam pauzira kad aplikacija ode u pozadinu. Dok je partija pauzirana, sat i bot čekaju.

## Paketi karata

Paketi su JSON fajlovi koji idu uz aplikaciju, a prave ih Python skripte, pa su ocene podaci, a ne kod.

| Tema | Karte | Izvor ocena |
| --- | --- | --- |
| Fudbal | 150, po 30 iz svake od pet liga | Baza ocena; po ligi 3 zvezde, 9 jakih i 18 solidnih igrača |
| Košarka | 250, NBA i Evroliga | Dodeljene ručno za sezonu 2025/26, svaka liga na svojoj skali |
| Filmovi | 150, šest žanrova | Dodeljene ručno |
| Hrana | 20 jela | Sastojci koji zbirno daju 100, plus pogrešni sa negativnim poenima |

Validator proverava svaki paket: opseg ocena, kategorije i recepte koji daju tačno 100.

## Konačan rezultat

Zbir ocena uvek određuje pobednika. `ScoreProjection` ga samo prevodi u rezultat koji liči na sport. Razlika zavisi od razlike u oceni po karti, pa ne zavisi od broja odigranih karata: u fudbalu je ispod 3 poena po karti pobeda od jednog gola, a 15 i više je pet golova. Rezultat ima seed iz karata i cena, pa ista partija uvek prikazuje isti rezultat.

## Testovi

71 unit test radi nad zajedničkim kodom: mehanizam prema tabeli pravila, pravila sa pet mesta i sopstvena pravila, recept mod, svaka ličnost bota, simulacije bot protiv bota, projekcija rezultata, shuffle bag, čitanje paketa, zvuk i vibracija i redosled događaja drajvera.

## Privatnost

Sve radi na telefonu. Aplikacija nema dozvolu za internet ni analitiku. Pogledajte [Politiku privatnosti](/sr/projects/draft-duel/privacy/).
