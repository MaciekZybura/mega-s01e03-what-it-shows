# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

---

## Added 2026-10-30 · #4471 split into its problems

- `src/routes/kb/incidents/4471-what-it-holds/+page.svx` — a signed page: what #4471 really holds (three problems, not one), with counts computed at render time.
- `src/lib/kb/split.ts`, `src/lib/kb/SplitTable.svelte` — the logic behind that page (runs `causes.ts` plus `desk-notes.json`).
- `rendered/` — the kb built as a static site, so the page can be read as the desk will see it: `rendered/kb/incidents/4471-what-it-holds.html` (and the screenshots `4471-what-it-holds.jpg`, `4471-what-it-holds-2.jpg`).
- Tickets, one per problem, are this repo's issues: #1 parser (379 reports, the desk's own count; closed: fixed), #2 hint (33; closed: won't fix, form retired), #3 one-day move (5, footnoted inside parser; closed with #4471).

Build: `npm install && npm run build` (SvelteKit + mdsvex, static adapter; output in `build/`).
