const districts = [
  {
    id: "chawl-mohalla",
    name: "Chawl Mohalla",
    domain: "Where you wake up. Budgeting.",
    npc: "Maya didi · neighbour",
    color: "var(--color-terracotta)",
    glyph: "🏘️",
  },
  {
    id: "bank-bazaar",
    name: "Bank Bazaar",
    domain: "Old banks, FD ladders, savings.",
    npc: "CA Lakshmi aunty",
    color: "var(--color-saffron)",
    glyph: "🏦",
  },
  {
    id: "karyalaya-park",
    name: "Karyalaya Park",
    domain: "Office work, EPF, your first tax.",
    npc: "HR Sunita · onboarding",
    color: "var(--color-mint)",
    glyph: "🏢",
  },
  {
    id: "niveshak-chowk",
    name: "Niveshak Chowk",
    domain: "The exchange. Equity, MF, SIP.",
    npc: "Karthik bhai · broker",
    color: "var(--color-rose-dust)",
    glyph: "📈",
  },
  {
    id: "rakshak-lane",
    name: "Rakshak Lane",
    domain: "Insurance, emergencies, protection.",
    npc: "Asha aunty · agent (the good kind)",
    color: "var(--color-saffron-bright)",
    glyph: "🛡️",
  },
  {
    id: "vyapaar-mandi",
    name: "Vyapaar Mandi",
    domain: "Side hustles. Chai stalls. Unit economics.",
    npc: "Bansal seth · landlord-friend",
    color: "var(--color-terracotta)",
    glyph: "🏪",
  },
  {
    id: "bhavishya-ghat",
    name: "Bhavishya Ghat",
    domain: "The riverbank. NPS, retirement, estate.",
    npc: "Grandma · keeper of stories",
    color: "var(--color-ink-muted)",
    glyph: "🛶",
  },
];

export function DistrictMap() {
  return (
    <section
      className="relative border-t border-white/5 px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="districts-h"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-saffron)]">
            The seven districts
          </span>
          <h2
            id="districts-h"
            className="mt-3 font-display text-3xl font-medium leading-tight sm:text-5xl"
          >
            A city you actually live in.
          </h2>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            You start in <span className="text-[var(--color-ink)]">Chawl Mohalla</span>,
            where rent is ₹4,800 and the chai is ₹10. Cross the bridge to{" "}
            <span className="text-[var(--color-ink)]">Bank Bazaar</span> when you're
            ready and CA Lakshmi aunty will explain why an FD ladder is not, in fact,
            a real ladder. Each district teaches one domain. You unlock the next by
            <em className="italic"> showing </em>
            you can live in this one — not by waiting, not by paying.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <li
              key={d.id}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-[var(--color-bg-2)] p-6 transition hover:-translate-y-0.5 hover:border-white/25"
            >
              <div className="flex items-start justify-between">
                <div
                  aria-hidden
                  className="pixel-edge grid h-10 w-10 place-items-center rounded text-xl"
                  style={{ background: d.color, color: "var(--color-indigo-night)" }}
                >
                  {d.glyph}
                </div>
                <span className="font-mono text-[10px] text-[var(--color-ink-muted)]/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-medium">
                {d.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                {d.domain}
              </p>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-[var(--color-ink-muted)]/80">
                <span aria-hidden>—</span>
                <span>{d.npc}</span>
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity group-hover:opacity-30"
                style={{ background: d.color }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
