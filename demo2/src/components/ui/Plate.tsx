import type { Photo } from '../../data/photos';
import { fallbackSrc, srcSet } from '../../data/photos';

interface PlateProps {
  photo: Photo;
  /** Required — a `<picture>` without `sizes` downloads the widest candidate. */
  sizes: string;
  /** Tailwind aspect/size classes for the plate itself. */
  className?: string;
  /** Above the fold: skips lazy-loading and asks for early bandwidth. */
  priority?: boolean;
  /** `true` where the same photograph is described elsewhere on the page. */
  decorative?: boolean;
  /** Runs the clip-path develop on scroll. Off for the hero, which has its own. */
  reveal?: boolean;
  /** Caption beneath the plate, in the small voice. */
  caption?: string;
  /** Two-digit plate number, printed beside the caption like a monograph. */
  index?: string;
}

/**
 * A photograph, printed onto the page.
 *
 * AVIF first, WebP second, the original JPEG last. The JPEG set alone breached
 * the 250 KB per-image budget (`taps-1600.jpg` is 506 KB); every AVIF candidate
 * is inside it, and AVIF is what any browser released this decade fetches.
 *
 * `width`/`height` are the real intrinsic pixels from the manifest, so the box
 * is reserved before the bytes land — images are the usual way a CLS budget
 * gets spent.
 */
export function Plate({
  photo,
  sizes,
  className = '',
  priority,
  decorative,
  reveal = true,
  caption,
  index,
}: PlateProps) {
  const img = (
    <div className={`plate ${className}`} {...(reveal ? { 'data-plate': '' } : {})}>
      <picture>
        <source type="image/avif" srcSet={srcSet(photo, 'avif')} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(photo, 'webp')} sizes={sizes} />
        <img
          src={fallbackSrc(photo)}
          srcSet={srcSet(photo, 'jpg')}
          sizes={sizes}
          alt={decorative ? '' : photo.alt}
          width={photo.w}
          height={photo.h}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
        />
      </picture>
    </div>
  );

  if (!caption) return img;

  return (
    <figure>
      {img}
      <figcaption className="mt-xs flex items-baseline gap-sm">
        {index ? <span className="label text-ink-3 tabular-nums">{index}</span> : null}
        <span className="label text-ink-3">{caption}</span>
      </figcaption>
    </figure>
  );
}
