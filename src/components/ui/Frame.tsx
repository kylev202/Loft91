import { fallbackSrc, srcSet, type Photo } from '../../data/photos';

/**
 * One photograph, three formats, every width the derivative pipeline produced.
 *
 * AVIF first, WebP second, JPEG last — the browser takes the first `type` it
 * understands, so a current phone fetches the AVIF (D-37) and nothing else. The
 * intrinsic `width`/`height` are the real pixels of the base candidate, which is
 * what reserves the box and keeps CLS at zero before the bytes arrive.
 *
 * `priority` is for the one image per page that is the LCP element — the cover.
 * It is eager, high-priority and synchronously decoded; everything else is lazy
 * and async, because on the real arrival path (an Instagram bio link, a phone,
 * mobile data) the below-the-fold photographs are competing with the one the
 * visitor is actually looking at.
 */
export function Frame({
  photo,
  sizes,
  priority = false,
  className = '',
  alt,
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Override only to set `alt=""` where the photograph is decorative and the
      same information is already carried as text nearby. */
  alt?: string;
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(photo, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(photo, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(photo)}
        srcSet={srcSet(photo, 'jpg')}
        sizes={sizes}
        width={photo.w}
        height={photo.h}
        alt={alt ?? photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
        className={className}
        style={photo.position ? { objectPosition: photo.position } : undefined}
      />
    </picture>
  );
}
