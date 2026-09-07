import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Reveal elements with class .reveal as they scroll into view.
// Uses ONE persistent observer (created once) so dynamically-loaded elements
// (e.g. cards fetched from the API) are reliably revealed — plus a safety net
// so content is never left permanently hidden.
// Anything that should animate in. .split-text headings are included so their
// words are triggered by the same observer as everything else.
const SEL = '.reveal:not(.in), .split-text:not(.in)';
const ALL = '.reveal, .split-text';

export function useReveal(deps = []) {
  const ioRef = useRef(null);

  useEffect(() => {
    // Marks that scripting is running. Every "hidden until revealed" rule is
    // scoped to html.js-anim, so with JS off or broken the content is visible
    // rather than a blank page.
    document.documentElement.classList.add('js-anim');

    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(ALL).forEach((el) => el.classList.add('in'));
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
      document.querySelectorAll(SEL).forEach((el) => io.observe(el));
    }

    const nearViewport = () => {
      document.querySelectorAll(SEL).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 100) el.classList.add('in');
      });
    };

    // safety net: reveal anything already within the viewport shortly after render
    const t = setTimeout(nearViewport, 900);

    // IntersectionObserver does not fire in a hidden or frozen tab. Without
    // these two, a page opened in a background tab — or fetched by a crawler —
    // can be left with its headings permanently invisible.
    const onShow = () => { if (!document.hidden) nearViewport(); };
    document.addEventListener('visibilitychange', onShow);
    const hard = setTimeout(() => {
      if (!document.querySelector('.reveal.in, .split-text.in')) {
        document.querySelectorAll(ALL).forEach((el) => el.classList.add('in'));
      }
    }, 2600);

    return () => {
      clearTimeout(t);
      clearTimeout(hard);
      document.removeEventListener('visibilitychange', onShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Scroll to top on route change, or to a #hash section if present
export function useScrollTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const go = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      go();
      const t = setTimeout(go, 350); // retry after async content settles
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}
