import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Reveal elements with class .reveal as they scroll into view.
// Uses ONE persistent observer (created once) so dynamically-loaded elements
// (e.g. cards fetched from the API) are reliably revealed — plus a safety net
// so content is never left permanently hidden.
export function useReveal(deps = []) {
  const ioRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    ioRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); ioRef.current.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    return () => ioRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const io = ioRef.current;
    if (io) {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    }
    // safety net: reveal anything already within the viewport shortly after render
    const t = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 100) el.classList.add('in');
      });
    }, 900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Scroll to top on route change
export function useScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
}
