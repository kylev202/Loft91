/* Register once, at import time, before any hook runs. `useGSAP` is registered
   too so its cleanup contract holds under React StrictMode. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* The entrance curve, restated for GSAP, which cannot read a CSS custom
   property. `--ease-move` is deliberately not mirrored here: the only things it
   drives are the loader and the view transitions, and both are CSS end to end. */
export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* Durations in seconds, mirroring the `--dur-*` tokens. */
export const DUR = {
  press: 0.12,
  micro: 0.18,
  short: 0.28,
  mid: 0.48,
  long: 0.72,
  settle: 0.9,
} as const;

export { gsap, ScrollTrigger, useGSAP };
