import type { ReactNode } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { LEGAL_UPDATED } from '../data/site';
import './legal.css';

/** Společná kostra stránek Cookies a Zásady: prostý vystředěný text, bez rušivých prvků; updated = datum znění dané stránky. */
export function LegalPage({ title, lead, updated = LEGAL_UPDATED, children }: { title: string; lead: ReactNode; updated?: string; children: ReactNode }) {
  return (
    <div className="legal">
      <SiteHeader />
      <main>
        <article>
          <h1>{title}</h1>
          <p className="lead">{lead}</p>
          {children}
          <p className="upd">Platné od {updated}.</p>
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
