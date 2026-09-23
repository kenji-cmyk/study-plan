# StudyPlanner UI extension

Mode: Operate. Extend PRODUCT.md and DESIGN.md. English remains the incumbent interface language. Existing React components, API contracts and weighted scheduling behavior remain authoritative.

## Direction contract

THESIS: Make the path from subjects to a usable month visible. Home leads to the next action; subject and plan libraries expose search, detail and recovery.

OWN-WORLD: Poppins, cloud paper, white surfaces, navy text and restrained sky blue. Pill controls, 8px spacing rhythm and soft 16px surfaces inherit DESIGN.md. Darker semantic text and the existing deep-blue token provide accessible contrast.

STORY: Add subjects, understand relative weights, generate a month, inspect days, then explicitly save. Explain beside the save action that the saved arrangement can differ from the preview.

FIRST VIEWPORT: Sticky navigation above a two-column home introduction: heading and create-plan action left, actual current-month agenda or honest empty state right. The subject index uses a search toolbar and open rows; the planner pairs configuration with a month workspace.

FORM: Extension of the pinned study-planning world; no replacement-world seed. Calendar-to-day selection is the signature interaction. Mobile navigation wraps and the schedule becomes an agenda with full names. State transitions use 150–250ms opacity/transform with reduced-motion support.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Boundaries

No invented metrics or marketing claims. Search uses existing server filters. Plans are addressed by year/month because responses expose no ID. Preserve CRUD and authentication settings; improve semantics. Verify desktop, tablet, mobile, keyboard, empty/error/loading, long names, search, detail, preview/regeneration/save. No new raster assets required.

## Implementation notes

- Shipped hash routes: home (`#/`), subject search/filter/sort and CRUD (`#/subjects`), subject detail (`#/subjects/:id`), weighted random preview/regeneration/save (`#/create`), plan library (`#/plans`), and saved month detail (`#/plans/:year/:month`). Shared schedule views provide month-to-day selection, an agenda with full subject names, and subject/date filtering. Loading, empty, retry, validation, saved, and duplicate-month states explain the next action; the save message explains that the saved arrangement may differ from the preview.
- The planner stays mounted after its first visit, preserving settings and the random draft across routes while refreshing active-subject availability on return. Reloading or changing connection settings clears this in-memory draft; changing plan settings invalidates the preview.
- The 1140px content width, white/cloud-paper surfaces, navy ink, Poppins, pill controls, 8px spacing rhythm, soft borders, and ambient shadows retain the incumbent system. Tablet layouts stack secondary regions; at 640px and below navigation wraps, actions expand, and schedules initially open as an agenda. Subject tables retain contained horizontal scrolling. Long names wrap, dialogs scroll, mobile fields use 16px type, and reduced-motion preferences suppress animation.
- Narrow legibility adaptations support the WCAG 2.2 AA target: primary buttons use the incumbent deep blue (`#1668C4`, hover `#125BAD`); muted text uses `#526E83`, error ink `#B83232`, success ink `#087858`, and warning ink `#B45309` on semantic washes. Form boundaries are strengthened and keyboard focus is explicit. Poppins remains the only family; larger page/home headings establish the new surface hierarchy, while mobile input sizing improves readability. These implementation choices do not replace the pinned DESIGN.md token contract.
- Evidence checked: PRODUCT.md, DESIGN.md, `src/index.css`, `src/App.css`, routing, subject detail, generator, and shared schedule components. Finish evidence is recorded in `../.impeccable/review/*-final.png`; the implementation handoff reports desktop 1440px, tablet 768px, mobile 390px, and 320px overflow checks, clean frontend checks, 14 backend tests, and browser CRUD/search/preview/regeneration/save/conflict/retry flows against isolated Spring Boot H2. SQL Server integration remains unverified because Docker SQL Server was unavailable. English and Google Fonts delivery remain incumbent choices. No new shipping raster assets were introduced. PRODUCT.md and DESIGN.md are preserved; no design sidecar is created for this ordinary extension.
