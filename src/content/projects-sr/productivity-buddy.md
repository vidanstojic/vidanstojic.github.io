---
summary: JavaFX desktop aplikacija koja prati pokrenute procese, omogućava da ih označite kao posao ili zabavu i u realnom vremenu pokazuje gde odlazi vreme za računarom.
context: Univerzitetski projekat
gallery:
  - alt: "Maven moduli ProductivityBuddy-ja: skener, servis podataka, analitika i JavaFX prikaz, sa JSON i CSV fajlovima na disku"
    caption: "Četiri Maven modula, svaki sa jednom odgovornošću. Registar u data-service modulu je zajedničko stanje."
---

## Problem i cilj

Pokazati, uživo, kako se vreme za računarom deli na posao, zabavu i sve ostalo, na osnovu procesa koji zaista rade.

## Arhitektura i tehničke odluke

- **Maven projekat sa više modula:** servis za podatke, skener operativnog sistema, mehanizam za analitiku i JavaFX prikaz, svaki sa jednom odgovornošću.
- **Skener u realnom vremenu** koji preko OSHI biblioteke proverava pokrenute procese u podesivom intervalu (podrazumevano 1 s).
- **Kategorije, nadimci i zamrzavanje:** proces se može označiti kao Posao, Zabava ili Drugo, dobiti čitljivije ime ili mu se može pauzirati merenje vremena bez gašenja.

## Izazovi i kako su rešeni

- **Stanje koje preživljava restart.** Kategorije, nadimci, ukupno vreme i stanje zamrzavanja čuvaju se kao JSON.
- **Izmene van aplikacije.** File watcher ponovo učitava JSON mapiranje kad se fajl promeni spolja.
- **Izvoz podataka.** CSV snimci stanja izvoze se po rasporedu ili u vreme koje korisnik izabere.
