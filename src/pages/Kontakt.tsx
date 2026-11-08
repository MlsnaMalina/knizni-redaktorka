import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ICO, LINKEDIN, MAIL, SAMPLE_PARAM, SAMPLE_VALUE } from '../data/site';
import { cx, nb } from '../lib/format';
import { reducedMotion, usePageMeta } from '../lib/hooks';
import { SiteHeader } from '../components/SiteHeader';
import './kontakt.css';

/* Formulář odesílá přes FormSubmit (AJAX endpoint). Po zřízení domény
   přepnout adresu na katerina@knizniredaktorka.cz a aktivovat potvrzovacím
   e-mailem (FormSubmit pošle aktivační zprávu při prvním odeslání). */
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/k.mlsnova@seznam.cz';

const GDPR = 'Odesláním souhlasíte se zpracováním údajů pro účely odpovědi na poptávku. S textem i údaji nakládám důvěrně.';
const CLOSING =
  'Pokud si nejste jistí, jestli je váš text pro tento typ spolupráce vhodný, klidně se ozvěte i tak. Společně ujasníme, co dává smysl řešit a co už ne.';
const SEND_ERROR = 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo mi napište přímo na e-mail.';
const SAMPLE = 'Ukázkovou redakci';
// ukázková redakce je až poslední možnost (přání Kateřiny); slovo zdarma tu být nemá, ukázka je po dohodě (5. 11. 2026)
const INTENTS = ['Cenovou nabídku', 'Redakční konzultaci', 'Jen se zeptat', SAMPLE];

type Kind = 'choice' | 'text' | 'area' | 'who' | 'sum';

interface Step {
  kind: Kind;
  q: string;
  hint?: string;
  msg?: string;
}

/** Průvodce: jedna otázka na obrazovku, průběh v pěti kolečkách, na konci shrnutí. */
const STEPS: Step[] = [
  { kind: 'choice', q: 'Co potřebujete?', msg: 'Vyberte prosím, co potřebujete.' },
  { kind: 'text', q: 'O jaký text jde?', hint: 'např. komentář, monografie, článek, diplomová, rigorózní nebo disertační práce, e-book, newsletter, AI draft…', msg: 'Doplňte prosím, o jaký text jde.' },
  { kind: 'area', q: 'Co od spolupráce očekáváte?', hint: 'V jaké je text fázi? Kdy přibližně potřebujete výstup?', msg: 'Napište prosím, co od spolupráce čekáte.' },
  { kind: 'who', q: 'Jak vás mám oslovit a kam odpovědět?' },
  { kind: 'sum', q: 'Zkontrolujte a odešlete' },
];

interface Answers {
  intent: string;
  text: string;
  msg: string;
  name: string;
  mail: string;
}

const EMPTY: Answers = { intent: '', text: '', msg: '', name: '', mail: '' };

type Status = 'idle' | 'sending' | 'done';

export default function Kontakt() {
  usePageMeta('kontakt');

  const [params] = useSearchParams();

  const [at, setAt] = useState(0);
  const [out, setOut] = useState(false);
  // tlačítka s ukázkovou redakcí vedou sem s ?zamer=ukazka: první otázka má volbu rovnou zaškrtnutou
  const [ans, setAns] = useState<Answers>(() => ({ ...EMPTY, intent: params.get(SAMPLE_PARAM) === SAMPLE_VALUE ? SAMPLE : '' }));
  const [err, setErr] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  // poslední hodnoty pro zpožděné obsluhy (klepnutí na volbu rovnou pokračuje)
  const ansRef = useRef(ans);
  const atRef = useRef(at);
  const pointer = useRef(false);
  const focusNext = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const honeyRef = useRef<HTMLInputElement>(null);
  const mailRef = useRef<HTMLAnchorElement>(null);

  const setAnswer = (key: keyof Answers, value: string) => {
    ansRef.current = { ...ansRef.current, [key]: value };
    setAns(ansRef.current);
  };

  // po přepnutí otázky se fokus přesune na první pole
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    stageRef.current?.querySelector<HTMLElement>('input.wi, textarea.wi')?.focus();
  }, [at]);

  const show = (to: number, focus = true) => {
    const draw = () => {
      atRef.current = to;
      focusNext.current = focus;
      setAt(to);
      setErr('');
      setOut(false);
    };
    if (reducedMotion()) {
      draw();
      return;
    }
    setOut(true);
    window.setTimeout(draw, 220);
  };

  const fail = (msg: string, selector: string) => {
    setErr(msg);
    stageRef.current?.querySelector<HTMLElement>(selector)?.focus();
  };

  const send = async () => {
    if (honeyRef.current?.value) return; // past na spam
    const a = ansRef.current;
    setStatus('sending');
    setErr('');
    const data = new FormData();
    data.set('Co potřebujete', a.intent);
    data.set('Jméno', a.name);
    data.set('E-mail', a.mail);
    data.set('O jaký text jde', a.text);
    data.set('Zpráva', a.msg);
    data.set('_subject', 'Nová poptávka z knizniredaktorka.cz');
    data.set('_template', 'table');
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('done');
    } catch {
      setStatus('idle');
      setErr(SEND_ERROR);
    }
  };

  const next = () => {
    if (status !== 'idle') return;
    const step = STEPS[atRef.current];
    const a = ansRef.current;
    if (step.kind === 'choice' && !a.intent) return fail(step.msg ?? '', 'input[name="intent"]');
    if (step.kind === 'text' && !a.text.trim()) return fail(step.msg ?? '', '#w-text');
    if (step.kind === 'area' && !a.msg.trim()) return fail(step.msg ?? '', '#w-msg');
    if (step.kind === 'who') {
      if (!a.name.trim()) return fail('Doplňte prosím jméno.', '#w-name');
      if (!/^\S+@\S+\.\S+$/.test(a.mail.trim())) return fail('Zadejte prosím platný e-mail.', '#w-mail');
    }
    if (step.kind === 'sum') return void send();
    return show(atRef.current + 1);
  };

  const onIntent = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer('intent', e.target.value);
    setErr('');
    if (pointer.current) {
      pointer.current = false;
      window.setTimeout(next, 260); // klepnutí rovnou pokračuje, šipky na klávesnici ne
    }
  };

  const onEnter = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.classList.contains('wi')) {
      e.preventDefault();
      next();
    }
  };

  const copyMail = () => {
    const fallback = () => {
      const el = mailRef.current;
      if (!el) return;
      const r = document.createRange();
      r.selectNodeContents(el);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(r);
    };
    const ok = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    (navigator.clipboard ? navigator.clipboard.writeText(MAIL) : Promise.reject(new Error('bez schránky'))).then(ok, fallback);
  };

  const step = STEPS[at];
  const done = status === 'done';

  return (
    <div className="kontakt">
      <SiteHeader over />
      <main>
        <section className="scene mdl quilt-bg" id="top" aria-labelledby="t-h">
          <div className="copy">
            <h1 id="t-h">Pošlete mi svůj text. Nebo jen otázku.</h1>
            <p className="lead">Odpovídám do 1–2&nbsp;pracovních dnů, první krok je zdarma.</p>
            <div className="actions">
              <a className="btn btn--fill" href="#pruvodce">
                Napsat zprávu
              </a>
            </div>
          </div>
        </section>

        <section className="scene mdl" id="pruvodce" aria-label="Napište mi">
          <div className="copy">
            <form className="wiz" noValidate onSubmit={(e) => e.preventDefault()}>
              <ol className="prog" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <li key={s.q} className={cx(done || i < at ? 'done' : i === at && 'cur')}>
                    {i + 1}
                  </li>
                ))}
              </ol>
              <div className={cx('stage', out && 'out')} ref={stageRef} aria-live="polite" onKeyDown={onEnter}>
                {done ? (
                  <div className="wst">
                    <svg className="ok" viewBox="0 0 64 64" aria-hidden="true">
                      <circle cx="32" cy="32" r="29" />
                      <path d="M19 33l9 9 17-20" />
                    </svg>
                    <h2 className="wq">Zpráva odeslána.</h2>
                    <p className="wh2">{nb('Děkuji, ozvu se vám do 1–2 pracovních dnů. Domluvíme si posouzení textu a případně i ukázkovou redakci 3–5 stran zdarma.')}</p>
                  </div>
                ) : (
                  <div className="wst" role="group" aria-labelledby="wq">
                    <h2 className="wq" id="wq">
                      {nb(step.q)}
                    </h2>
                    {step.kind === 'choice' && (
                      <div className="opts one" onPointerDown={(e) => (pointer.current = !!(e.target as HTMLElement).closest('label'))}>
                        {INTENTS.map((t) => (
                          <label key={t}>
                            <input type="radio" name="intent" value={t} checked={ans.intent === t} onChange={onIntent} />
                            <i />
                            <span>{nb(t)}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    {step.kind === 'text' && (
                      <>
                        <input
                          className="wi"
                          id="w-text"
                          type="text"
                          maxLength={200}
                          value={ans.text}
                          aria-describedby="w-h"
                          onChange={(e) => setAnswer('text', e.target.value)}
                        />
                        <p className="wh2" id="w-h">
                          {step.hint && nb(step.hint)}
                        </p>
                      </>
                    )}
                    {step.kind === 'area' && (
                      <>
                        <textarea className="wi" id="w-msg" maxLength={5000} value={ans.msg} aria-describedby="w-h" onChange={(e) => setAnswer('msg', e.target.value)} />
                        <p className="wh2" id="w-h">
                          {step.hint && nb(step.hint)}
                        </p>
                      </>
                    )}
                    {step.kind === 'who' && (
                      <>
                        <input
                          className="wi"
                          id="w-name"
                          type="text"
                          maxLength={120}
                          value={ans.name}
                          placeholder="jméno a příjmení"
                          autoComplete="name"
                          aria-label="Jméno"
                          onChange={(e) => setAnswer('name', e.target.value)}
                        />
                        <input
                          className="wi"
                          id="w-mail"
                          type="email"
                          maxLength={254}
                          value={ans.mail}
                          placeholder="e-mail"
                          autoComplete="email"
                          aria-label="E-mail"
                          onChange={(e) => setAnswer('mail', e.target.value)}
                        />
                      </>
                    )}
                    {step.kind === 'sum' && (
                      <>
                        <dl className="sum">
                          {(
                            [
                              ['Co potřebujete', ans.intent, 0],
                              ['O jaký text jde', ans.text, 1],
                              ['Co od spolupráce očekáváte', ans.msg, 2],
                              ['Jméno', ans.name, 3],
                              ['E-mail', ans.mail, 3],
                            ] as const
                          ).map(([k, v, g]) => (
                            <div key={k}>
                              <dt>{k}</dt>
                              <dd>{v}</dd>
                              <button type="button" onClick={() => show(g)}>
                                změnit
                              </button>
                            </div>
                          ))}
                        </dl>
                        <p className="gd">{nb(GDPR)}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <input ref={honeyRef} className="hp" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <p className="err" role="alert">
                {err}
              </p>
              <div className="wnav" hidden={done}>
                <button type="button" className="textlink" hidden={at === 0} onClick={() => show(at - 1)}>
                  Zpět
                </button>
                <button type="button" className="btn btn--fill" disabled={status === 'sending'} onClick={next}>
                  {status === 'sending' ? 'Odesílám…' : step.kind === 'sum' ? 'Odeslat zprávu' : 'Další'}
                </button>
              </div>
            </form>
            <p className="alt">
              {nb('Raději e-mail?')} <a href={`mailto:${MAIL}`}>{MAIL}</a>
            </p>
          </div>
        </section>

        <section className="scene mdl" id="primy" aria-label="Přímý kontakt">
          <div className="copy">
            <div className="direct">
              <p className="dl">Přímý kontakt</p>
              <a className="mail" ref={mailRef} href={`mailto:${MAIL}`}>
                {MAIL}
              </a>
              <p className="dm">
                <button type="button" className="textlink cp" onClick={copyMail}>
                  {copied ? 'Zkopírováno' : 'Zkopírovat adresu'}
                </button>
                <a className="textlink" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </p>
              <p className="di">IČO {ICO} · Pracuji online</p>
            </div>
            <p className="closing">{nb(CLOSING)}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
