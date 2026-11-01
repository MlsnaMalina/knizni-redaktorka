import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { reducedMotion } from '../../lib/hooks';

/**
 * Co v textu sleduji: lupa je kolečko nad ukázkovým odstavcem, uvnitř se ukážou podtržená místa a v seznamu se rozsvítí
 * jejich kontrola. Na počítači jde lupa za myší, na dotyku se táhne za kolečko, šipky na klávesnici přeskakují mezi místy.
 * Ukázkový odstavec je záměrně plný chyb (typografie, jednotnost, logika, zdroje).
 */

/** Text odstavce: řetězec je beze změny, dvojice [číslo kontroly, podtržené místo]. */
const SEG: (string | [number, string])[] = [
  'Nový postup příjmu zkrátil průměrnou dobu vyřízení o 18 % (',
  [3, 'viz.'],
  ' tabulka 1). ',
  [1, 'Klient'],
  ' vyplní formulář už při objednání, ',
  [1, 'zákazník'],
  ' jej na recepci jen potvrdí a ',
  [1, 'uživatel'],
  ' dostane potvrzení e-mailem. Tabulka',
  [2, ', tedy přehledné uspořádání údajů do řádků a sloupců,'],
  ' shrnuje měření od ',
  [3, '12.9.2023'],
  ' do ',
  [3, '3.10.2023'],
  '. Zavedení stálo ',
  [3, '50.000 Kč'],
  ' a vychází z ',
  [3, '"interního"'],
  ' odhadu ',
  [4, '(Novák, 2019)'],
  '. Postup odpovídá normě ',
  [4, 'ISO 9001:2008'],
  '.',
];

export const CHECKS: { title: string; text: string }[] = [
  {
    title: 'Jednotnost textu a jeho členění',
    text: 'Jednotný styl celého textu, používání stejných zkratek a terminologie — stejná věc se jmenuje v první kapitole stejně jako v poslední.',
  },
  {
    title: 'Logika a návaznost',
    text: 'Odpovídá text publiku, kterému je určen? Není příliš odborný, nebo naopak zbytečně vysvětluje obecné základy?',
  },
  {
    title: 'Typografie a pravopis',
    text: 'České uvozovky, pomlčky, mezery, zápis dat, čísel, měn a kontrola chyb, které se v odborných textech opakují.',
  },
  {
    title: 'Ověření zdrojů',
    text: 'Je vše správně citováno a ozdrojováno? Odkazuje se na správné, platné a účinné předpisy a judikaturu?',
  },
];

function Sample() {
  return (
    <p>
      {SEG.map((s, i) =>
        typeof s === 'string' ? (
          s
        ) : (
          <span key={i} className="mkx" data-c={s[0]}>
            {s[1]}
            <sup>{s[0]}</sup>
          </span>
        )
      )}
    </p>
  );
}

interface Spot {
  c: number;
  x: number;
  y: number;
  r: number[][];
}

interface State {
  spots: Spot[];
  rad: number;
  px: number;
  py: number;
  moved: boolean;
  drag: [number, number] | null;
  glide: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function Checks() {
  const ltRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const legRef = useRef<HTMLOListElement>(null);
  const st = useRef<State>({ spots: [], rad: 0, px: 0, py: 0, moved: false, drag: null, glide: 0 });

  /** Přesune lupu a rozsvítí kontroly, jejichž místa jsou pod ní. */
  const put = (x: number, y: number) => {
    const lt = ltRef.current;
    const s = st.current;
    if (!lt) return;
    s.px = clamp(x, 0, lt.clientWidth);
    s.py = clamp(y, 0, lt.clientHeight);
    lt.style.setProperty('--x', `${s.px.toFixed(1)}px`);
    lt.style.setProperty('--y', `${s.py.toFixed(1)}px`);
    const near = (q: number[]) => Math.hypot(s.px - clamp(s.px, q[0], q[2]), s.py - clamp(s.py, q[1], q[3])) < s.rad;
    const on = s.spots.filter((sp) => sp.r.some(near)).map((sp) => sp.c);
    [...(legRef.current?.children ?? [])].forEach((li, i) => li.classList.toggle('on', on.includes(i + 1)));
  };

  const local = (e: { clientX: number; clientY: number }): [number, number] => {
    const r = ltRef.current?.getBoundingClientRect();
    return r ? [e.clientX - r.left, e.clientY - r.top] : [0, 0];
  };

  const nearest = () => {
    const s = st.current;
    return s.spots.reduce((b, sp, i) => (Math.hypot(sp.x - s.px, sp.y - s.py) < Math.hypot(s.spots[b].x - s.px, s.spots[b].y - s.py) ? i : b), 0);
  };

  const jump = (i: number) => {
    const s = st.current;
    if (!s.spots.length) return;
    const k = (i + s.spots.length) % s.spots.length;
    s.moved = true;
    s.glide += 1;
    put(s.spots[k].x, s.spots[k].y);
    const mark = baseRef.current?.querySelectorAll('.mkx')[k];
    const ring = ringRef.current;
    if (ring && mark) {
      ring.setAttribute('aria-valuenow', String(k + 1));
      ring.setAttribute('aria-valuetext', `${mark.firstChild?.textContent ?? ''}, ${CHECKS[s.spots[k].c - 1].title}`);
    }
  };

  const onRingDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = st.current;
    s.moved = true;
    s.glide += 1;
    e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = local(e);
    s.drag = [s.px - x, s.py - y];
    e.preventDefault();
  };
  const onRingMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (!s.drag) return;
    const [x, y] = local(e);
    put(x + s.drag[0], y + s.drag[1]);
  };
  const onRingStop = () => {
    st.current.drag = null;
  };
  const onLtMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const s = st.current;
    if (e.pointerType !== 'mouse' || s.drag) return;
    s.moved = true;
    s.glide += 1;
    const [x, y] = local(e);
    put(x, y);
  };
  const onRingKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    if (!d) return;
    e.preventDefault();
    jump(nearest() + d);
  };

  useEffect(() => {
    const lt = ltRef.current;
    const ring = ringRef.current;
    const base = baseRef.current;
    if (!lt || !ring || !base) return undefined;
    const s = st.current;
    const still = reducedMotion();
    let alive = true;
    if (window.matchMedia('(hover: none)').matches && hintRef.current) hintRef.current.textContent = 'Táhněte lupu po textu';

    const measure = () => {
      const l = lt.getBoundingClientRect();
      const rel = (q: DOMRect) => [q.left - l.left, q.top - l.top, q.right - l.left, q.bottom - l.top];
      s.rad = ring.offsetWidth / 2;
      s.spots = [...base.querySelectorAll<HTMLElement>('.mkx')].map((m) => {
        const b = rel(m.getBoundingClientRect());
        return { c: Number(m.dataset.c), x: (b[0] + b[2]) / 2, y: (b[1] + b[3]) / 2, r: [...m.getClientRects()].map(rel) };
      });
    };
    const home = () => {
      measure();
      if (!s.spots.length) return;
      if (s.moved) put(s.px, s.py);
      else put(s.spots[0].x, s.spots[0].y);
    };
    const glide = (tx: number, ty: number, ms: number, id: number) =>
      new Promise<boolean>((done) => {
        const x0 = s.px;
        const y0 = s.py;
        const t0 = performance.now();
        const tick = (t: number) => {
          if (!alive || id !== s.glide) {
            done(false);
            return;
          }
          const p = Math.min(1, (t - t0) / ms);
          const k = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
          put(x0 + (tx - x0) * k, y0 + (ty - y0) * k);
          if (p < 1) requestAnimationFrame(tick);
          else done(true);
        };
        requestAnimationFrame(tick);
      });
    const tour = async () => {
      s.moved = true;
      s.glide += 1;
      const id = s.glide;
      for (const sp of s.spots) {
        if (!(await glide(sp.x, sp.y, 800, id))) return;
        await new Promise((r) => setTimeout(r, 500));
        if (!alive || id !== s.glide) return;
      }
    };

    home();
    void document.fonts?.ready.then(() => alive && home());
    window.addEventListener('resize', home);
    let io: IntersectionObserver | null = null;
    if (!still && 'IntersectionObserver' in window && lt.parentElement) {
      io = new IntersectionObserver(
        (entries, o) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            o.disconnect();
            void tour();
          }),
        { threshold: 0.6 }
      );
      io.observe(lt.parentElement);
    }
    return () => {
      alive = false;
      s.glide += 1;
      io?.disconnect();
      window.removeEventListener('resize', home);
    };
    // lupa se sestaví jednou; put a ostatní obsluhy čtou stav z refu
  }, []);

  return (
    <>
      <div className="paper smp">
        <div className="lt" ref={ltRef} onPointerMove={onLtMove}>
          <div className="base" ref={baseRef}>
            <Sample />
          </div>
          <div className="over" aria-hidden="true">
            <Sample />
          </div>
          <div
            className="ring"
            ref={ringRef}
            role="slider"
            tabIndex={0}
            aria-label="Lupa nad textem, šipkami přeskakujete mezi místy"
            aria-valuemin={1}
            aria-valuemax={11}
            aria-valuenow={1}
            onPointerDown={onRingDown}
            onPointerMove={onRingMove}
            onPointerUp={onRingStop}
            onPointerCancel={onRingStop}
            onKeyDown={onRingKey}
          />
        </div>
      </div>
      <p className="hint2" ref={hintRef}>
        Posouvejte lupu po textu
      </p>
      <ol className="leg" ref={legRef}>
        {CHECKS.map((c, i) => (
          <li key={c.title}>
            <b>{i + 1}</b>
            <div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
