/**
 * Content of the CV. Course projects from Vidan's original CV keep his wording;
 * the other projects are written in the same style from the case studies on the site. The home address is left out on purpose: the PDF is
 * public, so only the city is shown.
 */

export interface CvProject {
  /** Project id on the site (src/content/projects/<id>.md). */
  id: string;
  heading: string;
  body: string;
  /** Last line in small type, e.g. the repository link. */
  footer?: string;
  link?: string;
}

export interface CvLabelled {
  label: string;
  text: string;
}

export const CV_PERSON = {
  firstName: 'Vidan',
  lastName: 'Stojić',
  details: ['+381644844068', 'vidan.stojic@gmail.com', 'Belgrade, Serbia'],
  education: [
    { title: 'Fourth Gymnasium in Belgrade', lines: ['2018 - 2022'] },
    {
      title: 'Union University Faculty of Computer Science, Belgrade',
      lines: ['Computer Science', '2022 - present', 'Senior undergraduate,', 'one exam left before graduation'],
    },
  ],
  skills: [
    { label: 'Programming languages:', text: 'Kotlin, Java, C, C++, C#, Python, TypeScript, JavaScript' },
    { label: 'Mobile applications:', text: 'Android (Jetpack Compose, Room, Hilt, WorkManager, Coroutines), Kotlin Multiplatform, Compose Multiplatform' },
    { label: 'Backend:', text: 'Spring Boot, Ktor, Node.js' },
    { label: 'Web:', text: 'Angular, React, HTML, CSS' },
    { label: 'Databases:', text: 'PostgreSQL, MySQL' },
    { label: 'Tools:', text: 'Git, Gradle, Maven, Docker, Linux' },
    { label: 'Other:', text: 'REST API, WebSockets, RabbitMQ, JWT, AOP' },
  ] satisfies CvLabelled[],
  languages: ['English'],
  links: [
    { label: 'Portfolio:', text: 'https://vidanstojic.me' },
    { label: 'GitHub:', text: 'https://github.com/vidanstojic' },
    { label: 'LinkedIn:', text: 'https://www.linkedin.com/in/vidan-stoji%C4%87-57166032b/' },
  ] satisfies CvLabelled[],
  about:
    'Sport has taught me that discipline and teamwork are the foundation of every success, both personal and team-based. My ambition is to gain top-tier experience through work on complex projects, which I could one day pass on to new colleagues. I am focused on constant growth through challenges that demand maximum concentration.',
  experience: [
    {
      title: 'Private Tutoring (2024 - Present)',
      bullets: [
        'Individual tutoring of high school students in C++, Java, and C#',
        'Individual tutoring and exam preparation for university students in C and Java',
        'Debugging of university course projects',
      ],
    },
    {
      title: 'Mentee, Mentor the Young (Sep - Dec 2026)',
      bullets: ['Three-month programme that pairs young people in Serbia with experienced mentors'],
    },
  ],
  interests: [
    'Work in the service industry - developing communication skills, teamwork, and working under pressure',
    'Active in sports (basketball, football, boxing) - building discipline, persistence, and team spirit',
  ],
};

const repo = (name: string) => ({
  footer: `Repository: https://github.com/vidanstojic/${name}`,
  link: `https://github.com/vidanstojic/${name}`,
});

export const CV_PROJECTS: Record<string, CvProject> = {
  // From Vidan's CV, unchanged.
  'classy-craft': {
    id: 'classy-craft',
    heading: '"ClassyCraft" | Software Design',
    body: 'This project was developed in a pair, building a desktop application for creating UML class diagrams intended for students of technical sciences. The project contributed to improved knowledge of object-oriented programming, the application of design patterns, teamwork, and the development of good working habits. The programming language used was Java, and the project was developed in the IntelliJ development environment. Through practical work, I also learned to efficiently debug the system using the advanced tools this development environment offers.',
    ...repo('Classy-Craft---Dizajn-softvera'),
  },
  slang: {
    id: 'slang',
    heading: '"Slang Compiler" | Programming Language Compilers',
    body: 'Development of a compiler "from scratch" using the Java language in the IntelliJ IDEA environment, using the ANTLR tool for automating lexical and syntax analysis. Support was implemented for int and boolean data types, working with arrays, defining functions, and control structures such as loops and conditional expressions, achieving an advanced understanding of the internal architecture and logic of programming language compilers.',
    ...repo('Slang-compiler-Compilers-'),
  },
  'report-generator': {
    id: 'report-generator',
    heading: '"Report Generation Components Implementation" | Software Components',
    body: 'Implementation of an extensible Kotlin (JDK 21) library for generating CSV, PDF, and Excel reports with built-in logic for data aggregation (SUM, AVG, COUNT). The architecture is based on a strict separation of specification from implementation, while Gradle with the Maven Publish protocol was used to automate the build process and distribute the component.',
    ...repo('Implementation-of-report-generation-components-Software-component'),
  },
  xv6: {
    id: 'xv6',
    heading: 'xv6 Kernel Modifications | Operating Systems',
    body: 'This project involved a series of advanced modifications to the xv6 operating system kernel aimed at extending file system and memory management functionality. Support for symbolic links was implemented through the development of new system calls. A shared memory subsystem was developed, enabling efficient interprocess communication via global memory objects. Additionally, the keyboard driver was enhanced with the introduction of a command history buffer and support for navigation shortcuts (undo/redo) directly in the console. Language used: C',
  },
  'raf-cloud': {
    id: 'raf-cloud',
    heading: '"RAFCloud" | Advanced Web Programming',
    body: 'Development of a full-stack cloud simulation using the Spring Boot 3 (Kotlin) and Angular 16 platforms. The system supports asynchronous resource management and real-time communication via WebSockets, with a security layer based on JWT and AOP mechanisms. JPA (MySQL) was used for data persistence, with advanced use of reflection for precise control of permissions over resources.',
    ...repo('RAF-Cloud'),
  },
  catapp: {
    id: 'catapp',
    heading: '"CatApp" | Mobile Application Development',
    body: 'Development of a modern Android application using the Kotlin language and the Jetpack Compose environment for declarative UI. The project integrates external REST API services for a breed catalog and a Room database for local data persistence, using Kotlin Serialization and KSP processors. Complex gamification logic was implemented through a quiz system with a global leaderboard, along with advanced UI/UX solutions in the form of animations and support for different themes.',
    ...repo('CatApp---Mobile-application-development'),
  },

  // Written from the case studies on the site, in the same style.
  'focus-flow': {
    id: 'focus-flow',
    heading: '"Focus Flow" | Personal Project',
    body: 'Development of an Android application for tracking screen time and enforcing user-defined limits, built with Kotlin and Jetpack Compose. Usage is reconstructed from raw UsageStatsManager events into sessions, split by hour and stored in a Room database. Daily app limits, schedules, session limits and a Shorts/Reels blocker based on an AccessibilityService are evaluated by a rules engine written in plain Kotlin, separated from the Android layer and covered by JUnit tests. The app also includes a smart alarm and works fully offline. It is awaiting its production release on Google Play.',
    ...repo('Screen-Manager'),
  },
  'productivity-buddy': {
    id: 'productivity-buddy',
    heading: '"ProductivityBuddy" | University Project',
    body: 'Development of a JavaFX desktop application (Java 21) that monitors running processes in real time using the OSHI library and shows how computer time is split between work, fun and other activities. A multi-module Maven build separates the data service, the OS scanner, the analytics engine and the user interface. Processes can be categorized, renamed and paused from tracking; the state is persisted as JSON with a file watcher for external edits, and CSV snapshots are exported on a schedule.',
    ...repo('ProductivityBuddy'),
  },
  'draft-duel': {
    id: 'draft-duel',
    heading: '"Draft Duel" | Personal Project',
    body: 'Development of a 1v1 card auction game for Android in Kotlin Multiplatform and Compose Multiplatform, with every screen in shared code and platform services behind expect/actual. The match rules are a pure reducer with no I/O, called in the same way by the UI, six bots and the tests. The strongest bot looks ahead with order statistics over the remaining cards, and 1,000 bot-versus-bot matches per pair were used to balance the difficulty. Card packs are generated from rating tables with Python scripts and checked by a validator. The app is in closed testing on Google Play.',
    ...repo('Draft-Duel'),
  },
  'banka-1': {
    id: 'banka-1',
    heading: '"Banka 1" | Team Project',
    body: 'Participation in a student team building a microservice backend for a banking system in Java 21 and Spring Boot, covering accounts, cards, credits, transfers, currency exchange and trading. Services communicate through RabbitMQ and store data in PostgreSQL, with shared infrastructure started through Docker Compose. Every push runs tests, Checkstyle, documentation checks and OpenAPI validation through Git hooks and GitHub Actions.',
    ...repo('Banka-1-Backend'),
  },
  'database-project': {
    id: 'database-project',
    heading: '"Interplanetary Relocation Database" | Databases',
    body: 'Development of a Java desktop application over a MySQL database for a fictional service that relocates people to habitable planets and moons. Data is accessed through JDBC with prepared statements and raw SQL, without an ORM. Queries filter destinations by orbital distance, temperature, atmosphere, gravity and safety, and users can book housing and departures and track their transactions.',
    ...repo('Data-Base-Project'),
  },
  'parallel-image-processing': {
    id: 'parallel-image-processing',
    heading: '"Parallel Image Processing" | Parallel Algorithms',
    body: 'Development of a Python system, in a team of two, that applies grayscale, Gaussian blur and brightness filters to large batches of images in parallel using multiprocessing. A JSON registry links every processed image to its original and to the task that produced it, recording the task status, processing time and file sizes.',
    ...repo('Parallel-algorithms-first'),
  },
  'histogram-classifier': {
    id: 'histogram-classifier',
    heading: '"Color Histogram Classifier" | Parallel Algorithms',
    body: 'Development of an image classifier in Python, in a team of two, based on 3D RGB histograms and cosine similarity between an image and per-class profiles. The solution is written in a strictly functional style, using map, filter, reduce and lazy iterators instead of loops, which also keeps memory use low on large image sets.',
    ...repo('Parallel-algorithms'),
  },
};

/** The standard CV: the two apps first, then the projects across the stack. */
export const DEFAULT_CV_PROJECTS = ['focus-flow', 'draft-duel', 'raf-cloud', 'slang', 'xv6', 'productivity-buddy'];
