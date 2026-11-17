---
summary: Android aplikacija za pregled rasa mačaka, sa pretragom, detaljima rase i galerijom fotografija, zasnovana na MVI arhitekturi.
context: Predmet Razvoj mobilnih aplikacija, RAF
gallery:
  - alt: "Tok podataka u CatApp-u od Compose ekrana, preko ViewModel-a i repozitorijuma, do Room baze, TheCatAPI servisa i DataStore-a"
    caption: "Jednosmerni tok podataka. Interfejs čita samo iz Room baze, a mreža je popunjava jednom, pri prvom pokretanju."
---

## Problem i cilj

Moderna Android aplikacija po aktuelnim standardima: katalog rasa mačaka sa pretragom, detaljima i fotografijama, uz lokalni korisnički profil koji se pravi pri prvom pokretanju.

## Arhitektura i tehničke odluke

- **Model-View-Intent** za predvidljivo stanje sa jednosmernim tokom.
- **Room** za keširane podatke o rasama i **DataStore** za lokalni korisnički profil.
- **Hilt** za dependency injection i **Coroutines** za rad u pozadini.

## Izazovi i kako su rešeni

- **Mnogo slika.** Liste rasa prikazuju pregled, a svaka rasa ima sopstvenu galeriju fotografija sa posebnim prikazom preko celog ekrana.
- **Uvodni korak bez backenda.** Nalog se pravi lokalno pri prvom pokretanju i kasnije se može izmeniti na ekranu profila.
