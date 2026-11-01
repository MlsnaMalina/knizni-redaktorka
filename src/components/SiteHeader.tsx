import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MAIL, NAV, PAGE_NUMBERS } from '../data/site';
import { cx } from '../lib/format';
import type { CSSVars } from '../lib/css';
import { useMedia } from '../lib/hooks';

interface SiteHeaderProps {
  /** Hlavička leží přes první část stránky; jinak stojí v toku stránky. */
  over?: boolean;
}

/**
 * Hlavička s pěti položkami. Do 720 px je pevně nahoře, při čtení dolů se schová a při pohybu zpět vrátí;
 * slovo Menu otevře obsah webu přes celou obrazovku (model A Obsah).
 */
export function SiteHeader({ over = false }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const ovRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);
  const mobile = useMedia('(max-width: 720px)');
  const { pathname } = useLocation();

  const toggle = (on: boolean) => {
    setOpen(on);
    setHidden(false);
  };

  // posun stránky pod otevřeným menu je zamčený
  useEffect(() => {
    document.documentElement.classList.toggle('m-lock', open);
    return () => document.documentElement.classList.remove('m-lock');
  }, [open]);

  // fokus: po otevření na první položku, po zavření zpět na tlačítko
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => ovRef.current?.querySelector('a')?.focus({ preventScroll: true }), 60);
      wasOpen.current = true;
      return () => window.clearTimeout(t);
    }
    if (wasOpen.current) btnRef.current?.focus({ preventScroll: true });
    return undefined;
  }, [open]);

  // Esc zavře menu, Tab zůstává uvnitř
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggle(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items: HTMLElement[] = [];
      if (btnRef.current) items.push(btnRef.current);
      ovRef.current?.querySelectorAll('a').forEach((a) => items.push(a));
      const i = items.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      items[(i + (e.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // při změně šířky nad 720 px se menu zavře
  useEffect(() => {
    if (!mobile) toggle(false);
  }, [mobile]);

  // při čtení dolů se hlavička schová, při pohybu zpět a nahoře stránky se vrátí
  useEffect(() => {
    if (open || !mobile) return undefined;
    let last = window.scrollY;
    let queued = false;
    const onScroll = () => {
      queued = false;
      const y = window.scrollY;
      if (y > last + 8 && y > 90) setHidden(true);
      else if (y < last - 8 || y < 40) setHidden(false);
      if (Math.abs(y - last) > 8) last = y;
    };
    const onScrollQueued = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(onScroll);
    };
    window.addEventListener('scroll', onScrollQueued, { passive: true });
    return () => window.removeEventListener('scroll', onScrollQueued);
  }, [open, mobile]);

  // aktuální stránka se nenačítá znovu: menu se zavře a stránka se vrátí nahoru
  const onItem = (e: MouseEvent, to: string) => {
    if (pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    toggle(false);
  };

  return (
    <>
      <header className={cx('top', over && 'over', hidden && 'm-hid')}>
        <Link className="mark" to="/" aria-label="Kateřina Mlsnová, úvod">
          <b>KATEŘINA MLSNOVÁ</b>
          <span>KNIŽNÍ REDAKCE</span>
        </Link>
        <nav className="main" aria-label="Hlavní navigace">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button ref={btnRef} type="button" className="m-btn" aria-expanded={open} aria-controls="m-ov" onClick={() => toggle(!open)}>
          <span>{open ? 'Zavřít' : 'Menu'}</span>
        </button>
      </header>
      <nav ref={ovRef} className={cx('m-ov', open && 'open')} id="m-ov" aria-label="Obsah webu">
        <p className="m-l">Obsah webu</p>
        <ol className="m-ol">
          {NAV.map((item, i) => (
            <li className="m-it" key={item.to} style={{ '--i': i } as CSSVars}>
              <NavLink to={item.to} end={item.to === '/'} onClick={(e) => onItem(e, item.to)}>
                <b>{i + 1}</b>
                <span className="m-tt">{item.label}</span>
                <i className="m-dots" aria-hidden="true" />
                <span className="m-pn">{PAGE_NUMBERS[i]}</span>
              </NavLink>
            </li>
          ))}
        </ol>
        <p className="m-f">
          <a href={`mailto:${MAIL}`}>{MAIL}</a>
        </p>
      </nav>
    </>
  );
}
