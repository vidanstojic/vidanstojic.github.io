---
summary: Android aplikacija koja prati vreme provedeno na ekranu i sprovodi ograničenja koja postavite — limite po aplikaciji, rasporede, blokadu Shorts/Reels snimaka i pametni alarm.
team: Samostalno
context: Lični projekat, u pripremi za Google Play
gallery:
  - alt: Početni ekran sa dva dela, Screen Manager i Smart Alarms
    caption: "Početni ekran: vreme na ekranu i alarmi u jednoj aplikaciji."
  - alt: Pregled sa današnjim vremenom na ekranu, grafikonom po satima, najkorišćenijim aplikacijama i aktivnim zaštitama
    caption: "Pregled: današnje vreme na ekranu po satima i najkorišćenije aplikacije."
  - alt: Statistika vremena na ekranu po danu, nedelji i mesecu, sa grafikonom po satima i listom aplikacija
    caption: "Statistika po danu, nedelji i mesecu. Dodir na stubić prikazuje taj sat."
  - alt: "Ekran sa limitima: dnevni limiti, limiti sesija i rasporedi kao što su noćni fokus i radno vreme"
    caption: "Dnevni limiti, limiti sesija i rasporedi."
  - alt: Dnevni budžet za Shorts i Reels, jutarnja blokada posle buđenja i hitna pauza svih limita
    caption: "Blokada Shorts i Reels snimaka, jutarnja blokada i hitna pauza."
  - alt: Novi alarm sa tonom, jačinom, postepenim pojačavanjem, vibracijom i odlaganjem
    caption: "Pametni alarm koji počinje tiho i postepeno se pojačava."
  - alt: Podešavanja alarma sa misijom za buđenje (matematika, kucanje ili koraci), detoksom posle buđenja i proverom da ste zaista ustali
    caption: "Misije za buđenje, blokada aplikacija posle buđenja i provera „da li si ustao\"."
  - alt: Tok podataka od Android događaja korišćenja, preko rekonstrukcije sesija i satnih zbirova, do mehanizma pravila i ekrana za blokadu
    caption: Od sirovih Android događaja do odluke o blokadi. Narandžasti delovi su čist Kotlin, testiran bez emulatora.
---

## Problem i cilj

Focus Flow ne samo da prikazuje vreme na ekranu. Čita sistemske događaje korišćenja, od njih rekonstruiše sesije aplikacija i sprovodi pravila koja korisnik postavi: dnevne limite po aplikaciji, rasporede, ograničenja sesija, blokadu kratkih video snimaka i jutarnji alarm koji drži aplikacije koje odvlače pažnju zaključanim dok korisnik ne ustane.

Cilj su bili brojevi koji se poklapaju sa stvarnošću u minut i blokada koja se ne može zaobići brzim prebacivanjem između aplikacija.

## Arhitektura i tehničke odluke

- **Jedan izvor istine za korišćenje.** Jedan sync posao pretvara sirove `UsageStatsManager` događaje u sesije, deli ih po satima i čuva satne zbirove u Room bazi. Svaki ekran i servis za sprovođenje pravila čitaju iz tih tabela; ništa drugo ne upisuje podatke o korišćenju.
- **Jedan izvor istine za blokadu.** `RulesEngine` je čista Kotlin funkcija bez Android zavisnosti. Pravila koja korisnik menja u interfejsu su tačno ona koja foreground servis proverava.
- **Logika odvojena od platforme.** Rekonstrukcija sesija, podela po satima, pravila i interval režim su u paketima čistog Kotlina, pokrivenim sa 131 JUnit testom. Android klase su tanki adapteri oko njih.
- **Blokada.** Foreground servis proverava pravila i prikazuje ekran za blokadu preko celog ekrana kad se dostigne limit. `AccessibilityService` prepoznaje Shorts i Reels po ID-jevima pogleda plejera i njihovoj veličini na ekranu.

Ceo dizajn je opisan na stranici [Arhitektura](/sr/projects/focus-flow/architecture/).

## Izazovi i kako su rešeni

- **ANR greške.** Accessibility servis je rekurzivno prolazio kroz celu hijerarhiju pogleda na glavnoj niti. Skeniranje je prebačeno na serijski pozadinski dispečer, preskače se kad ga nijedno pravilo ne traži i ograničeno je na jednom u 750 ms.
- **Pogrešni brojevi za prethodne dane.** Sesije koje su prelazile granicu sinhronizacije gubile su početak, a cela sesija se računala u satu u kom je počela. Bezbedan sync kursor i podela po satima koja uzima u obzir pomeranje sata rešili su oba problema.
- **Ceo YouTube se računao kao Shorts.** Prepoznavanje je tražilo tekst „Shorts" u donjoj navigaciji. Sada traži ID-jeve pogleda plejera i zahteva da plejer pokriva bar 60% ekrana.

Svaka ispravka je navedena u [Dnevniku izmena](/sr/projects/focus-flow/changelog/).

## Privatnost

Sve ostaje na uređaju: nema naloga, analitike, reklama ni dozvole za internet. Detalji su u [Politici privatnosti](/sr/projects/focus-flow/privacy/).
