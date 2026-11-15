/**
 * Personal details in one place. Leave a field as `undefined` to hide it.
 */
export const SITE = {
  name: 'Vidan Stojić',
  role: 'Software engineer',
  title: 'Vidan Stojić — I build software from the kernel to the screen',
  description:
    'Software engineering student in Belgrade. Android apps, backend services, compilers and OS kernels.',
  location: 'Belgrade, Serbia',
  availability: 'Open to graduate and junior roles, and to interesting projects',
  github: 'https://github.com/vidanstojic',
  githubHandle: '@vidanstojic',
  linkedin: 'https://www.linkedin.com/in/vidan-stoji%C4%87-57166032b/' as string | undefined,
  linkedinHandle: 'in/vidan-stojić',
  /** Shown on the site and where contact-form messages are delivered. */
  email: 'vidan.stojic@gmail.com',
  /** Path under /public, e.g. '/vidan-stojic-cv.pdf'. Undefined: "CV on request". */
  cv: undefined as string | undefined,
  /** Profile photo in src/assets, e.g. 'profile.jpg'. Undefined: monogram. */
  photo: 'profile.jpg' as string | undefined,
  /**
   * Optional Web3Forms access key (https://web3forms.com). It is public by design.
   * Undefined: the form sends through FormSubmit (https://formsubmit.co) to `email`;
   * FormSubmit asks the owner to confirm the address once, on the first message.
   */
  web3formsKey: '026e881b-c8d4-4150-ab90-51bf73fd1c4b' as string | undefined,
};

export const NAV = [
  { href: '/projects/', label: 'Work', match: '/projects' },
  { href: '/about/', label: 'About', match: '/about' },
] as const;

/** Layers top-down; `bg` gets darker with depth, `addr` is the layer's "address". */
export const LAYER_INFO = {
  interface: { name: 'Interface', blurb: 'Apps people touch', addr: '0x1e00', bg: '#17171a' },
  services: { name: 'Services', blurb: 'Servers, APIs, real-time', addr: '0x1300', bg: '#121214' },
  data: { name: 'Data', blurb: 'Processing, storage, reports', addr: '0x0a00', bg: '#0d0d0f' },
  language: { name: 'Language', blurb: 'Parsing and interpreting code', addr: '0x0400', bg: '#090909' },
  kernel: { name: 'Kernel', blurb: 'Inside the operating system', addr: '0x0000', bg: '#050505' },
} as const;
