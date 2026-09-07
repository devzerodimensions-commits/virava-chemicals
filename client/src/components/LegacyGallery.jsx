import { useRef } from 'react';
import { useDragScroll } from '../hooks.js';
import './LegacyGallery.css';

/* Client-provided photographs with their captions, quoted as supplied. The 1985
   Fatty Alcohol Meet archive set first, then the recent ones, in date order. */
export const LEGACY_PHOTOS = [
  { src: '/img/about/founder-1.webp',
    caption: 'Mr. Siddharth Shah giving a presentation at the Fatty Alcohol Meet in the year 1985. Mr. Adi Godrej (centre), Mr. Eipe (left) and Mr. Pinto (second from right) graced the occasion with their presence.' },
  { src: '/img/about/founder-2.webp',
    caption: 'Mr. Siddharth Shah (right) and Mr. Ashok Shah (left) receiving Mr. Adi Godrej for the Fatty Alcohols Meet in the year 1985.' },
  { src: '/img/about/founder-3.webp',
    caption: 'Mr. Siddharth Shah giving his respects to Mr. S. P. Godrej (Indian industrialist and a member of the Godrej family).' },
  { src: '/img/about/founder-4.webp',
    caption: 'Mr. Adi Godrej speaking at the occasion of the Fatty Alcohol Meet in Ahmedabad, 1985.' },
  /* portrait: this one is 960x1280, so its crop window is nudged upward to keep
     both faces and the award in frame — see .legacy-img.is-portrait. */
  { src: '/img/about/godrej-visit-1.webp', portrait: true,
    caption: 'Mr Vishal Sharma (Current CEO of Godrej Chemicals) at Virava Chemicals office in Ahmedabad.' },
  { src: '/img/about/godrej-visit-2.webp',
    caption: 'Mr Vishal Sharma (CEO of Godrej Chemicals) along with the Virava Chemicals Family' },
  { src: '/img/about/godrej-visit-3.webp',
    caption: 'Virava Chemicals receiving best performance award (Silver) from Godrej Industries for the year 2025-26.' },
];

/* The photo carousel, shared by About and Home. Extracted rather than duplicated:
   the drag handling below is fiddly enough that two copies would drift apart. */
export default function LegacyGallery() {
  const railRef = useRef(null);

  /* Scroll the rail by exactly one card, measured live so it stays correct
     when the card width changes at a breakpoint. */
  const scrollRail = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector('.legacy-card');
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 22;
    const step = card ? card.getBoundingClientRect().width + gap : 340;
    rail.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  // drag-to-pan now lives in useDragScroll, shared with the home highlights strip
  const dragProps = useDragScroll(railRef);

  return (
    <div className="legacy-rail-wrap reveal">
      <button type="button" className="rail-btn rail-prev" onClick={() => scrollRail(-1)} aria-label="Previous photos">‹</button>
      <div className="legacy-rail" ref={railRef} {...dragProps}>
        {LEGACY_PHOTOS.map((p) => (
          <figure className="legacy-card" key={p.src}>
            {/* draggable={false}: otherwise the browser starts its own image
                drag and the ghost preview follows the cursor instead */}
            <div className={p.portrait ? 'legacy-img is-portrait' : 'legacy-img'}>
              <img src={p.src} alt={p.caption} loading="lazy" draggable={false} />
            </div>
            <figcaption>{p.caption}</figcaption>
          </figure>
        ))}
      </div>
      <button type="button" className="rail-btn rail-next" onClick={() => scrollRail(1)} aria-label="Next photos">›</button>
    </div>
  );
}
