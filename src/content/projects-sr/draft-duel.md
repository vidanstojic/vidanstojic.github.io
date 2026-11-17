---
summary: Trominutna 1v1 mobilna igra u kojoj dva igrača sa istim budžetom licitiraju za sportiste da bi sastavili jaču početnu petorku.
team: Samostalno
context: Lični projekat, u fazi dizajna
gallery:
  - alt: Početni ekran sa zelenim stolom za karte i četiri moda - protivnik, bot, isti telefon i prijatelj
    caption: Početni ekran. Svaki mod je brzi 1v1 duel.
  - alt: Ekran nove partije sa temama filmovi i hrana, unapred zadatim pravilima i kartama po ligama
    caption: Četiri teme, svaka sa svojom podlogom i paketom karata.
  - alt: Sopstvena pravila - poeni po igraču, broj karata, jednak broj karata, cena predaje i vreme poteza
    caption: Sopstvena pravila. Botovi su podešeni za Default i Classic.
  - alt: Izbor karata po kategoriji - Engleska, Francuska, Nemačka, Italija i Španija sa po 30 karata
    caption: Fudbalske karte dolaze iz pet liga, po 30 igrača.
  - alt: Mašina stanja meča sa stanjima čekanje, izvlačenje, licitiranje, biranje, dodeljeno, bodovanje, završeno, pauzirano i napušteno
    caption: Mašina stanja meča iz specifikacije.
---

## Problem i cilj

Dva igrača dele skup od deset karata sa sportistima i imaju po 20 poena budžeta. Karte se otkrivaju jedna po jedna, a igrači naizmenično podižu ponudu ili odustaju; pobeđuje onaj sa većom ukupnom ocenom tima. Meč treba da traje tri do pet minuta, protiv prijatelja preko linka ili oflajn protiv bota.

## Arhitektura i tehničke odluke

- **Jedan modul pravila, tri korisnika.** Pravila igre su u čistom Kotlin `commonMain` modulu, bez I/O operacija i sa mešanjem zasnovanim na seed-u. Android klijent, server i simulator bot protiv bota pokreću isti kod.
- **Autoritativni server.** Onlajn mečevi rade na Ktor WebSocket serveru. Klijenti šalju samo namere (podigni, odustani, rasporedi); server proverava potez, rundu i budžet.
- **Eksplicitna mašina stanja.** Meč prolazi kroz izvlačenje, licitiranje, biranje, dodelu, bodovanje i kraj, uz pauzu i napuštanje za prekinute veze.
- **Tajan je samo redosled.** Ocene i ponude su namerno javne. Server meša karte i nikad ne šalje klijentu karte koje tek dolaze.

## Izazovi i kako su rešeni

- **Duplirane i zakasnele poruke.** Svaka akcija nosi ID runde i broj poteza; sve što ne pripada trenutnom potezu dobija `STALE` i ništa ne menja.
- **Fer balans.** 10.000 mečeva bot protiv bota proveriće da prvi igrač pobeđuje u 45–55% slučajeva i da je budžet dobro odmeren. Testovi zasnovani na svojstvima proveravaju invarijante kao što je „budžet nikad ne ide u minus".
- **Granični slučajevi u pravilima.** Igrač bez budžeta ili sa punim timom prati eksplicitna pravila zapisana kao tabela primera, koji postaju unit testovi.

Specifikacija i dizajn interfejsa su gotovi; sledeći korak je implementacija.

## Privatnost

Aplikacija nema nalog, analitiku, reklame ni dozvolu za internet. Podešavanja i spisak već odigranih karata ostaju na telefonu. Detalji su u [Politici privatnosti](/sr/privacy/draft-duel/).
