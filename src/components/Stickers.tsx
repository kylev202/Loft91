/**
 * The stickers on `/events/` — three small drawings in ink on paper.
 *
 * They are the one place on the site that plays, and they keep the system's
 * rules while doing it: no hue (ink stroke, page fill, a panel-2 die-cut
 * backing in place of a shadow), one stroke weight, and motion that is slow,
 * small and stops entirely under reduced motion (`.sticker` in base.css).
 *
 * All three are decorative and `aria-hidden` — every fact they hint at
 * ("happy hour all night", "comedy", "karaoke") is printed as text beside them.
 */

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Comedy — a speech bubble that can't keep still, with a burst of laughter. */
export function ComedySticker({ className = '' }: { className?: string }) {
  const bubble =
    'M24 22 H96 Q106 22 106 32 V70 Q106 80 96 80 H50 L30 98 L34 80 H24 Q14 80 14 70 V32 Q14 22 24 22 Z';
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={`sticker sticker--sway ${className}`}>
      <path d={bubble} transform="translate(4 4)" className="sticker__backing" />
      <path d={bubble} {...STROKE} className="sticker__face" />
      <text x="60" y="58" textAnchor="middle" className="sticker__type">
        HA HA
      </text>
      <g {...STROKE} className="sticker__burst">
        <path d="M100 8 L104 16" />
        <path d="M112 14 L106 20" />
        <path d="M114 28 L106 28" />
      </g>
    </svg>
  );
}

/** Karaoke — a microphone, with notes drifting up off it. */
export function KaraokeSticker({ className = '' }: { className?: string }) {
  const head = 'M60 14 a20 20 0 1 1 -0.01 0 Z';
  const body = 'M50 52 H70 L66 98 Q60 104 54 98 Z';
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={`sticker sticker--sway ${className}`}>
      <g transform="translate(4 4)" className="sticker__backing">
        <path d={head} />
        <path d={body} />
      </g>
      <path d={body} {...STROKE} className="sticker__face" />
      <path d={head} {...STROKE} className="sticker__face" />
      <g {...STROKE}>
        <path d="M46 26 L74 46" />
        <path d="M42 36 L66 52" />
        <path d="M54 18 L78 36" />
        <path d="M56 70 H64" />
      </g>
      {/* Two notes, each drifting up and fading on its own offset. */}
      <g className="sticker__note">
        <path d="M94 52 V30 L106 26 V46" {...STROKE} />
        <circle cx="91" cy="53" r="4" fill="currentColor" />
        <circle cx="103" cy="47" r="4" fill="currentColor" />
      </g>
      <g className="sticker__note sticker__note--late">
        <path d="M20 46 V28" {...STROKE} />
        <path d="M20 28 Q28 30 26 38" {...STROKE} />
        <circle cx="17" cy="47" r="4" fill="currentColor" />
      </g>
    </svg>
  );
}

/** The happy hour roundel — the words turn, the glass in the middle doesn't. */
export function HappyHourBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={`sticker ${className}`}>
      <defs>
        <path id="hh-ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
      </defs>
      <circle cx="64" cy="64" r="54" className="sticker__backing" />
      <circle cx="60" cy="60" r="54" {...STROKE} className="sticker__face" />
      <g className="sticker__spin">
        <text className="sticker__ring">
          <textPath href="#hh-ring" textLength="248">
            HAPPY HOUR · ALL NIGHT · HAPPY HOUR · ALL NIGHT ·
          </textPath>
        </text>
      </g>
      {/* A coupe, static at the centre. */}
      <g {...STROKE}>
        <path d="M46 50 H74 Q72 64 60 64 Q48 64 46 50 Z" />
        <path d="M60 64 V76" />
        <path d="M52 76 H68" />
      </g>
    </svg>
  );
}
