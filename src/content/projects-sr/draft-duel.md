---
summary: "Brza 1v1 aukcija karata za Android. Dva igrača sa po 20 poena licitiraju za deset karata, a pobeđuje jači tim. Četiri teme: fudbal, košarka, filmovi i hrana."
team: Samostalno
context: Lični projekat, u zatvorenom testiranju na Google Play-u
gallery:
  - alt: Početni ekran sa zelenim stolom za karte i četiri moda - protivnik, bot, isti telefon i prijatelj
    caption: Početni ekran. Svaki mod je brzi 1v1 duel.
  - alt: Ekran nove partije sa temama filmovi i hrana, unapred zadatim pravilima i kartama po ligama
    caption: Četiri teme, svaka sa svojom podlogom i paketom karata.
  - alt: Sopstvena pravila - poeni po igraču, broj karata, jednak broj karata, cena predaje i vreme poteza
    caption: Sopstvena pravila. Botovi su podešeni za Default i Classic.
  - alt: Izbor karata po kategoriji - Engleska, Francuska, Nemačka, Italija i Španija sa po 30 karata
    caption: Fudbalske karte dolaze iz pet liga, po 30 igrača.
  - alt: Stanja mehanizma partije - izvlačenje karte, licitiranje, biranje, dodeljeno, odbačeno i završeno
    caption: Mehanizam partije, karta po karta. Svaka strelica je čist prelaz stanja.
---

## Problem i cilj

Dva igrača dele deset karata i imaju po 20 poena. Karte se otkrivaju jedna po jedna: otvarač nudi, protivnik podiže ili odustaje, a ko uzme kartu plaća svoju ponudu. Ocene ostaju skrivene dok kartu ne osvojite, pa se licitira na osnovu onoga što znate o igraču, filmu ili jelu. Partija traje tri do pet minuta, protiv jednog od šest botova ili sa prijateljem na istom telefonu.

## Arhitektura i tehničke odluke

- **Jedan kod za Android i iOS.** Kotlin Multiplatform sa Compose Multiplatform-om; svi ekrani su u zajedničkom kodu. Zvuk, vibracija i čuvanje podataka su iza `expect`/`actual` platformskih servisa.
- **Pravila kao čist reducer.** `MatchEngine.reduce(state, action)` vraća sledeće stanje bez I/O operacija i bez sata. Interfejs, botovi i testovi pozivaju istu funkciju; poseban drajver vodi tajmer poteza i pauze.
- **Šest botova sa ličnostima.** Svaki procenjuje kartu na osnovu statistike paketa i budžeta po praznom mestu. Najjači gleda unapred preko očekivanog zbira najboljih *k* od preostalih *n* karata (statistike poretka), keširano po paketu i pravilima i računato van UI niti.
- **Paketi karata kao podaci.** Python skripte prave JSON pakete iz tabela ocena: 150 fudbalera iz pet liga, 250 košarkaša iz NBA lige i Evrolige, 150 filmova i 20 jela. Validator proverava svaki paket.
- **Rezultat koji liči na sport.** Zbir ocena određuje pobednika; `ScoreProjection` pretvara razliku po karti u fudbalski ili košarkaški rezultat, sa seed-om, pa ista partija uvek daje isti rezultat.

## Izazovi i kako su rešeni

- **Zvezde su vredele premalo.** Bez ograničenja broja karata, jeftine karte su pobeđivale zvezde. Podrazumevana pravila daju svakom igraču tačno pet mesta, pa svaka kupljena karta zauzima mesto boljoj. Plaćena predaja (1, pa 2, pa 3 poena) omogućava otvaraču da izbegne kartu koju ne želi.
- **Balans.** Po 1.000 partija bot protiv bota za svaki par određuje težinu svakog bota i proverava da prvi otvarač pobeđuje u oko 48% partija.
- **Karte su se ponavljale između partija.** „Shuffle bag" po temi, sačuvan i posle restarta, vraća kartu tek kad se odigra ostatak paketa.
- **Hrana se ne uklapa u ocene.** Recept mod boduje sastojke: pravi daju zbirno 100, a pogrešni oduzimaju poene. Otvarač sme da preskoči kartu, inače bi svaki pogrešan sastojak pao njemu.

## Šta sledi

Partije protiv pravih igrača preko interneta zahtevaju server. Za sada online modovi spajaju igrača sa botom, kako bi se ostatak aplikacije prvo istestirao.

## Privatnost

Aplikacija nema nalog, analitiku, reklame ni dozvolu za internet. Podešavanja i spisak već odigranih karata ostaju na telefonu. Detalji su u [Politici privatnosti](/sr/privacy/draft-duel/).
