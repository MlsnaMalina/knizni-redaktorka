import { useEffect, useState, useSyncExternalStore } from 'react';

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

/** Nastaví title a popis stránky. */
export function usePageMeta(title: string, description: string): void {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = description;
  }, [title, description]);
}
