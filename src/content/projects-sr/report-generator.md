---
title: Generator izveštaja
summary: Modularna Kotlin biblioteka i CLI koji od upita nad bazom, CSV fajlova ili podataka iz memorije prave TXT, HTML, PDF ili Markdown izveštaje, sa formatima učitanim kao pluginovi.
context: Predmet Softverske komponente, RAF
gallery:
  - alt: CLI i izvori podataka šalju podatke API-ju za izveštaje, koji preko SPI-ja učitava TXT, HTML i PDF, i Markdown implementacije
    caption: Izlazni formati su posebni moduli koji se pronalaze tokom izvršavanja.
---

## Problem i cilj

Praviti strukturirane izveštaje od bilo kakvih tabelarnih podataka, u više formata, a da osnovna biblioteka ne zna ni za jedan konkretan format.

## Arhitektura i tehničke odluke

- **Plugin arhitektura.** API za izveštaje definiše ugovor; svaki izlazni format je poseban Gradle modul koji se pronalazi tokom izvršavanja preko Javinog Service Provider Interface-a.
- **Formati.** Običan tekst sa kolonama fiksne širine, HTML i PDF sa stilovima, i Markdown.
- **Izvori podataka.** SQL upiti nad bazom, CSV fajlovi i liste i mape iz memorije.

## Izazovi i kako su rešeni

- **Proračuni zajednički za sve formate.** Posebna komponenta računa SUM, AVG, COUNT, MIN i MAX, kolone izvedene aritmetikom nad drugim kolonama i uslovne zbirove, pa nijedan format to ne implementira iznova.
- **Korišćenje bez pisanja koda.** CLI prikazuje dostupne pluginove za formate, povezuje se na bazu ili čita CSV i pravi izveštaj na osnovu opcija iz komandne linije.
