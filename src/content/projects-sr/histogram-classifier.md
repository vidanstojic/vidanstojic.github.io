---
title: Klasifikator po histogramu boja
summary: Klasifikator slika zasnovan na 3D histogramima boja i kosinusnoj sličnosti, napisan u strogo funkcionalnom stilu, bez petlji.
team: Tim od 2
context: Predmet Paralelni algoritmi, RAF
gallery:
  - alt: "Tok klasifikatora: CIFAR-10 slike postaju RGB histogrami koji se usrednjavaju u profile klasa, a nova slika se poredi kosinusnom sličnošću"
    caption: "Učenje pravi po jedan profil za svaku klasu, a klasifikacija bira najsličniji profil."
---

## Problem i cilj

Predvideti kategoriju slike samo na osnovu njenih boja, i to u strogo funkcionalnom stilu.

## Arhitektura i tehničke odluke

- Pravi RGB histograme sa podesivim brojem korpi i usrednjava ih u profil za svaku klasu.
- Nepoznatu sliku klasifikuje po kosinusnoj sličnosti između njenog histograma i profila svake klase.

## Izazovi i kako su rešeni

- **Petlje nisu dozvoljene.** Sve je napisano pomoću `map`, `filter`, `reduce`, lambdi i iteratora: bez eksplicitnih petlji i bez comprehension izraza, čak i za pomoćne funkcije kao što je dužina.
- **Memorija kod velikih skupova slika.** Lenji iteratori obrađuju slike jednu po jednu umesto da ih sve učitaju odjednom.
