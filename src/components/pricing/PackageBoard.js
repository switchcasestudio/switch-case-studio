import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as brandIdentity from "./spreads/brandIdentity";
import * as webDevelopment from "./spreads/webDevelopment";
import * as aiAutomation from "./spreads/aiAutomation";
import * as seoSearch from "./spreads/seoSearch";
import "../../styles/components/servicePoster.scss";
import "../../styles/components/packageBoard.scss";

/* Package board (2026-09-26, owner: "too much going on, we need a different
   way to compare the packages"). One cream brand-book sheet per SECTION of a
   service (Brand Identity has one; Web Development has the builds and the
   care plans): rows are the deliverables (a thumbnail of the tile art plus
   its name), columns are the packages with their price, a terra dot marks
   what each includes. Rows are grouped by the first package that has them,
   so the dots form a staircase and the comparison reads without a
   sentence; where the data grades a deliverable ("Basic", "Up to 5") the
   cell carries that note. The tier's own `includes` list stays the source
   of truth in a native <details> "Full list" per column, closed by default,
   no JS. A real <table>, so a screen reader gets row and column headers.
   Static, no motion.

   A service module exports
     SECTIONS  [{ id, title, unit, tiers: [names], rows: [{ id, label, Art,
               cells: { [tier]: true | "note" } }] }]
     TIERS     { [tier]: { for, process, examples: [{ slug, label }] } }
     NOTE      an optional line under the last board. */
const BOARDS = {
  "brand-identity": brandIdentity,
  "web-development": webDevelopment,
  "ai-development": aiAutomation,
  "marketing-advertisement": seoSearch,
};

export const hasPackageBoard = (serviceId) => Boolean(BOARDS[serviceId]);

// Package anchor: "Brand Starter Kit" -> "brand-starter-kit".
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Rows fall into groups by the tiers that have them: every tier reads
   "In every <unit>"; one tier alone "Only in <tier>" (the top of a ladder
   included: nothing is above it); a tier and everything above it
   "From <tier>"; any other mix names the tiers. A stable sort keeps
   the author's order inside a group; a row no tier lists is dropped. */
function groupRows({ tiers, rows, unit }) {
  const keyed = rows
    .map((row, i) => {
      const has = tiers.map((t) => Boolean(row.cells[t]));
      const first = has.indexOf(true);
      const count = has.filter(Boolean).length;
      const suffix = count === tiers.length - first;
      return { row, i, first, all: count === tiers.length, suffix, has };
    })
    .filter((k) => k.first !== -1)
    .sort((a, b) => a.first - b.first || Number(b.all) - Number(a.all) || a.i - b.i);
  const groups = [];
  keyed.forEach((k) => {
    let label;
    if (k.all) label = `In every ${unit}`;
    else if (k.has.filter(Boolean).length === 1) label = `Only in ${tiers[k.first]}`;
    else if (k.suffix) label = `From ${tiers[k.first]}`;
    else label = tiers.filter((t, i) => k.has[i]).join(" and ");
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.rows.push(k.row);
    else groups.push({ label, rows: [k.row] });
  });
  return groups;
}

const Thumb = ({ Art }) => (
  <span className="pb__thumb">
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">
      <Art />
    </svg>
  </span>
);

function Board({ section, spec, formatPrice, note }) {
  const best = (t) => (t.badge ? " is-best" : "");
  const titleId = `pb-title-${section.id}`;
  const anyProcess = spec.some((t) => t.process && t.process.length);
  const anyExample = spec.some((t) => t.examples && t.examples.length);
  const groups = groupRows(section);

  return (
    <div className={`pb pg-animate${spec.length > 3 ? " pb--wide" : ""}`}>
      {/* The page's h2 for this board; the table is named by it. */}
      <h2 id={titleId} className="pb__caption">
        {section.title}
      </h2>
      <table className="pb__table" aria-labelledby={titleId}>
        <thead>
          <tr>
            <td className="pb__corner" />
            {spec.map((t) => (
              <th key={t.name} id={slug(t.name)} data-tier={slug(t.name)} scope="col" className={`pb__head${best(t)}`}>
                {t.badge && <span className="pb__badge">{t.badge}</span>}
                <span className="pb__name">{t.name}</span>
                <span className="pb__price">
                  {formatPrice(t.price)}
                  <span className="pb__price-note">{t.billing === "monthly" ? "per month" : "one-time"}</span>
                </span>
                {t.for && <span className="pb__for">{t.for}</span>}
              </th>
            ))}
          </tr>
        </thead>
        {groups.map((g) => (
          <tbody key={g.label} className="pb__group">
            <tr className="pb__group-row">
              <th scope="rowgroup" colSpan={spec.length + 1}>
                {g.label}
              </th>
            </tr>
            {g.rows.map(({ id, label, Art, cells }) => (
              <tr key={id} className="pb__row">
                <th scope="row" className="pb__item">
                  <span className="pb__item-inner">
                    <Thumb Art={Art} />
                    <span className="pb__label">{label}</span>
                  </span>
                </th>
                {spec.map((t) => {
                  const cell = cells[t.name];
                  return (
                    <td key={t.name} data-tier={slug(t.name)} className={`pb__cell${best(t)}`}>
                      {cell && (
                        <span className="pb__dot">
                          <span className="pb__sr">Included</span>
                        </span>
                      )}
                      {typeof cell === "string" && <span className="pb__note">{cell}</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        ))}
        <tfoot>
          {anyProcess && (
            <tr className="pb__row pb__row--text">
              <th scope="row" className="pb__item pb__item--text">
                How we get there
              </th>
              {spec.map((t) => (
                <td key={t.name} data-tier={slug(t.name)} className={`pb__cell pb__cell--text${best(t)}`}>
                  {(t.process || []).map((line) => (
                    <span key={line} className="pb__line">
                      {line}
                    </span>
                  ))}
                </td>
              ))}
            </tr>
          )}
          {/* A shipped case study whose scope matches the package: the proof
              a per-package page would exist for, without the page. */}
          {anyExample && (
            <tr className="pb__row pb__row--text">
              <th scope="row" className="pb__item pb__item--text">
                Seen in
              </th>
              {spec.map((t) => (
                <td key={t.name} data-tier={slug(t.name)} className={`pb__cell pb__cell--text${best(t)}`}>
                  {(t.examples || []).map((ex) => (
                    <Link key={ex.slug} to={`/projects/${ex.slug}`} className="pb__example">
                      {ex.label}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  ))}
                </td>
              ))}
            </tr>
          )}
          <tr className="pb__row pb__row--text">
            <th scope="row" className="pb__item pb__item--text">
              In full
            </th>
            {spec.map((t) => (
              <td key={t.name} data-tier={slug(t.name)} className={`pb__cell pb__cell--text${best(t)}`}>
                <details className="pb__full" data-tier={slug(t.name)}>
                  <summary>Full list</summary>
                  <ul>
                    {t.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </details>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
      {note && <p className="pb__foot">{note}</p>}
    </div>
  );
}

export default function PackageBoard({ serviceId, tiers, formatPrice }) {
  const board = BOARDS[serviceId];
  const rootRef = useRef(null);

  /* Deep links: /pricing/<service>#<package>. The column head carries the
     id in the static HTML, so the browser lands on it with no JS; after
     hydration the whole column lights up (`is-target` on every cell that
     shares the `data-tier`) and that package's full list opens. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const apply = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      root.querySelectorAll(".is-target").forEach((el) => el.classList.remove("is-target"));
      if (!id) return;
      root.querySelectorAll(`[data-tier="${id}"]`).forEach((el) => el.classList.add("is-target"));
      const full = root.querySelector(`details[data-tier="${id}"]`);
      if (full) full.open = true;
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [serviceId]);

  if (!board) return null;
  const byName = Object.fromEntries(tiers.map((t) => [t.name, t]));
  const sections = board.SECTIONS.map((section) => ({
    section,
    // Data tier + board meta, in the section's order; a name the data no
    // longer has is skipped rather than rendered empty.
    spec: section.tiers.filter((n) => byName[n]).map((n) => ({ ...byName[n], ...(board.TIERS[n] || {}) })),
  })).filter((s) => s.spec.length);

  return (
    <div className="pb-wrap" ref={rootRef}>
      {sections.map((s, i) => (
        <Board
          key={s.section.id}
          section={s.section}
          spec={s.spec}
          formatPrice={formatPrice}
          note={i === sections.length - 1 ? board.NOTE : null}
        />
      ))}
    </div>
  );
}
