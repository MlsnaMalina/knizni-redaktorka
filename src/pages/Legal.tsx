import type { ReactNode } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { LEGAL_UPDATED } from '../data/site';
import './legal.css';

/** Společná kostra stránek Cookies a Zásady: prostý vystředěný text, bez rušivých prvků. */
export function LegalPage({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <div className="legal">
      <SiteHeader />
      <main>
        <article>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
          {children}
          <p className="upd">Platné od {LEGAL_UPDATED}.</p>
        </article>
      </main>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
