import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

/** Sleduje media query (šířka okna, dotyk, omezený pohyb). */
export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', notify);
      return () => mq.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export const reducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Šířka grafiky po stranách úvodních částí; mění se jen při znatelné změně šířky okna. */
export const FLOW = 1080;
export const artWidthFor = (w: number): number =>
  Math.round(w < FLOW ? Math.min(w * 0.66, 280) : Math.min(Math.max(w * 0.22, 180), 360));

export function useArtWidth(): number {
  const [state, setState] = useState(() => ({ at: window.innerWidth, aw: artWidthFor(window.innerWidth) }));
  useEffect(() => {
    const onResize = () => {
      setState((s) => (Math.abs(window.innerWidth - s.at) >= 40 ? { at: window.innerWidth, aw: artWidthFor(window.innerWidth) } : s));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return state.aw;
}

/**
 * Postupné načítání při posunu stránky: položky s třídou rv uvnitř prvku dostanou atribut data-in, jakmile jsou vidět;
 * položky, které se objeví najednou, se zpožďují za sebou (--rd). Bez IntersectionObserver jsou vidět hned.
 */
export function useRevealOnScroll(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const items = [...root.querySelectorAll<HTMLElement>('.rv')];
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.setAttribute('data-in', ''));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        seen.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        seen.forEach((el, i) => {
          el.style.setProperty('--rd', `${i * 140}ms`);
          el.setAttribute('data-in', '');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.35 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/** Nastaví title a popis stránky. */
export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);
}
