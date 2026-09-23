# UI verification — 23 September 2026

## Scope and result

Implemented the home, subject search/directory and details, saved-plan search/library and details, and weighted random planner. Shared navigation, dialogs, feedback, loading, empty, error and responsive layouts use the existing React/API architecture.

Impeccable finish review returned **ship for all five reviewed fixes**: preview continuity, document overflow, tablet calendar legibility, mobile heading whitespace, and mobile navigation. This verdict scores that fix list, not a claim of exhaustive accessibility certification. One material-fix batch and one final visual verification round were used.

## Checks run

- `npm run build`: TypeScript and Vite production build passed. JS 247.60 kB / 75.64 kB gzip; CSS 33.96 kB / 6.88 kB gzip.
- `npm run lint`: passed with no warnings.
- `mvn.cmd -q test`: 14 tests passed, zero failures/errors/skips.
- `git diff --check`: passed (Windows line-ending notices only).
- Actual Chromium browser: create, edit, delete and duplicate-code validation; search by name/code; status filters, pagination and reset; subject details; plan search and empty results; preview, regenerate, save, saved detail, month-conflict recovery; plan subject/day filters; API error and retry.
- Deterministic request fixtures: delayed loading, zero-subject empty state and disabled generation/save, temporary server failure. These fixtures were browser-only and removed after each check.
- Keyboard: dialog initial focus, Escape dismissal, restored launcher focus, delete Cancel as initial focus, Tab/Shift+Tab.
- Preview → subject detail → browser Back: rendered schedule is identical; the draft stays mounted across routes. Retained draft plus saved-plan detail has no duplicate DOM IDs.
- Desktop 1440px, tablet 768px, mobile 390px: full-page visual inspection. Document width equals viewport width. Subject directory additionally checked at 320px.
- Long subject names exercised in subject tables; detail layouts use wrapping. Reduced-motion styles preserve static feedback and remove movement.

The Impeccable detector ran once. Its only four findings concern semantic toast accent borders, explicitly prescribed by DESIGN.md and retained as an intentional exception. The independent initial audit scored 15/20 before the five fixes; no new whole-surface numerical score is claimed after the verdict pass.

## Evidence

Final screenshots are retained locally under `../.impeccable/review/`:

- `home-desktop-final.png`, `home-mobile-final.png`, `home-tablet-final.png`
- `subjects-desktop-final.png`, `subjects-mobile-final.png`, `subject-form-mobile-final.png`
- `planner-desktop-final.png`, `planner-mobile-final.png`, `planner-tablet-final.png`
- `plans-desktop-final.png`, `plans-mobile-final.png`

## Environment and remaining limits

Browser integration used the actual Spring Boot API with an isolated in-memory H2 database, not fabricated application responses for the successful paths. SQL Server/Docker was unavailable; production database integration was not verified. Synthetic study data exists only in that temporary database.

Use `http://localhost:3000` for local development: the incumbent backend CORS configuration allows this origin. `127.0.0.1:3000` GETs work but mutations are rejected by that existing policy.

The interface remains English. Poppins still uses the existing Google Fonts delivery with a system fallback. In-memory previews survive navigation but not a full page reload. Saving intentionally generates a new random arrangement, as disclosed beside the action. No deployment or database migration was performed.
