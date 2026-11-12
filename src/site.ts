/**
 * Personal details in one place. Leave a field as `undefined` to hide it.
 */
export const SITE = {
  name: 'Vidan Stojić',
  title: 'Vidan Stojić — Software Engineer',
  description:
    'Software engineering student in Belgrade. Android apps, backend services, compilers and OS kernels.',
  location: 'Belgrade, Serbia',
  github: 'https://github.com/vidanstojic',
  linkedin: undefined as string | undefined,
  email: undefined as string | undefined,
  /** Path under /public, e.g. '/vidan-stojic-cv.pdf' */
  cv: undefined as string | undefined,
};

export const LAYER_INFO = {
  interface: { name: 'Interface', blurb: 'Apps people touch' },
  services: { name: 'Services', blurb: 'Servers, APIs, real-time' },
  data: { name: 'Data', blurb: 'Processing, storage, reports' },
  language: { name: 'Language', blurb: 'Parsing and interpreting code' },
  kernel: { name: 'Kernel', blurb: 'Inside the operating system' },
} as const;
