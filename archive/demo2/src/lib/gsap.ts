/* Register once, at import time, before any hook runs. `useGSAP` is registered
   too so its cleanup contract holds under React StrictMode. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The entrance curve, restated for GSAP, which cannot read a CSS custom
   property. `--ease-move` is deliberately not mirrored here: the only thing it
   drives is the loader, and the loader is CSS end to end. */
export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* Durations in seconds, mirroring the `--dur-*` tokens. */
export const DUR = {
  press: 0.12,
  micro: 0.16,
  short: 0.26,
  mid: 0.52,
  long: 0.76,
} as const;

export { gsap, ScrollTrigger, useGSAP };
