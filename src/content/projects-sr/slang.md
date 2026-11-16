---
title: Slang kompajler i VM
summary: Mali statički tipiziran jezik sa celim lancem obrade — ANTLR parser, AST, provera tipova, generator bajtkoda i virtuelna mašina zasnovana na steku.
team: Tim od 2
context: Predmet Programski prevodioci, RAF
gallery:
  - alt: Lanac obrade od izvornog fajla, preko ANTLR parsera, konverzije CST-a u AST, provere tipova i generatora koda, do virtuelne mašine zasnovane na steku
    caption: Svaka faza, od izvornog koda do virtuelne mašine.
---

## Problem i cilj

Osmisliti mali jezik i napisati sve što je potrebno da se pokrene, od gramatike do virtuelne mašine koja izvršava generisani bajtkod.

Jezik je statički tipiziran i ima cele brojeve, logičke vrednosti i nizove; dodelu, aritmetičke, relacione i logičke operatore sa skraćenim izračunavanjem; `if`/`else`, dve vrste petlji; i funkcije sa tipiziranim parametrima i povratnim tipom.

## Arhitektura i tehničke odluke

1. **Parsiranje** pomoću ANTLR gramatike.
2. **Pravljenje AST-a.** Konverter prolazi kroz ANTLR-ovo konkretno sintaksno stablo i pravi naš tipizirani AST, tako da kasnije faze ne zavise od generisanih klasa.
3. **Provera tipova** deklaracija, izraza i poziva funkcija pre nego što se išta pokrene.
4. **Generisanje koda** iz AST-a u bajtkod, jedan kontejner po funkciji.
5. **VM zasnovana na steku** koja izvršava bajtkod.

## Izazovi i kako su rešeni

- **Funkcije kao vrednosti.** Funkcije se stavljaju na stek kao i svaka druga vrednost i pozivaju se sa brojem argumenata, pa VM-u ne treba poseban slučaj za pozive.
- **Promenljive iz spoljnih opsega.** Generator koda beleži da li je svaka uhvaćena promenljiva lokalna ili upvalue spoljne funkcije, a VM razrešava upvalue vrednosti tokom izvršavanja.
- **Skraćeno izračunavanje.** `||` i `&&` moraju da preskoče desnu stranu kad leva već odlučuje rezultat, što generisani bajtkod rešava uslovnim skokovima.
