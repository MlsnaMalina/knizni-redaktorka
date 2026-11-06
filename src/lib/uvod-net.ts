/**
 * Síť na pozadí Úvodu: jedna vrstva SVG přes celou stránku. Kreslí se podle skutečné polohy částí (.scene):
 * ohnisko kolem knihy na stojanu (ciferník se 12 místy, modrá značka ukazuje vybranou knihu)
 * a prošívání za výzvou na konci. Znovu se kreslí při změně velikosti stránky.
 */
const NS = 'http://www.w3.org/2000/svg';
/** Ciferník má 12 míst po 30°: 12 nejnovějších knih, nejnovější nahoře. */
const SLOTS = 12;

type Attrs = Record<string, string | number>;

interface Box {
  width: number;
  height: number;
  cy: number;
}

interface SceneInfo {
  i: number;
  el: HTMLElement;
  side: string;
  top: number;
  h: number;
  contentTop: number;
  contentBottom: number;
  focus: Box;
}

interface Ctx {
  W: number;
  mobile: boolean;
  defs: SVGDefsElement;
  el: (tag: string, attrs?: Attrs, parent?: Element) => SVGElement;
  mask: (id: string) => SVGMaskElement;
}

export interface UvodNet {
  /** Kniha s daným pořadím (0 = nejnovější) je na stojanu: značka jede po směru hodin, ciferník proti směru. */
  select: (index: number) => void;
  destroy: () => void;
}

const polar = (cx: number, cy: number) => (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
};

export function createUvodNet(main: HTMLElement, svg: SVGSVGElement): UvodNet {
  let markA = 0; // modrá značka: úhel od 12 hodin, roste po směru hodin
  let dialA = 0; // ciferník: otáčí se proti směru hodin
  let hand: SVGElement | null = null;
  let dial: SVGElement | null = null;
  let groups: SVGElement[] = [];
  let lastSig = '';
  let destroyed = false;
  let timer = 0;
  const seen = new Map<number, number>();

  const measure = (): SceneInfo[] => {
    const m = main.getBoundingClientRect();
    return [...main.querySelectorAll<HTMLElement>('.scene')].map((el, i) => {
      const box = el.getBoundingClientRect();
      const flow = [...el.children].filter((c) => getComputedStyle(c).position !== 'absolute').map((c) => c.getBoundingClientRect());
      const focusEl = el.querySelector<HTMLElement>('[data-focus]');
      const f = (focusEl ?? el).getBoundingClientRect();
      return {
        i,
        el,
        side: el.dataset.side ?? '',
        top: box.top - m.top,
        h: box.height,
        contentTop: Math.min(...flow.map((r) => r.top)) - m.top,
        contentBottom: Math.max(...flow.map((r) => r.bottom)) - m.top,
        focus: { width: f.width, height: f.height, cy: (f.top + f.bottom) / 2 - m.top },
      };
    });
  };

  // --- ohnisko: kruhy, ciferník s dílky a modrá značka ---
  const focusDial = (c: Ctx, s: SceneInfo, g: SVGElement) => {
    const { W, mobile } = c;
    const cx = W / 2;
    const cy = Math.round(s.focus.cy);
    const o = `--o:${cx}px ${cy}px`;
    const P = polar(cx, cy);
    const fg = c.el('g', { class: 'focus', style: o }, g);
    // kolotoč na telefonu (data-flow): jen kruhy; dílky a značku nahrazují dílky pod kolotočem, takže se nic neotáčí
    const flow = s.el.dataset.flow !== undefined;
    const rings = c.el('g', { class: 'dial', style: `${o};transform:rotate(${dialA}deg)` }, fg);
    if (!flow) dial = rings;
    const half = Math.min(s.focus.width, s.focus.height) / 2;
    const step = mobile ? 22 : 32;
    const r0 = Math.round(half * 0.6);
    const reach = Math.min(mobile ? W * 0.75 : 600, s.h * 0.48);
    for (let r = r0; r < reach; r += step) {
      const t = (r - r0) / (reach - r0);
      c.el('circle', { class: 'ln ring', cx, cy, r, style: `--a:${(0.1 * (1 - t) ** 1.6).toFixed(3)}` }, rings);
    }
    if (flow) return;
    const rt = Math.round(half + (mobile ? 14 : 22));
    let d = '';
    let dh = '';
    for (let a = 0; a < 360; a += 6) {
      if (a % 30 === 0) dh += `M${P(a, rt)}L${P(a, rt + 10)}`;
      else d += `M${P(a, rt)}L${P(a, rt + 4)}`;
    }
    c.el('path', { class: 'ln tick', d }, rings);
    c.el('path', { class: 'ln tick h', d: dh }, rings);
    hand = c.el('g', { class: 'hand', style: `${o};transform:rotate(${markA}deg)` }, fg);
    const ra = rt + 18;
    c.el('path', { class: 'ln mark', d: `M${P(-7, ra)}A${ra} ${ra} 0 0 1 ${P(7, ra)}` }, hand);
  };

  // --- prošívání za výzvou na konci: měkké pole kolem textu ---
  const ctaQuilt = (c: Ctx, s: SceneInfo, g: SVGElement) => {
    const { W, mobile } = c;
    const add = c.el;
    const dw = mobile ? 34 : 54;
    const dh = mobile ? 44 : 70;
    const rg = add('radialGradient', { id: 'q-g', cx: '.42', cy: '.4', r: '.62' }, c.defs);
    [['0', 0], ['.55', 0], ['1', 0.045]].forEach(([off, a]) => add('stop', { offset: off, 'stop-color': '#000', 'stop-opacity': a }, rg));
    const pat = add('pattern', { id: 'q-p', width: dw, height: dh, patternUnits: 'userSpaceOnUse' }, c.defs);
    const dia = (x: number, y: number) => `${x},${y - dh / 2} ${x + dw / 2},${y} ${x},${y + dh / 2} ${x - dw / 2},${y}`;
    [[dw / 2, dh / 2], [0, 0], [dw, 0], [0, dh], [dw, dh]].forEach(([x, y]) => add('polygon', { points: dia(x, y), fill: 'url(#q-g)' }, pat));
    add('path', { class: 'stitch', d: `M0 ${dh / 2}L${dw / 2} 0L${dw} ${dh / 2}L${dw / 2} ${dh}Z` }, pat);
    const fg = add('radialGradient', { id: 'z-f' }, c.defs);
    [['0', '#fff'], ['.5', '#fff'], ['1', '#000']].forEach(([off, col]) => add('stop', { offset: off, 'stop-color': col }, fg));
    const mk = c.mask('z-m');
    add('rect', { x: 0, y: s.top, width: W, height: s.h, fill: 'url(#z-f)' }, mk);
    add('rect', { class: 'quilt', x: 0, y: s.top, width: W, height: s.h, fill: 'url(#q-p)', mask: 'url(#z-m)' }, g);
  };

  const render = () => {
    if (destroyed) return;
    const W = main.clientWidth;
    const H = main.offsetHeight;
    const scenes = measure();
    const sig = [W, H, ...scenes.map((s) => [s.top, s.h, s.contentTop, s.contentBottom, s.focus.cy].map(Math.round).join(','))].join('|');
    if (sig === lastSig) return;
    lastSig = sig;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('width', String(W));
    svg.setAttribute('height', String(H));
    svg.style.height = `${H}px`;
    svg.replaceChildren();
    const el = (tag: string, attrs: Attrs = {}, parent: Element = svg): SVGElement => {
      const e = document.createElementNS(NS, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, String(v)));
      parent.appendChild(e);
      return e;
    };
    const defs = el('defs') as SVGDefsElement;
    const ctx: Ctx = {
      W,
      mobile: W < 700,
      defs,
      el,
      mask: (id) => el('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs) as SVGMaskElement,
    };
    hand = null;
    dial = null;
    groups = scenes.map((s) => {
      const g = el('g', { 'data-i': s.i });
      if (s.side === 'center') focusDial(ctx, s, g);
      if (s.el.id === 'zaver') ctaQuilt(ctx, s, g);
      return g;
    });
    // části viděné dávno: hned hotové; právě se kreslící: animace začne znovu
    const now = performance.now();
    const fresh: SVGElement[] = [];
    groups.forEach((g, i) => {
      const at = seen.get(i);
      if (at === undefined) return;
      if (now - at < 2500) fresh.push(g);
      else g.classList.add('on');
    });
    svg.getBoundingClientRect();
    fresh.forEach((g) => g.classList.add('on'));
  };

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const i = Number((e.target as HTMLElement).dataset.i);
        if (!e.isIntersecting || seen.has(i)) return;
        seen.set(i, performance.now());
        groups[i]?.classList.add('on');
      }),
    { threshold: 0.2 }
  );
  main.querySelectorAll<HTMLElement>('.scene').forEach((el, i) => {
    el.dataset.i = String(i);
    io.observe(el);
  });

  const later = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(render, 120);
  };
  render();
  const ro = new ResizeObserver(later);
  ro.observe(main);
  void document.fonts?.ready.then(later);

  return {
    select(index) {
      const target = (index % SLOTS) * 30;
      const d = (((target - markA) % 360) + 360) % 360;
      if (!d) return;
      markA += d;
      dialA -= d;
      // hodinový strojek: značka a ciferník jedou zároveň, stejně dlouho a pomalu; delší cesta trvá déle
      const s = `${Math.min(5.2, 2.4 + d * 0.0085).toFixed(2)}s`;
      ([[hand, markA], [dial, dialA]] as const).forEach(([el, a]) => {
        if (!el) return;
        el.style.transitionDuration = s;
        el.style.transform = `rotate(${a}deg)`;
      });
    },
    destroy() {
      destroyed = true;
      window.clearTimeout(timer);
      io.disconnect();
      ro.disconnect();
      svg.replaceChildren();
    },
  };
}
