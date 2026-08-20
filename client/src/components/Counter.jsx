import { useEffect, useRef, useState } from 'react';

export default function Counter({ end = 0, duration = 1800, suffix = '+' }) {
  const target = Number(end) || 0;
  // Anyone who has asked for less motion just gets the number.
  const still = typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [val, setVal] = useState(still ? target : 0);
  const ref = useRef(null);
  const done = useRef(still);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) { setVal(target); return; }

    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(target);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) run();
    }, { threshold: 0.4 });
    io.observe(el);

    // Safety net: if the observer never fires — a viewport too short for the
    // element to reach 40%, a backgrounded tab, rAF unavailable — show the real
    // figure rather than leaving a permanent "0+" on the page.
    const fallback = setTimeout(() => {
      if (!done.current) { done.current = true; setVal(target); }
    }, 2500);

    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [target, duration]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}
