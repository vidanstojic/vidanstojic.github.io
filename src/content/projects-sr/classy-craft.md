---
summary: Java desktop editor za UML dijagrame klasa i mape uma, zasnovan na MVC-u i klasičnim projektnim obrascima.
team: Tim od 2
context: Predmet Dizajn softvera, RAF
gallery:
  - alt: "Dijagram klasa Classy Craft-a sa Composite stablom modela, State obrascem za alate na platnu i Command obrascem za poništavanje i ponavljanje"
    caption: "Osnovne klase: Composite za stablo projekta, State za alate na platnu, Command za undo i redo."
---

## Problem i cilj

Desktop editor za UML dijagrame klasa i mape uma, gde je glavni zahtev bio da se projektni obrasci primene kako treba, a ne samo da program radi.

## Arhitektura i tehničke odluke

- **MVC** odvaja model dijagrama od prikaza i kontrolera.
- **Command** za undo i redo, **State** za selektovanje, crtanje i pomeranje, **Composite** za ugnežđene elemente, **Observer** za usklađivanje prikaza, **Factory Method** za elemente dijagrama i **Singleton** za stanje aplikacije.

## Izazovi i kako su rešeni

- **Undo i redo za svaku akciju.** Svaka izmena je command objekat koji zna kako da se poništi.
- **Mnogo režima rada na jednom platnu.** Svaki režim je state objekat, pa dodavanje novog alata ne dira ostale.
- **Čuvanje rada.** Dijagrami se uvoze i izvoze kao UML fajlovi ili slike, a više dijagrama može se grupisati u jedan projekat.
