import { useEffect, useState, type MouseEvent } from 'react';
import { cx } from '../lib/format';
import { reducedMotion } from '../lib/hooks';
import './totop.css';

/** Šipka v pravém dolním rohu: po odscrollování o kus dolů se objeví a po stisknutí plynule vrátí stránku nahoru. */
export function ToTop() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let queued = false;
    const check = () => {
      queued = false;
      setOn(window.scrollY > Math.max(320, window.innerHeight * 0.45));
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(check);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    check();
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    };
  }, []);

  const up = (e: MouseEvent<HTMLButtonElement>) => {
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    // z klávesnice (detail 0) se zaměření vrátí na začátek stránky, aby se po zmizení tlačítka neztratilo
    if (e.detail === 0) document.querySelector<HTMLElement>('header.top a')?.focus({ preventScroll: true });
  };

  return (
    <button type="button" className={cx('btn btn--fill totop', on && 'on')} aria-label="Zpět nahoru" title="Zpět nahoru" onClick={up}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19.5V5M6 10.8 12 5l6 5.8" />
      </svg>
    </button>
  );
}
