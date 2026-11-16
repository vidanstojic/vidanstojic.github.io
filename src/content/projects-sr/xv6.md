---
title: Proširenja xv6 kernela
summary: Tri proširenja xv6 kernela za nastavu, u C-u — istorija komandi u drajveru konzole, simbolički linkovi u fajl sistemu i imenovana deljena memorija između procesa.
context: Predmet Operativni sistemi, RAF
repoLabels: [Istorija komandi, Simbolički linkovi, Deljena memorija]
gallery:
  - alt: Dva procesa čije tabele stranica mapiraju istu fizičku stranicu, pronađenu preko registra imenovane deljene memorije
    caption: Imenovana deljena memorija. Fizička stranica se oslobađa kad je zatvori poslednji proces.
---

## Problem i cilj

Tri zadatka, svaki je izmena koja prolazi kroz xv6 kernel i njegov korisnički prostor: bolji unos u shell-u, bogatiji fajl sistem i način da procesi dele memoriju.

## Arhitektura i tehničke odluke

### Istorija komandi u shell-u

- Istorija komandi čuva se u kružnom baferu fiksne veličine, u putanji ulaza konzole.
- Kroz istoriju se kreće prečicama na tastaturi, a ono što je korisnik već otkucao se čuva.
- Vraćeni i novi tekst prikazuju se različitim bojama pomoću ANSI sekvenci.

### Simbolički linkovi i zauzeće diska

- Novi tip inode-a i sistemski poziv `symlink`.
- `stat` je proširen brojem fizičkih blokova, uz alate u korisničkom prostoru za pregled linkova i rekurzivni `du`.

### Deljena memorija

- Registar objekata deljene memorije u kernelu, identifikovanih imenom, tako da nepovezani procesi mogu da pronađu isti objekat pomoću `shm_open`.
- `shm_trunc` postavlja veličinu, `shm_map` mapira iste fizičke stranice u tabelu stranica svakog procesa sa dozvolom za čitanje ili pisanje, a `shm_close` ga oslobađa.

## Izazovi i kako su rešeni

- **Izmena vraćenih komandi.** Prebacivanje između istorije i trenutnog unosa ne sme da izgubi ono što je korisnik otkucao. Aktivni ulazni bafer se čuva pre kretanja kroz istoriju i vraća kad se korisnik vrati na njega.
- **Ciklusi linkova.** Link koji pokazuje na samog sebe beskonačno bi se vrteo tokom razrešavanja putanje. Razrešavanje prati linkove do ograničene dubine, a flag `O_NOFOLLOW` otvara link bez praćenja.
- **Bezbedno oslobađanje deljenih stranica.** Za fizičke stranice se broje reference i oslobađaju se tek kad poslednji proces zatvori svoj deskriptor.
