# مشوارك · me4warak

**اعرف المطلوب قبل ما تروح.**

An Arabic-first web app that tells someone in Egypt exactly what they need
before they head out to a government office: which documents to bring, which
office handles it, and what the route looks like — plus a community layer for
keeping that information current.

Hackathon prototype. Frontend only, no backend, no accounts, no tracking.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # tsc -b && vite build
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
```

---

## Stack

| Concern    | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| Framework  | React 19 + TypeScript                                   |
| Build      | Vite 7                                                  |
| Routing    | react-router-dom 7                                      |
| Map        | Leaflet + react-leaflet, OpenStreetMap tiles            |
| Styling    | Plain CSS with custom properties (no UI/CSS framework)  |
| Fonts      | IBM Plex Sans Arabic + IBM Plex Sans (Google Fonts)     |
| State      | React context + `localStorage`                          |

Five dependencies total. The design system in `style.md` is expressed directly
as CSS custom properties, so no Tailwind or component library was needed.
Leaflet is lazy-loaded, so the map bundle (~46 kB gzipped) is only fetched on
pages that actually render a map.

---

## Routes

| Route                   | What it is                                                      |
| ----------------------- | --------------------------------------------------------------- |
| `/`                     | Home — value proposition, search, categories, how it works       |
| `/services`             | Full catalogue: live search, category filters, grouped browsing |
| `/services/:serviceId`  | Service detail: checklist, route, place + map, community         |
| `/about`                | What the data is, what it is not, privacy                        |
| `*`                     | Arabic 404                                                       |

`/services` keeps `?q=` and `?category=` in the URL, so searches and filters
are shareable and survive back/forward navigation.

---

## The data

`data.json` at the repo root is the **single source of truth** and is imported
directly by `src/lib/services.ts` — there is no second copy to drift out of
sync. It contains 10 services across 5 categories and 55 documents.

`src/lib/services.ts` normalises it once at module load:

- Single-stage services and multi-stage services (`steps[]`, e.g.
  نقل ملكية السيارة) are flattened into a common `stages[]` shape, so one set of
  components renders both.
- `additional_documents` become conditional documents with their `condition`
  rendered as a badge.
- A lowercased, diacritic-folded search index is built per service so
  «الاسكندريه» matches «الإسكندرية» and «رخصه» matches «رخصة».

Small amounts of derived metadata live beside the dataset, each in one file:

- `src/data/categories.ts` — colour tone + icon per category (join key is the
  Arabic category name from `data.json`).
- `src/data/authorities.ts` — which office handles each category, plus search
  aliases. Every office name is either stated in `data.json` itself
  («السجل المدني», «وحدة المرور», «إدارة المرور», «الشهر العقاري»,
  «مكتب الصحة») or is the standard Egyptian authority for that document.
- `src/data/areas.ts` — 14 Alexandria districts with approximate district-centre
  coordinates, used to centre the map.

### What this app deliberately does **not** contain

No fees, opening hours, processing times, waiting times, branch addresses,
usage statistics, testimonials, or "verified by" claims — none of that is in the
provided dataset, and inventing it would send someone to an office with wrong
information.

Instead:

- The service page has an explicit **«معلومات مش متوفرة عندنا»** panel that
  lists fees / hours / processing time / waiting time as
  *«غير محددة في بياناتنا»*, with a button to contribute the real value. The
  gap is surfaced as a product feature rather than papered over.
- The community layer starts **empty**. There are no seeded contributions and no
  fake "84 people confirmed this" counters. Every number in the community panel
  comes from contributions actually submitted in that browser.
- The map shows **district centres**, not invented office pins.
  «عرض الاتجاهات» builds a real Google Maps / OpenStreetMap search query for
  *office + district + الإسكندرية*, which is genuinely useful and claims nothing
  false.
- Homepage counters (10 / 5 / 55) are computed from the dataset at runtime.
- A disclaimer — «منصة إرشادية مستقلة — تأكد من المتطلبات قبل الزيارة» and
  «مشوارك ليست جهة حكومية» — appears on the home page, the about page, and in
  the footer of every page.

---

## Arabic / RTL

- `<html lang="ar" dir="rtl">` by default; the language toggle rewrites both.
- All layout CSS uses **logical properties** (`margin-inline`, `inset-inline-start`,
  `border-start-start-radius`, …), so RTL and LTR share one stylesheet with no
  mirrored overrides.
- Directional icons flip via `.icon--flip`, scoped to `:root[dir='rtl']`.
- Body line-height is 1.8 for Arabic and no `letter-spacing` is ever applied to
  Arabic text.
- **Arabic counting is done properly** (`src/lib/format.ts`): «مستند واحد»,
  «مستندين», «5 مستندات», «11 مستند» — singular, dual, 3–10 plural, 11+
  singular. Same for خدمات / نتائج / تصنيفات / مساهمات.
- The UI chrome is bilingual (Arabic default, English toggle), but **service
  content stays Arabic** — translating official document names would risk
  changing their meaning. Dataset content carries `dir="rtl"` (`AR_CONTENT` in
  `src/lib/format.ts`) so it still lays out correctly inside the English LTR
  UI, and mixed strings use `dir="auto"`.
- On desktop the information panel is on the **right** and the map on the
  **left**, as specified for an RTL interface.

---

## Design system

`src/styles/tokens.css` is a direct transcription of `style.md`: Nile teal
brand ramp, papyrus/sand backgrounds, Egyptian gold / red / blue / family-teal
category accents, typography and border colours. Nothing outside that palette
is used.

Category tones are applied with a single `data-tone` attribute that sets
`--tone-strong` / `--tone-bg` / `--tone-soft` / `--tone-border` for everything
nested inside it — following `style.md`'s mapping of gold to personal
documents, red to travel, blue to traffic, and family teal to family services.

Dark mode is derived from the same Deep Nile family (`:root[data-theme='dark']`)
and persists in `localStorage`.

The logo is used as supplied artwork, never re-created with a font. Four
variants were cropped from `logo.jpeg` into `public/brand/`:

| File                          | Used for                                   |
| ----------------------------- | ------------------------------------------ |
| `logo-wordmark.png`           | Header (tagline would be illegible at 40px) |
| `logo-lockup.png`             | Footer + about page (includes the tagline)  |
| `logo-wordmark-inverse.png`   | Header in dark mode                        |
| `logo-lockup-inverse.png`     | Dark footer                                 |
| `logo-mark.png`               | Favicon                                     |

The gold hairline in `.eyebrow` and the faint gold dot field behind the hero
echo the dashes in the wordmark — the only decorative flourishes in the app.

---

## Structure

```
data.json                  provided dataset — imported directly, single source of truth
style.md                   provided design system
logo.jpeg                  provided artwork (cropped into public/brand/)
prompt.md                  provided product brief
public/brand/              logo variants derived from logo.jpeg
scripts/smoke.mjs          optional Playwright smoke test (see below)
src/
  components/              Header, Footer, Logo, Button, Badge, Icon, SearchBar,
                           ServiceCard, CategoryCard, DocumentChecklist,
                           StepsTimeline, ServiceExtras, MapView, ServiceTabs,
                           AreaSelector, PlacePanel, CommunityPanel,
                           ContributionCard, ContributionModal, Modal,
                           SettingsPopover, Breadcrumbs, EmptyState, Notice,
                           ToastRegion
  context/AppContext.tsx   language, theme, district, geolocation, contributions, toasts
  data/                    categories, authorities, Alexandria districts
  hooks/                   useChecklist, useMediaQuery, useDocumentTitle
  i18n/strings.ts          ar/en UI strings with {placeholder} interpolation
  lib/                     services (normalise + search), journey, community,
                           distance, format, links, storage, types
  pages/                   Home, Services, ServiceDetail, About, NotFound
  styles/                  tokens, base, components, layout, pages, map
```

One icon set (`components/Icon.tsx`, 33 inline SVGs) replaces an icon
dependency.

---

## Interactions

- **Search** — instant, debounced 180 ms, folds Arabic orthographic variants,
  matches service names, document names and details, offices, notes and
  colloquial aliases («سواقة», «باسبور», «ضاع»). Loading, empty and no-results
  states included.
- **Document checklist** — tap to tick, progress bar and `«2 من 11 جاهزين»`
  counter, completion notice, reset. Persisted per service in `localStorage`.
- **Map** — click a district marker to select it; the view flies to it and the
  panel switches to «المكان». «استخدم موقعي» asks for browser geolocation only
  on an explicit tap and, if granted, labels the nearest district using the
  Haversine formula computed in the browser. Denied or unsupported permission
  falls back to manual selection with a clear message. If tiles fail to load
  the map degrades to a labelled fallback and the rest of the page keeps working.
- **Community** — anonymous contributions (6 types, structured waiting-time
  buckets), confirm/dispute with one vote per anonymous browser id, status
  promotion at configurable thresholds (`reported → supported ≥ 10 → verified ≥ 50`
  in `src/lib/community.ts`). A confidence percentage only appears once there
  are at least 3 votes, so a single self-confirmation never renders as "100%".
- **Settings** — theme, language, district, reset. Reachable from the header on
  every page.
- **Print** — «اطبع القائمة» prints just the service content; nav, map, tabs and
  footer are hidden.

---

## Privacy

No accounts, no analytics, no tracking, no third-party calls except
OpenStreetMap tiles and Google Fonts. Nothing about the device or environment is
read. Everything persisted (`me4warak:*` in `localStorage`) is created by the
user inside the app: theme, language, chosen district, checklist ticks, and
their own contributions under a random `crypto.randomUUID()` id. Geolocation is
requested only on an explicit tap, used in-browser to rank districts, and never
stored or transmitted. «ابدأ من جديد» in settings clears all of it.

---

## Accessibility

Semantic landmarks (`header` / `main` / `footer` / `nav` / `section`), a skip
link, one `h1` per page with an ordered heading hierarchy, labelled inputs,
`aria-pressed` / `aria-selected` / `aria-expanded` on toggles, arrow-key
navigation and roving tabindex on the service tabs, a focus-trapped modal that
restores focus on close, `aria-live` on search results and toasts, visible focus
rings on every interactive element, alt text on the logo, and status always
carried by text rather than colour alone. `prefers-reduced-motion` disables
transitions.

---

## Testing

`npm run build` and `npm run typecheck` both pass clean (TypeScript strict,
`noUnusedLocals`, `noUnusedParameters`).

`scripts/smoke.mjs` drives the running dev server in a real browser across
desktop (1440), tablet (820) and mobile (390) viewports, exercising search, the
no-results state, the checklist, district selection, directions links, the
contribution flow, voting, dark mode, the English toggle, the mobile menu and
the 404 — while collecting console errors, page errors, failed requests and
horizontal-overflow measurements, and writing screenshots to `scripts/shots/`.

It needs Playwright, which is intentionally **not** a project dependency:

```bash
npm install --no-save playwright
npx playwright install chromium
npm run dev            # in one terminal
node scripts/smoke.mjs # in another
```

Last run: all flows pass, zero console/page errors, no horizontal overflow at
any viewport.

---

## Known limitations

- Coverage is Alexandria only, as scoped in `prompt.md`. `src/data/areas.ts` is
  a flat list, so adding governorates is additive.
- No fees, hours or waiting times, by design — see *What this app deliberately
  does not contain*.
- Community contributions live in `localStorage`, so they are per-browser. The
  data shape in `src/lib/types.ts` matches what an API would return, and the
  duplicate-vote rule (`unique(contribution_id, contributor_id)`) is already
  enforced client-side against the anonymous id.
- Journey steps are derived structurally from the documents, offices and
  requirements in the dataset. No generic bureaucratic step list was invented to
  make the timeline look longer.
