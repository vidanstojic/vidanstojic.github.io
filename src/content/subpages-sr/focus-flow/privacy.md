---
title: Politika privatnosti aplikacije Focus Flow
tab: Politika privatnosti
summary: Čemu Android aplikacija Focus Flow (rs.vidanstojic.focusflow) pristupa, zašto, i šta se dešava sa tim podacima. Važi od 15. novembra 2026.
---

_Ovo je prevod. Ako se verzije razlikuju, merodavna je [verzija na engleskom](/projects/focus-flow/privacy/)._

Focus Flow („aplikacija", paket `rs.vidanstojic.focusflow`) je Android aplikacija za praćenje vremena na ekranu i digitalno blagostanje, koju je razvio Vidan Stojić. Aplikacija radi u potpunosti na vašem uređaju. Ova politika objašnjava čemu aplikacija pristupa, zašto, i šta se dešava sa tim podacima.

_Važi od: 15. novembra 2026._

## Ukratko

- Aplikacija **ne** prikuplja, ne šalje, ne prodaje i ne deli nikakve lične podatke.
- Aplikacija nema nalog, analitiku ni reklame i ne traži pristup internetu.
- Svi podaci ostaju na vašem uređaju i brišu se kad obrišete podatke aplikacije ili je deinstalirate.

## Podaci kojima aplikacija pristupa i koje čuva na uređaju

| Podatak | Izvor | Svrha |
| --- | --- | --- |
| Vreme korišćenja aplikacija (koja aplikacija je bila u prvom planu i koliko dugo) | Android pristup korišćenju (`PACKAGE_USAGE_STATS`) | Statistika vremena na ekranu, dnevni limiti, ograničenja sesija, rasporedi |
| Lista instaliranih aplikacija sa ikonicom u launcher-u (ime, ikonica) | Android package manager | Izbor aplikacija na koje se pravila odnose |
| Vaša pravila, limiti, rasporedi i alarmi | Unosite ih vi | Sprovođenje limita koje ste postavili |
| Ukupno vreme gledanja Shorts/Reels snimaka | Računa aplikacija | Limiti za Shorts/Reels |
| Broj koraka tokom misije „koraci" za alarm | Senzor koraka (`ACTIVITY_RECOGNITION`) | Gašenje alarma tek posle stvarnih koraka |
| Vreme paljenja i gašenja ekrana | Android sistemski događaji | Prepoznavanje buđenja za jutarnju blokadu |

Ovi podaci se čuvaju samo u privatnom skladištu aplikacije na vašem uređaju. Izuzeti su iz cloud rezervne kopije i prenosa sa uređaja na uređaj.

## Servis pristupačnosti

Focus Flow sadrži opcioni servis pristupačnosti (Accessibility service). Koristi se za sprovođenje limita koje sami postavite, a ne kao pomoćni alat. Pre nego što ga uključite, aplikacija prikazuje šta servis radi i traži vašu saglasnost.

- **YouTube i Instagram:** servis čita raspored elemenata na ekranu (ID-jeve i oznake elemenata) da bi prepoznao kad je otvoren Shorts ili Reels plejer, i izlazi iz njega ili prikazuje ekran za blokadu kad dostignete limit.
- **Prepoznavanje otvaranja ograničene aplikacije:** servis beleži kad je prozor YouTube-a ili Instagrama na ekranu, tako da se limit koji ste postavili primenjuje odmah, i kad se aplikacija otvori preko linka ili ponovo otvori iz nedavnih aplikacija.
- **Veb pregledači:** samo dok je aktivan jutarnji detoks sa blokiranim sajtovima, servis čita adresnu traku pregledača da proveri da li je otvoren blokiran sajt.
- **Akcije koje izvršava:** vraćanje nazad, odlazak na početni ekran („Idi na početni ekran" na ekranu za blokadu) i ponovno pokretanje praćenja u Focus Flow-u ako ga je sistem zaustavio.

Sadržaj ekrana proverava se u memoriji, u trenutku kad se pojavi, i nikad se ne čuva, ne beleži i ne šalje nigde. Servis možete isključiti u bilo kom trenutku u Android Podešavanjima › Pristupačnost.

## Ostale dozvole

- **Prikaz preko drugih aplikacija**: za prikaz ekrana za blokadu preko ograničene aplikacije.
- **Alarmi i podsetnici / precizni alarmi**: za alarme, rasporede i tajmere pauze, i za ponovno pokretanje praćenja ako ga sistem zaustavi.
- **Obaveštenja**: za alarme i obaveštenje o statusu praćenja.
- **Pokretanje pri paljenju**: za vraćanje alarma i praćenja posle restarta.
- **Zatvaranje drugih aplikacija** (`KILL_BACKGROUND_PROCESSES`): kad dodirnete „Idi na početni ekran" na ekranu za blokadu, blokirana aplikacija se zatvara da ne bi mogla ponovo da se otvori preko limita. Odnosi se samo na aplikaciju koja vam je blokirana, i to tek kad je u pozadini.

## Bezbednost podataka

Svi podaci se čuvaju u privatnom skladištu aplikacije, koje druge aplikacije ne mogu da čitaju. Aplikacija nema dozvolu za internet, pa preko nje nijedan podatak ne može da napusti uređaj.

## Čuvanje i brisanje podataka

- Detaljne sesije korišćenja čuvaju se 12 dana. Satni zbirovi korišćenja čuvaju se oko 400 dana, da biste mogli da vidite nedeljnu i mesečnu statistiku. Stariji zapisi se automatski uklanjaju.
- Sve podatke možete obrisati u bilo kom trenutku u Android Podešavanjima › Aplikacije › Focus Flow › Memorija › Obriši podatke, ili deinstaliranjem aplikacije.
- Programer nema kopiju vaših podataka i ne može da im pristupi niti da ih obriše na daljinu.

## Deljenje podataka

Focus Flow ne deli nikakve podatke sa trećim stranama i ne šalje podatke sa uređaja.

## Deca

Aplikacija nije namenjena deci mlađoj od 13 godina i svesno ne prikuplja podatke od njih.

## Izmene

Ako se ova politika promeni, nova verzija biće objavljena na ovoj adresi sa novim datumom važenja.

## Kontakt

Pitanja o ovoj politici: **vidan.stojic+focusflow@gmail.com**
