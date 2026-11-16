/**
 * Two languages: English (default, at /) and Serbian (Latin script, at /sr/).
 * Interface text lives here; project texts live in src/content/projects-sr and
 * src/content/subpages-sr, and fall back to English when a translation is missing.
 */
import { SITE } from '../site';

export const LANGS = ['en', 'sr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

export const LANG_NAME: Record<Lang, string> = { en: 'English', sr: 'Srpski' };
export const HTML_LANG: Record<Lang, string> = { en: 'en', sr: 'sr-Latn' };
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', sr: 'sr_RS' };

export function langFromPath(path: string): Lang {
  return path === '/sr' || path.startsWith('/sr/') ? 'sr' : 'en';
}

/** Path without the language prefix: /sr/about/ -> /about/ */
export function stripLang(path: string): string {
  if (path === '/sr' || path === '/sr/') return '/';
  return path.startsWith('/sr/') ? path.slice(3) : path;
}

/** Site path for a language: ('/about/', 'sr') -> /sr/about/ */
export function localize(path: string, lang: Lang): string {
  const clean = stripLang(path);
  if (lang === DEFAULT_LANG) return clean;
  return clean === '/' ? '/sr/' : `/sr${clean}`;
}

const en = {
  role: 'Software engineer',
  location: 'Belgrade, Serbia',
  availability: 'Open to graduate and junior roles, and to interesting projects',
  openRoles: 'Open to graduate and junior roles',
  siteTitle: `${SITE.name} — I build software from the kernel to the screen`,
  siteDescription:
    'Software engineering student in Belgrade, one exam away from graduating. Android apps, backend services, compilers and OS kernels.',

  nav: { work: 'Work', about: 'About', contact: 'Contact', home: 'Home', projects: 'Projects' },
  homeLabel: `${SITE.name}, home`,
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  mainNav: 'Main',
  mobileNav: 'Mobile',
  langSwitch: 'Srpski',
  langSwitchShort: 'SR',
  langSwitchLabel: 'Ova stranica na srpskom',

  layers: {
    interface: { name: 'Interface', blurb: 'Apps people touch' },
    services: { name: 'Services', blurb: 'Servers, APIs, real-time' },
    data: { name: 'Data', blurb: 'Processing, storage, reports' },
    language: { name: 'Language', blurb: 'Parsing and interpreting code' },
    kernel: { name: 'Kernel', blurb: 'Inside the operating system' },
  },
  status: {
    complete: 'Completed',
    'in-progress': 'In progress',
    'preparing-release': 'Preparing for Google Play',
  },

  card: { readCase: 'Read the case study', technologies: 'Technologies' },
  bands: { label: 'Projects by layer, from interface down to kernel', inProgress: 'in progress' },

  home: {
    headline: 'I build software from the kernel to the screen.',
    intro:
      "I'm Vidan, a software engineering student at the School of Computing (RAF) in Belgrade, one exam away from graduating. Most of my work is Android apps and backend services, and I've also written a compiler and changed an operating system kernel to understand what sits underneath them.",
    introLabel: 'Introduction',
    cta: 'Read the work',
    workTitle: 'Work, layer by layer',
    workText: 'Every project sits on the layer of the stack it lives in, from the apps people touch down to the kernel.',
    selected: 'Selected projects',
    all: (n: number) => `All ${n} projects`,
    ctaTitle: 'Building something where the details matter?',
    ctaText: "I'd like to hear about it. Tell me about the role or the project, and I'll get back to you.",
    getInTouch: 'Get in touch',
    moreAbout: 'More about me',
  },

  projects: {
    title: `Work — ${SITE.name}`,
    description: 'Every project, grouped by the layer of the stack it lives in.',
    count: (n: number) => `${n} projects`,
    heading: 'Work, layer by layer',
    text: 'From Android apps down to an operating system kernel. Each project has its own page with the problem, the architecture and what was hard about it.',
    jump: 'Jump to layer',
  },

  project: {
    allProjects: 'All projects',
    layer: (name: string) => `${name} layer`,
    source: 'Source on GitHub',
    play: 'Google Play',
    demo: 'Live demo',
    pages: (title: string) => `${title} pages`,
    overview: 'Overview',
    facts: { layer: 'Layer', context: 'Context', team: 'Team', status: 'Status' },
    next: 'Next project',
    diagrams: 'Diagrams',
    gallery: 'Gallery',
    enlargeHint: 'Select an image to enlarge it.',
    enlarge: (alt: string) => `Enlarge: ${alt}`,
    viewer: 'Image viewer',
    prev: 'Previous image',
    nextImage: 'Next image',
    close: 'Close',
    untranslated: '',
  },

  about: {
    title: `About — ${SITE.name}`,
    description: "Who I am, how I work, and what I've built so far.",
    portrait: `Portrait of ${SITE.name}`,
    hi: "Hi, I'm Vidan.",
    lead: 'A software engineering student at the School of Computing (RAF) in Belgrade, one exam away from graduating. I build Android apps and backend services, and I like knowing what happens beneath them.',
    storyTitle: 'My story',
    story: [
      "At RAF I've worked across the whole stack. Changing the xv6 kernel to share memory between processes, adding symbolic links to its file system and writing a compiler with its own virtual machine showed me how much happens under a single line of application code.",
      "Today most of my work is higher up the stack. Focus Flow, my screen-time app for Android, reconstructs app sessions from raw system events and enforces limits with a rules engine written in plain Kotlin. On the backend I've built a cloud-platform simulation with Spring Boot and its own security layer, and worked in a team on a microservice backend for a banking system.",
      'I also tutor C, C++, Java and C#. Explaining a pointer or a race condition to someone else is still the best test of whether I understand it myself.',
      'Outside of code I follow the banking and finance sector, and I train boxing and table tennis.',
    ],
    principlesTitle: 'How I think about problems',
    principles: [
      {
        title: 'Plain core, frameworks at the edges',
        text: 'Business rules live in plain code with no Android, Spring or UI types. Framework classes are thin adapters, so the core is tested with fast unit tests and no emulator.',
      },
      {
        title: 'Know what runs underneath',
        text: "I've changed a kernel's page tables and written a bytecode VM. When an app is slow or a number is wrong, I want to know which layer is responsible.",
      },
      {
        title: 'One source of truth',
        text: 'One writer for usage data in Focus Flow, one authoritative server in Draft Duel. Several Focus Flow bugs came from two places writing the same data.',
      },
      {
        title: 'Explain it simply',
        text: 'Tutoring taught me that if I cannot explain why code works, I do not understand it yet. I write docs and commit messages for the next reader.',
      },
    ],
    pathTitle: 'Path so far',
    pathText: 'Education, teaching and the projects that shaped how I work.',
    timeline: [
      { when: 'Now', kind: 'Education', title: 'One exam to go, School of Computing (RAF)', text: 'Software engineering. Every other exam is passed; one left before graduating.', now: true },
      { when: 'Oct 2026', kind: 'Project', title: 'Draft Duel specification', text: 'Rules, architecture, protocol and MVP plan for a 1v1 auction game.' },
      { when: '2026', kind: 'Project', title: 'Focus Flow', text: 'Screen-time and focus app for Android, preparing for Google Play.' },
      { when: '2024/25', kind: 'Course project', title: 'Report generator', text: 'Plugin-based reporting library and CLI, Software Components course.' },
      { when: 'Ongoing', kind: 'Teaching', title: 'Private tutor', text: 'Private lessons in C, C++, Java and C#.' },
    ],
    stackTitle: 'Tech stack and tools',
    stackText: 'What I reach for, grouped by where it runs.',
    groups: { Android: 'Android', Backend: 'Backend', Systems: 'Systems', Languages: 'Languages' },
    ctaTitle: 'Want to work together?',
    ctaText: 'The fastest way to reach me is the contact page.',
    contactMe: 'Contact me',
    seeWork: 'See the work',
    downloadCv: 'Download CV',
  },

  contact: {
    title: `Contact — ${SITE.name}`,
    description: 'Get in touch about a role, a project or private lessons.',
    heading: "Let's talk.",
    lead: "A role, a project or private lessons: write a few lines and I'll reply by email.",
    name: 'Name',
    email: 'Email',
    topic: 'Topic',
    chooseTopic: 'Choose a topic',
    // Values stay in English so the email subjects are the same in both languages.
    topics: [
      { value: 'Job offer', label: 'Job offer' },
      { value: 'Collaboration', label: 'Collaboration' },
      { value: 'Private lessons', label: 'Private lessons' },
      { value: 'Other', label: 'Other' },
    ],
    message: 'Message',
    send: 'Send message',
    replyNote: 'Replies go to the email you enter above.',
    privacyBefore: 'Your name, email and message are sent through',
    privacyAfter: 'to my inbox and are only used to reply to you. Nothing is stored on this site.',
    sentTitle: 'Message sent.',
    sentText: "Thanks for writing. I'll reply to the address you gave.",
    again: 'Send another message',
    copyEmail: 'Copy email',
    openProfile: 'Open profile',
    browseCode: 'Browse code',
    cvTitle: 'PDF, A4',
    cvAction: 'Download or build your own',
  },

  footer: { contact: 'Contact' },

  cv: {
    heading: 'Download my CV',
    buildHeading: 'Build your CV',
    back: 'Back',
    close: 'Close',
    lead: 'Take the standard version, or build one with only the projects that matter for your role.',
    standard: 'Standard',
    myCv: 'My CV',
    myCvText: 'One A4 page with six course projects across the stack.',
    downloadPdf: 'Download PDF',
    custom: 'Custom',
    build: 'Build your own',
    buildText: 'Pick projects by name, layer, technology or course. Same layout, made in your browser.',
    choose: 'Choose projects',
    search: 'Search by name, layer, technology or course',
    allLayers: 'All layers',
    layerGroup: 'Layer',
    techGroup: 'Technology',
    more: (n: number) => `+${n} more`,
    fewer: 'Show fewer',
    empty: 'No project matches. Try another word or clear the filters.',
    none: 'Pick at least one project',
    count: (n: number) => `${n} project${n === 1 ? '' : 's'} · in the order you picked them`,
    usePicks: 'Use my picks',
    clear: 'Clear',
    building: 'Building PDF',
    done: 'Downloaded',
    failed: 'Reload and try again',
    note: '',
  },

  notFound: {
    title: `Page not found — ${SITE.name}`,
    heading: "This page doesn't exist.",
    text: 'The link may be old or mistyped.',
    back: 'Back to all projects',
  },
};

type Dict = typeof en;

const sr: Dict = {
  role: 'Softverski inženjer',
  location: 'Beograd, Srbija',
  availability: 'Otvoren za početničke i junior pozicije, i za zanimljive projekte',
  openRoles: 'Otvoren za početničke i junior pozicije',
  siteTitle: `${SITE.name} — Pravim softver od kernela do ekrana`,
  siteDescription:
    'Student softverskog inženjerstva u Beogradu, jedan ispit do diplome. Android aplikacije, backend servisi, kompajleri i kernel operativnog sistema.',

  nav: { work: 'Radovi', about: 'O meni', contact: 'Kontakt', home: 'Početna', projects: 'Projekti' },
  homeLabel: `${SITE.name}, početna`,
  menuOpen: 'Otvori meni',
  menuClose: 'Zatvori meni',
  mainNav: 'Glavni meni',
  mobileNav: 'Meni',
  langSwitch: 'English',
  langSwitchShort: 'EN',
  langSwitchLabel: 'This page in English',

  layers: {
    interface: { name: 'Interfejs', blurb: 'Aplikacije koje ljudi koriste' },
    services: { name: 'Servisi', blurb: 'Serveri, API-ji, rad u realnom vremenu' },
    data: { name: 'Podaci', blurb: 'Obrada, skladištenje, izveštaji' },
    language: { name: 'Jezik', blurb: 'Parsiranje i izvršavanje koda' },
    kernel: { name: 'Kernel', blurb: 'Unutar operativnog sistema' },
  },
  status: {
    complete: 'Završeno',
    'in-progress': 'U toku',
    'preparing-release': 'Priprema za Google Play',
  },

  card: { readCase: 'Pročitaj studiju slučaja', technologies: 'Tehnologije' },
  bands: { label: 'Projekti po slojevima, od interfejsa do kernela', inProgress: 'u toku' },

  home: {
    headline: 'Pravim softver od kernela do ekrana.',
    intro:
      'Ja sam Vidan, student softverskog inženjerstva na Računarskom fakultetu (RAF) u Beogradu i ostao mi je još jedan ispit do diplome. Najviše radim Android aplikacije i backend servise, a napisao sam i kompajler i menjao kernel operativnog sistema da bih razumeo šta se nalazi ispod njih.',
    introLabel: 'Uvod',
    cta: 'Pogledaj radove',
    workTitle: 'Radovi, sloj po sloj',
    workText: 'Svaki projekat stoji na sloju na kom zaista radi, od aplikacija koje ljudi koriste do kernela.',
    selected: 'Izdvojeni projekti',
    all: (n: number) => `Svih ${n} projekata`,
    ctaTitle: 'Radite na nečemu gde su detalji važni?',
    ctaText: 'Voleo bih da čujem više. Napišite mi nešto o poziciji ili projektu i javiću vam se.',
    getInTouch: 'Javite se',
    moreAbout: 'Više o meni',
  },

  projects: {
    title: `Radovi — ${SITE.name}`,
    description: 'Svi projekti, grupisani po sloju na kom rade.',
    count: (n: number) => `${n} projekata`,
    heading: 'Radovi, sloj po sloj',
    text: 'Od Android aplikacija do kernela operativnog sistema. Svaki projekat ima svoju stranicu sa problemom, arhitekturom i onim što je bilo teško.',
    jump: 'Idi na sloj',
  },

  project: {
    allProjects: 'Svi projekti',
    layer: (name: string) => `Sloj: ${name}`,
    source: 'Kod na GitHubu',
    play: 'Google Play',
    demo: 'Demo uživo',
    pages: (title: string) => `${title}: stranice`,
    overview: 'Pregled',
    facts: { layer: 'Sloj', context: 'Kontekst', team: 'Tim', status: 'Status' },
    next: 'Sledeći projekat',
    diagrams: 'Dijagrami',
    gallery: 'Galerija',
    enlargeHint: 'Izaberite sliku da biste je uvećali.',
    enlarge: (alt: string) => `Uvećaj: ${alt}`,
    viewer: 'Pregled slika',
    prev: 'Prethodna slika',
    nextImage: 'Sledeća slika',
    close: 'Zatvori',
    untranslated: 'Ova stranica još nije prevedena, pa je prikazana na engleskom.',
  },

  about: {
    title: `O meni — ${SITE.name}`,
    description: 'Ko sam, kako radim i šta sam do sada napravio.',
    portrait: `Portret: ${SITE.name}`,
    hi: 'Zdravo, ja sam Vidan.',
    lead: 'Student softverskog inženjerstva na Računarskom fakultetu (RAF) u Beogradu, sa još jednim ispitom do diplome. Pravim Android aplikacije i backend servise i volim da znam šta se dešava ispod njih.',
    storyTitle: 'Moja priča',
    story: [
      'Na RAF-u sam radio na celom steku. Menjanje xv6 kernela da procesi dele memoriju, dodavanje simboličkih linkova u njegov fajl sistem i pisanje kompajlera sa sopstvenom virtuelnom mašinom pokazali su mi koliko toga se dešava ispod jedne linije aplikativnog koda.',
      'Danas najviše radim na višim slojevima. Focus Flow, moja Android aplikacija za praćenje vremena na ekranu, rekonstruiše sesije iz sirovih sistemskih događaja i sprovodi ograničenja preko pravila napisanih u čistom Kotlinu. Na backendu sam napravio simulaciju cloud platforme u Spring Bootu sa sopstvenim slojem bezbednosti, a u timu sam radio na mikroservisnom backendu za bankarski sistem.',
      'Držim i privatne časove iz C-a, C++-a, Jave i C#-a. Kad nekom objasnim pokazivač ili race condition, tek tada znam da li to i sam zaista razumem.',
      'Van programiranja pratim bankarski i finansijski sektor, a treniram boks i stoni tenis.',
    ],
    principlesTitle: 'Kako razmišljam o problemima',
    principles: [
      {
        title: 'Čisto jezgro, framework-ovi na ivicama',
        text: 'Poslovna pravila su u čistom kodu, bez Android, Spring ili UI tipova. Klase framework-a su tanki adapteri, pa se jezgro testira brzim unit testovima, bez emulatora.',
      },
      {
        title: 'Znaj šta radi ispod',
        text: 'Menjao sam tabele stranica u kernelu i pisao bytecode VM. Kad je aplikacija spora ili je neki broj pogrešan, želim da znam koji sloj je odgovoran.',
      },
      {
        title: 'Jedan izvor istine',
        text: 'Jedan pisac za podatke o korišćenju u Focus Flow-u, jedan autoritativni server u Draft Duel-u. Nekoliko bagova u Focus Flow-u nastalo je jer su dva mesta upisivala iste podatke.',
      },
      {
        title: 'Objasni jednostavno',
        text: 'Časovi su me naučili da, ako ne mogu da objasnim zašto kod radi, još ga ne razumem. Dokumentaciju i commit poruke pišem za sledećeg čitaoca.',
      },
    ],
    pathTitle: 'Put do sada',
    pathText: 'Obrazovanje, podučavanje i projekti koji su oblikovali način na koji radim.',
    timeline: [
      { when: 'Sada', kind: 'Obrazovanje', title: 'Još jedan ispit, Računarski fakultet (RAF)', text: 'Softversko inženjerstvo. Svi ostali ispiti su položeni; ostao je jedan do diplome.', now: true },
      { when: 'Okt 2026', kind: 'Projekat', title: 'Specifikacija za Draft Duel', text: 'Pravila, arhitektura, protokol i MVP plan za 1v1 aukcijsku igru.' },
      { when: '2026', kind: 'Projekat', title: 'Focus Flow', text: 'Android aplikacija za vreme na ekranu i fokus, u pripremi za Google Play.' },
      { when: '2024/25', kind: 'Projekat sa predmeta', title: 'Generator izveštaja', text: 'Biblioteka za izveštaje sa pluginovima i CLI, predmet Softverske komponente.' },
      { when: 'U toku', kind: 'Podučavanje', title: 'Privatni časovi', text: 'Privatni časovi iz C-a, C++-a, Jave i C#-a.' },
    ],
    stackTitle: 'Tehnologije i alati',
    stackText: 'Šta koristim, grupisano po tome gde radi.',
    groups: { Android: 'Android', Backend: 'Backend', Systems: 'Sistemi', Languages: 'Jezici' },
    ctaTitle: 'Želite da radimo zajedno?',
    ctaText: 'Najbrže ćete me dobiti preko stranice za kontakt.',
    contactMe: 'Kontaktiraj me',
    seeWork: 'Pogledaj radove',
    downloadCv: 'Preuzmi CV',
  },

  contact: {
    title: `Kontakt — ${SITE.name}`,
    description: 'Javite se u vezi sa poslom, projektom ili privatnim časovima.',
    heading: 'Hajde da pričamo.',
    lead: 'Posao, projekat ili privatni časovi: napišite nekoliko redova i odgovoriću vam mejlom.',
    name: 'Ime',
    email: 'Email',
    topic: 'Tema',
    chooseTopic: 'Izaberite temu',
    topics: [
      { value: 'Job offer', label: 'Ponuda za posao' },
      { value: 'Collaboration', label: 'Saradnja' },
      { value: 'Private lessons', label: 'Privatni časovi' },
      { value: 'Other', label: 'Drugo' },
    ],
    message: 'Poruka',
    send: 'Pošalji poruku',
    replyNote: 'Odgovor stiže na email koji upišete iznad.',
    privacyBefore: 'Vaše ime, email i poruka šalju se preko servisa',
    privacyAfter: 'u moje sanduče i koriste se samo da bih vam odgovorio. Na ovom sajtu se ništa ne čuva.',
    sentTitle: 'Poruka je poslata.',
    sentText: 'Hvala što ste se javili. Odgovoriću na adresu koju ste uneli.',
    again: 'Pošalji još jednu poruku',
    copyEmail: 'Kopiraj email',
    openProfile: 'Otvori profil',
    browseCode: 'Pogledaj kod',
    cvTitle: 'PDF, A4',
    cvAction: 'Preuzmi ili sastavi svoj',
  },

  footer: { contact: 'Kontakt' },

  cv: {
    heading: 'Preuzmi moj CV',
    buildHeading: 'Sastavi CV',
    back: 'Nazad',
    close: 'Zatvori',
    lead: 'Uzmite standardnu verziju ili sastavite CV samo sa projektima koji su važni za vašu poziciju.',
    standard: 'Standardni',
    myCv: 'Moj CV',
    myCvText: 'Jedna A4 strana sa šest projekata sa fakulteta, sa svih slojeva.',
    downloadPdf: 'Preuzmi PDF',
    custom: 'Prilagođeni',
    build: 'Sastavi svoj',
    buildText: 'Izaberite projekte po nazivu, sloju, tehnologiji ili predmetu. Isti izgled, pravi se u vašem browseru.',
    choose: 'Izaberi projekte',
    search: 'Pretraga po nazivu, sloju, tehnologiji ili predmetu',
    allLayers: 'Svi slojevi',
    layerGroup: 'Sloj',
    techGroup: 'Tehnologija',
    more: (n: number) => `Još ${n}`,
    fewer: 'Prikaži manje',
    empty: 'Nijedan projekat ne odgovara. Probajte drugu reč ili poništite filtere.',
    none: 'Izaberite bar jedan projekat',
    count: (n: number) => `${n} ${n === 1 ? 'projekat' : n < 5 ? 'projekta' : 'projekata'} · redom kojim ste ih izabrali`,
    usePicks: 'Moj izbor',
    clear: 'Poništi',
    building: 'Pravim PDF',
    done: 'Preuzeto',
    failed: 'Osvežite stranicu i probajte ponovo',
    note: 'CV je na engleskom.',
  },

  notFound: {
    title: `Stranica nije pronađena — ${SITE.name}`,
    heading: 'Ova stranica ne postoji.',
    text: 'Link je možda star ili pogrešno otkucan.',
    back: 'Nazad na sve projekte',
  },
};

export const UI: Record<Lang, Dict> = { en, sr };
export const t = (lang: Lang) => UI[lang];
