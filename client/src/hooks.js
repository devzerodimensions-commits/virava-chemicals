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

/* Cards in a grid all cross the threshold on the same frame, so without this
   a whole row snaps in at once. Offsetting each by its position among its
   revealing siblings makes the row cascade. Capped so a long list doesn't end
   up waiting a second before its last item moves.
   Skipped for .split-text — its words already carry their own delays, and
   adding another would stall the heading behind the body copy. */
function stagger(el) {
  if (el.classList.contains('split-text') || el.style.transitionDelay) return;
  const parent = el.parentElement;
  if (!parent) return;
  const sibs = [...parent.children].filter((c) => c.classList.contains('reveal'));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
}

export function useReveal(deps = []) {
  const ioRef = useRef(null);

  useEffect(() => {
    // Marks that scripting is running. Every "hidden until revealed" rule is
    // scoped to html.js-anim, so with JS off or broken the content is visible
    // rather than a blank page.
    document.documentElement.classList.add('js-anim');

    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll(ALL).forEach((el) => el.classList.add('in', 'snap'));
      return;
    }
    ioRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          stagger(e.target);
          e.target.classList.add('in');
          ioRef.current.unobserve(e.target);
        });
      },
      { threshold: 0.1 }
    );

    /* Catch .reveal elements that appear between renders.
       The scan below only runs when a page's deps change, so anything React
       recreates in between is born hidden and never revealed. That is not
       hypothetical: the principal page keys its category panel on the category
       id, so switching tabs destroys and rebuilds the panel — and the products
       inside it stayed at opacity 0, looking like the tab was broken. Any list
       that remounts on a filter or tab has the same shape. */
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches?.(SEL)) ioRef.current?.observe(node);
          node.querySelectorAll?.(SEL).forEach((el) => ioRef.current?.observe(el));
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { mo.disconnect(); ioRef.current?.disconnect(); };
  }, []);

  useEffect(() => {
    const io = ioRef.current;
    if (io) {
      document.querySelectorAll(SEL).forEach((el) => io.observe(el));
    }

    /* Failsafe reveals add `snap` as well as `in`. Adding `in` alone only sets
       the transition's target — and a transition does not tick in a frozen or
       backgrounded tab, so the element would sit at opacity 0 having been
       "revealed". `snap` turns the transition off so it takes effect at once.
       In a normal load the observer has already dealt with these, so this path
       is only reached when the animation was never going to run anyway. */
    const nearViewport = () => {
      document.querySelectorAll(SEL).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight + 100) el.classList.add('in', 'snap');
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
        document.querySelectorAll(ALL).forEach((el) => el.classList.add('in', 'snap'));
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

/**
 * Click-and-drag panning for a horizontally scrolling row.
 *
 * Native overflow-x already gives wheel, trackpad and touch scrolling, but a
 * mouse drag does nothing without this — you can only move the row with a wheel
 * or by grabbing the scrollbar, which on a strip with a hidden scrollbar looks
 * like it cannot be moved at all.
 *
 * Mouse only: touch scrolls natively with proper momentum, and intercepting it
 * here would fight the browser.
 *
 * Returns props to spread onto the scrolling element. Shared by the photo
 * carousel and the home highlights strip rather than duplicated — the snap
 * suspension and click suppression below are easy to get subtly wrong twice.
 */
export function useDragScroll(ref) {
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: 0 });

  const onPointerDown = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || e.button !== 0) return;
    /* Nothing to drag when the content already fits. Without this the rail on
       the solution pages — a horizontal strip on phones but a plain vertical
       list on desktop — would still count the pointer movement, and a click
       where the hand drifted a few pixels would be swallowed as a drag. */
    if (el.scrollWidth <= el.clientWidth + 4) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: 0 };
    // snapping and smooth scrolling both fight a scrollLeft driven by the cursor
    el.style.scrollSnapType = 'none';
    el.style.scrollBehavior = 'auto';
    el.classList.add('is-dragging');
  };

  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = () => {
    const el = ref.current;
    if (!el || !drag.current.down) return;
    drag.current.down = false;
    el.classList.remove('is-dragging');
    // clearing the inline values hands snapping back to the stylesheet, so the
    // row settles onto a card rather than stopping mid-item
    el.style.scrollBehavior = '';
    el.style.scrollSnapType = '';
  };

  // a drag that ends on a card must not also register as a click on it
  const onClickCapture = (e) => {
    if (drag.current.moved > 5) { e.preventDefault(); e.stopPropagation(); }
  };

  return {
    onPointerDown, onPointerMove,
    onPointerUp: endDrag, onPointerLeave: endDrag, onPointerCancel: endDrag,
    onClickCapture,
  };
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
