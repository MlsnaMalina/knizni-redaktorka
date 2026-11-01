/**
 * Síť v Knihovně (model Uzly): knihy sedí na uzlech kosočtverečné sítě. Filtr vybrané knihy zvětší, ostatní vyblednou
 * a vybrané knihy propojí jedna souvislá mátová linka (nejkratší strom). U stojanu je ciferník: dílek pro každou knihu
 * z aktuálního výběru (podle data, nejnovější nahoře), modrá značka ukazuje knihu na stojanu.
 * Rozložení a třídy řídí React, tady se jen měří poloha obálek a kreslí SVG.
 */
import type { Book } from '../data/books';
import { stamp } from './books';
import { reducedMotion } from './hooks';

const NS = 'http://www.w3.org/2000/svg';

export interface LibraryModel {
  order: readonly Book[];
  /** Je zapnutý filtr (vybrané knihy jsou zvětšené). */
  filtered: boolean;
  match: (b: Book) => boolean;
  current: Book;
  /** Šířka knihy na stojanu a mezera mezi obálkami v px. */
  bookW: number;
  gap: number;
}

export interface LibraryDom {
  v: HTMLElement;
  stage: HTMLElement;
  netSvg: SVGSVGElement;
  linksSvg: SVGSVGElement;
  dialSvg: SVGSVGElement;
}

export interface LibraryNet {
  setModel: (m: LibraryModel) => void;
  /** Po změně filtru: přepočítá síť a rozjede plynulé přeskládání (first = polohy před změnou). */
  applyFilter: (first: Map<Element, DOMRect> | null) => void;
  /** Po výběru jiné knihy (dir 1 = Další a výběr z výlohy, -1 = Předchozí). */
  select: (dir: number) => void;
  /** Po změně šířky výlohy. */
  relayout: () => void;
  destroy: () => void;
}

interface Center {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Attrs = Record<string, string | number>;

export function createLibraryNet(dom: LibraryDom, model0: LibraryModel): LibraryNet {
  const { v, stage, netSvg, linksSvg, dialSvg } = dom;
  let model = model0;
  let base: [number, number][] = [];
  let stubs: [number, number, number][] = [];
  let links: [number, number][] = [];
  let markA = 0;
  let dialA = 0;
  let dialN = 0;
  let hand: SVGElement | null = null;
  let dialG: SVGElement | null = null;
  let followId = 0;
  let resizeTimer = 0;
  let linkTimer = 0;
  let destroyed = false;

  const covers = new Map<number, HTMLElement>();
  v.querySelectorAll<HTMLElement>('.cv').forEach((e) => covers.set(Number(e.dataset.id), e));

  const el = (tag: string, attrs: Attrs, parent: Element): SVGElement => {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, val]) => e.setAttribute(k, String(val)));
    parent.appendChild(e);
    return e;
  };

  // vrstvy sítě
  netSvg.replaceChildren();
  linksSvg.replaceChildren();
  const defs = el('defs', {}, netSvg);
  const mask = el('mask', { id: 'u-m', maskUnits: 'userSpaceOnUse' }, defs);
  const revealC = el('circle', { class: 'reveal', fill: '#fff' }, mask);
  const pFaint = el('path', { class: 'faint', mask: 'url(#u-m)' }, netSvg);
  const pBase = el('path', { class: 'base', mask: 'url(#u-m)' }, netSvg);
  const pNode = el('path', { class: 'node' }, netSvg);
  const gLinks = el('g', {}, linksSvg);

  const isBig = (i: number) => model.filtered && model.match(model.order[i]);
  const key = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);
  const byDate = () => model.order.filter(model.match).sort((a, b) => stamp(b, true) - stamp(a, true));

  /** Středy obálek: konečné rozložení, nebo okamžitá poloha během přeskládání. */
  function centers(live: boolean): Center[] {
    const vb = live ? v.getBoundingClientRect() : null;
    const out: Center[] = [];
    for (const b of model.order) {
      const e = covers.get(b.id);
      if (!e) return [];
      if (vb) {
        const r = e.getBoundingClientRect();
        out.push({ x: r.left - vb.left + r.width / 2, y: r.top - vb.top + r.height / 2, w: r.width, h: r.height });
      } else {
        out.push({ x: e.offsetLeft + e.offsetWidth / 2, y: e.offsetTop + e.offsetHeight / 2, w: e.offsetWidth, h: e.offsetHeight });
      }
    }
    return out;
  }

  // ---------- uzly: kniha = uzel kosočtverečné sítě ----------
  function graph() {
    const P = centers(false);
    base = [];
    stubs = [];
    links = [];
    if (!P.length) return;
    const g = model.gap;
    const one = P.find((_, i) => !isBig(i)) ?? P[0];
    const pitch = Math.hypot(one.w + g, one.h + g);
    const E = new Map<string, [number, number]>();
    P.forEach((p, i) => {
      ([[1, 1], [1, -1], [-1, 1], [-1, -1]] as const).forEach(([sx, sy]) => {
        let best = -1;
        let bd = Infinity;
        P.forEach((q, j) => {
          if (i === j) return;
          const dx = (q.x - p.x) * sx;
          const dy = (q.y - p.y) * sy;
          if (dx < 4 || dy < 4) return;
          const k = dx / dy;
          if (k < 0.3 || k > 3) return;
          const d = Math.hypot(dx, dy);
          if (d < bd) {
            bd = d;
            best = j;
          }
        });
        const lim = pitch * (isBig(i) || (best >= 0 && isBig(best)) ? 2.2 : 1.35);
        if (best >= 0 && bd <= lim) E.set(key(i, best), [i, best]);
        else {
          // volný konec sítě jen na vnějším okraji výlohy (ne do stojanu)
          const ex = p.x + sx * (p.w / 2 + g * 1.6);
          const ey = p.y + sy * (p.h / 2 + g * 1.6);
          if (ex < 0 || ey < 0 || ex > v.clientWidth || ey > v.clientHeight) stubs.push([i, sx, sy]);
        }
      });
    });
    base = [...E.values()];
    if (!model.filtered) return;
    // vybrané knihy propojí jedna souvislá linka (nejkratší strom); roste od knihy nejblíž stojanu
    const S = model.order.map((_, i) => i).filter((i) => model.match(model.order[i]));
    if (!S.length) return;
    const sx = stage.offsetLeft + stage.offsetWidth / 2;
    const sy = stage.offsetTop + stage.offsetHeight / 2;
    const dist = (i: number, j: number) => Math.hypot(P[j].x - P[i].x, P[j].y - P[i].y);
    const toStage = (i: number) => Math.hypot(P[i].x - sx, P[i].y - sy);
    const root = S.reduce((a, i) => (toStage(i) < toStage(a) ? i : a), S[0]);
    const best = new Map<number, { d: number; from: number }>(S.filter((j) => j !== root).map((j): [number, { d: number; from: number }] => [j, { d: dist(root, j), from: root }]));
    while (best.size) {
      let jm = -1;
      let dm = Infinity;
      best.forEach((val, j) => {
        if (val.d < dm) {
          dm = val.d;
          jm = j;
        }
      });
      const from = best.get(jm)?.from ?? root;
      links.push([from, jm]);
      best.delete(jm);
      best.forEach((val, j) => {
        const dd = dist(jm, j);
        if (dd < val.d) best.set(j, { d: dd, from: jm });
      });
    }
  }

  function drawUzly(live: boolean) {
    const P = centers(live);
    if (!P.length) return;
    const g = model.gap;
    const L = (a: Center, bx: number, by: number) => `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`;
    const ci = model.order.indexOf(model.current);
    let d = '';
    let f = '';
    let nd = '';
    base.forEach(([i, j]) => {
      const s = L(P[i], P[j].x, P[j].y);
      if (i === ci || j === ci) nd += s;
      if (model.filtered && (!model.match(model.order[i]) || !model.match(model.order[j]))) f += s;
      else d += s;
    });
    stubs.forEach(([i, sx, sy]) => {
      const p = P[i];
      f += L(p, p.x + sx * (p.w / 2 + g * 1.6), p.y + sy * (p.h / 2 + g * 1.6));
    });
    pBase.setAttribute('d', d);
    pFaint.setAttribute('d', f);
    pNode.setAttribute('d', nd);
  }

  function drawLinks() {
    if (destroyed) return;
    gLinks.classList.remove('on');
    gLinks.replaceChildren();
    if (!links.length) return;
    const P = centers(false);
    if (!P.length) return;
    const step = Math.min(0.08, 1.8 / links.length);
    links.forEach(([i, j], k) => {
      const len = Math.ceil(Math.hypot(P[j].x - P[i].x, P[j].y - P[i].y)) + 1;
      el('line', { class: 'link', x1: P[i].x.toFixed(1), y1: P[i].y.toFixed(1), x2: P[j].x.toFixed(1), y2: P[j].y.toFixed(1), style: `--len:${len}px;--d:${(k * step).toFixed(2)}s` }, gLinks);
    });
    gLinks.getBoundingClientRect();
    requestAnimationFrame(() => gLinks.classList.add('on'));
  }

  /** Během přeskládání se síť kreslí podle okamžité polohy obálek. */
  function follow(ms: number) {
    const id = ++followId;
    const t0 = performance.now();
    const tick = (now: number) => {
      if (destroyed || id !== followId) return;
      if (now - t0 < ms) {
        drawUzly(true);
        requestAnimationFrame(tick);
      } else drawUzly(false);
    };
    requestAnimationFrame(tick);
  }

  /** Síť se při načtení rozprostře od stojanu ven. */
  function placeReveal() {
    const W = v.clientWidth;
    const H = v.clientHeight;
    const cx = stage.offsetLeft + stage.offsetWidth / 2;
    const cy = stage.offsetTop + stage.offsetHeight / 2;
    [['x', -60], ['y', -60], ['width', W + 120], ['height', H + 120]].forEach(([k, val]) => mask.setAttribute(String(k), String(val)));
    revealC.setAttribute('cx', String(cx));
    revealC.setAttribute('cy', String(cy));
    revealC.setAttribute('r', String(Math.hypot(W, H) + 60));
    revealC.style.setProperty('--o', `${cx}px ${cy}px`);
  }

  // ---------- ohnisko u stojanu: dílek na ciferníku = kniha, modrá značka = kniha na stojanu ----------
  // Při výběru jiné knihy jede značka po směru hodinových ručiček na její místo a ciferník se otočí o stejný úhel
  // proti směru (Předchozí jede zpět).
  function drawDial() {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const sb = stage.querySelector<HTMLElement>('.stage-book');
    if (!sb) return;
    const bh = model.bookW * 1.42;
    const cx = sb.offsetLeft + sb.offsetWidth / 2;
    const cy = sb.offsetTop + sb.offsetHeight - bh / 2;
    const r = Math.min(W / 2 - 12, bh * 0.62);
    const N = Math.max(1, dialN);
    const o = `--o:${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    const P = (deg: number, rr: number) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    };
    dialSvg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    dialSvg.replaceChildren();
    dialG = el('g', { class: 'sd-dial', style: `${o};transform:rotate(${dialA}deg)` }, dialSvg);
    el('circle', { class: 'sd-ring', cx, cy, r: r - 16 }, dialG);
    el('circle', { class: 'sd-ring', cx, cy, r: r + 26 }, dialG);
    let d = '';
    for (let k = 0; k < N; k++) d += `M${P((k * 360) / N, r)}L${P((k * 360) / N, r + (N <= 24 || k % 5 === 0 ? 9 : 4))}`;
    el('path', { class: 'sd-tick', d }, dialG);
    hand = el('g', { class: 'sd-hand', style: `${o};transform:rotate(${markA}deg)` }, dialSvg);
    const ra = r + 17;
    const w = Math.max(3, Math.min(7, 150 / N));
    el('path', { class: 'sd-mark', d: `M${P(-w, ra)}A${ra} ${ra} 0 0 1 ${P(w, ra)}` }, hand);
  }

  function aimDial(b: Book, dir: number) {
    const list = byDate();
    if (list.length !== dialN) {
      dialN = list.length;
      dialA = 0;
      drawDial();
      dialSvg.getBoundingClientRect();
    }
    if (!hand || !dialG) return;
    const target = (Math.max(0, list.indexOf(b)) * 360) / Math.max(1, dialN);
    let d = (((target - markA) % 360) + 360) % 360;
    if (dir < 0 && d) d -= 360;
    markA += d;
    dialA -= d;
    // stejný hodinový chod jako na úvodu: oba pohyby zároveň, stejně dlouho a pomalu
    const s = `${Math.min(5.2, 2.4 + Math.abs(d) * 0.0085).toFixed(2)}s`;
    hand.style.transitionDuration = s;
    dialG.style.transitionDuration = s;
    hand.style.transform = `rotate(${markA}deg)`;
    dialG.style.transform = `rotate(${dialA}deg)`;
  }

  /** Plynulé přeskládání (FLIP): z polohy před změnou do nové. */
  function flip(first: Map<Element, DOMRect>) {
    first.forEach((f, e) => {
      const l = e.getBoundingClientRect();
      if (!f.width || !l.width) return;
      const dx = f.left - l.left;
      const dy = f.top - l.top;
      const sx = f.width / l.width;
      const sy = f.height / l.height;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01) return;
      e.animate(
        [{ transformOrigin: '0 0', transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transformOrigin: '0 0', transform: 'none' }],
        { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' }
      );
    });
  }

  // ---------- start ----------
  graph();
  drawUzly(false);
  linkTimer = window.setTimeout(drawLinks, 0);
  placeReveal();
  aimDial(model.current, 1);
  void document.fonts?.ready.then(() => {
    if (destroyed) return;
    graph();
    drawUzly(false);
  });

  return {
    setModel(m) {
      model = m;
    },
    applyFilter(first) {
      const anim = first !== null && !reducedMotion();
      gLinks.classList.remove('on');
      gLinks.replaceChildren();
      graph();
      if (anim && first) flip(first);
      if (anim) follow(740);
      else drawUzly(false);
      window.clearTimeout(linkTimer);
      linkTimer = window.setTimeout(drawLinks, anim ? 560 : 0);
      aimDial(model.current, 1);
    },
    select(dir) {
      aimDial(model.current, dir);
      drawUzly(false);
    },
    relayout() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (destroyed) return;
        graph();
        drawUzly(false);
        drawLinks();
        placeReveal();
        drawDial();
      }, 150);
    },
    destroy() {
      destroyed = true;
      window.clearTimeout(resizeTimer);
      window.clearTimeout(linkTimer);
      netSvg.replaceChildren();
      linksSvg.replaceChildren();
      dialSvg.replaceChildren();
    },
  };
}
