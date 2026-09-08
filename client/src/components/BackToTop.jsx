import { useEffect, useState } from 'react';
import './BackToTop.css';

/* Appears once the visitor is far enough down that scrolling back by hand is a
   chore, and returns them to the top. Deliberately only past a full screen of
   scrolling — on a short page it would sit there with nothing to do. */
const SHOW_AFTER = 600;

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > SHOW_AFTER);
    onScroll();                       // in case the page loads part-scrolled
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    /* Honour a visitor who has asked their system for reduced motion — a long
       smooth scroll can be genuinely unpleasant for them. */
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      className={`to-top ${show ? 'on' : ''}`}
      onClick={toTop}
      aria-label="Back to top"
      /* hidden from the keyboard and screen readers while invisible, so it is
         not a mystery stop in the tab order at the top of a page */
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : 'true'}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <path d="M12 5.5 5 12.5l1.6 1.6L12 8.7l5.4 5.4L19 12.5z" fill="currentColor" />
      </svg>
    </button>
  );
}
