# GSAP AI Skills

Official GSAP animation skills for Claude Code. Covers core API, timelines, ScrollTrigger, plugins, React/Vue/Svelte, utilities, and performance.

> **All plugins are free** — including formerly Club-only plugins (SplitText, MorphSVG, etc.). Install everything from the public `gsap` npm package. No auth token or private registry needed.

## Skills

| Skill | Description |
|-------|-------------|
| **gsap-core** | Core API: `gsap.to()`, `from()`, `fromTo()`, easing, stagger, transforms, matchMedia |
| **gsap-timeline** | Timelines: sequencing, position parameter, labels, nesting, playback |
| **gsap-scrolltrigger** | ScrollTrigger: scroll-linked animations, pinning, scrub, triggers, refresh |
| **gsap-plugins** | Plugins: Flip, Draggable, SplitText, MorphSVG, DrawSVG, MotionPath, ScrollTo, CustomEase, and more |
| **gsap-utils** | gsap.utils: clamp, mapRange, normalize, interpolate, random, snap, toArray, wrap, pipe |
| **gsap-react** | React: useGSAP hook, refs, gsap.context(), cleanup, SSR |
| **gsap-performance** | Performance: transforms over layout props, will-change, batching, quickTo |
| **gsap-frameworks** | Vue, Svelte, Nuxt, SvelteKit: lifecycle, selector scoping, cleanup on unmount |

## Quick reference

```javascript
// 1. Import and register plugins once
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// 2. Single tween — prefer transform aliases and autoAlpha
gsap.to(".box", { x: 100, autoAlpha: 1, duration: 0.6, ease: "power2.inOut" });

// 3. Timeline for sequencing (prefer over chained delay)
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2" } });
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "+=0.2")
  .to(".c", { opacity: 0 }, "-=0.1");

// 4. ScrollTrigger
const tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});
tl2.to(".panel", { x: 100 }).to(".panel", { rotation: 5 });

// 5. React: useGSAP + scope + cleanup
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);
useGSAP(() => {
  gsap.to(".box", { x: 100 });
}, { scope: containerRef });
```

## License

MIT
