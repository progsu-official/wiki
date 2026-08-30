# progsu Wiki — working context

The site is the progsu (Georgia State University programming club) wiki. Everything here is built for GSU students breaking into the industry.

## North star

**Calm, user-first, inviting — never overwhelming.** A first-time visitor should feel pulled in and at ease, not faced with choices to evaluate. If a screen feels noisy, the screen is wrong, not the user.

A user-first site is recognizable by what isn't there. **Reduce, don't add.**

## How to approach work

- **UI before data.** Build the screen first; let the data shape emerge from what the UI actually needs. Backend conforms to UX, not the other way around. Stub data lives inline in the page or component that needs it — no premature `types/`, `data/`, or `lib/` folders.
- **Progressive disclosure over walls of options.** Show the 80% case first. Hide the rest behind a quiet expander. Eight checkboxes in a sidebar is a failure state.
- **Inform, don't block.** Trust the user. Schedule conflicts get a soft warning, not a prevention. Confirmation modals are reserved for genuinely destructive actions.
- **Persistence is polish, not foundation.** Make the interaction feel good first. localStorage/backend wiring comes after the UX is settled.
- **Don't build for hypothetical needs.** No "future-proof" abstractions, no half-finished scaffolding, no scenarios that can't happen.

## Voice and copy

- Lowercase headlines, italic accents (e.g. *"find your next semester."*).
- Plain sentences. No jargon. No marketing voice. No emoji.
- Reassuring, not cute. Warm, not chirpy.
- Empty states encourage, never scold (*"star courses while browsing — they'll show up here."* not *"no saved courses"*).

## Visual language

Existing tokens live in [src/styles/global.css](src/styles/global.css). Use them — don't introduce new colors, fonts, or spacing values.

- **Theme:** light by default, dark via the `dark` class on `<html>`. Every color comes from a `--c-*` token so both themes work. Never hardcode `#fff`/`#000` for a surface or text.
- **One contrast trap:** `--c-brand-1` on `--c-bg-mute` is 4.41:1 in dark — just under AA. Nothing pairs them today; use `--c-text-1`/`--c-text-2` on mute surfaces.
- **The gradient is a special occasion.** `--grad-brand` (`#3d2377` → `#141021`) is only ever used full-bleed, on a `.brand-band`. Ordinary accents use the solid ramp (`--c-brand-1/2/3`) so long reading pages stay calm. Inside a band, text uses `--c-text-inverse-*`.
- **Surfaces:** flat. `--c-bg-soft` fill, `--c-divider` hairline, `--shadow-*` for elevation. No glass, no blur. (`.surface-glass` survives only as a compat alias for a flat card.)
- **Type:** Inter everywhere, 600 for headings. Mono (`--font-mono`) only for genuinely technical strings — course codes, CRNs, times, counts.
- **Whitespace:** generous. Spacing scale tokens (`--space-*`) only.
- **Motion:** soft fades and 2px hover lifts, never harsh snaps or bouncy transitions.
- **Color is never the only signal.** Pair every colored indicator with text, icon, or shape.
- **Code blocks are dark in both themes.** One Shiki theme (`vitesse-dark`), language label from the transformer in `astro.config.mjs`.

## Existing building blocks (reuse before creating)

**Global classes** in [global.css](src/styles/global.css) — reach for these before writing CSS: `.container`, `.divider`, `.brand-band`, `.brand-text`, `.btn` (`--brand/--alt/--ghost/--lg/--sm`), `.card` (`--link`, `__title`, `__text`, `__icon`), `.badge` (`--brand/tip/warning/danger/info`), `.prose`, `.callout`, `.sr-only`, `.skel`.

**Layouts**
- [Layout.astro](src/layouts/Layout.astro) — the shell: head, theme bootstrap, navbar, footer, search modal. Props `title`, `description`, `wide`, `fullBleed`.
- [DocsLayout.astro](src/layouts/DocsLayout.astro) — the three-column docs shell. Use it for every guide page; it supplies the sidebar, the "on this page" rail, the mobile drawer, and prev/next + edit-on-github. Props `title`, `description`, `headings`, `editSlug`, `updated`.

**Components**
- [PageHeader.astro](src/components/PageHeader.astro) — `title` + `intro` for index pages, `title` + `meta` + `tags` for articles
- [CategoryCard.astro](src/components/CategoryCard.astro) / [FeatureCard.astro](src/components/FeatureCard.astro) — feature cards (near-duplicates; consolidate when either is next touched)
- [GuideCard.astro](src/components/GuideCard.astro), [Badge.astro](src/components/Badge.astro), [Callout.astro](src/components/Callout.astro), [Breadcrumb.astro](src/components/Breadcrumb.astro)
- [Sidebar.astro](src/components/Sidebar.astro), [Aside.astro](src/components/Aside.astro), [DocFooter.astro](src/components/DocFooter.astro) — docs chrome, driven by [guideNav.ts](src/lib/guideNav.ts)
- [Navbar.astro](src/components/Navbar.astro), [ThemeToggle.astro](src/components/ThemeToggle.astro), [Footer.astro](src/components/Footer.astro), [SiteSearch.astro](src/components/SiteSearch.astro)

**Sidebar order** is curated in [guideNav.ts](src/lib/guideNav.ts). A new vault guide appears automatically at the end of its category; add it to `ORDER` to place it deliberately. The same flat order drives prev/next and the category listings.

Check `src/components/` before building new components. Extend existing ones with variant props before forking.

## Quality-of-life patterns to keep

- `/` keyboard shortcut focuses search from anywhere
- `?` opens the shortcut help dialog (there are no `g <letter>` shortcuts; they were documented but never implemented)
- Visible focus rings on every interactive element
- Loading skeletons matched to final layout (no spinners, no layout shift)
- Undo toasts for any removal action (5-second window)
- All interactive elements reachable by Tab in visual order

## Audience

Writing for GSU students — many first-gen, many self-taught, many anxious about breaking into tech. They are smart but new. Don't condescend; don't assume. Frame everything as *"here's how"* not *"you should already know."*

## Local vault preview

Guides are symlinks from `src/content/guides/` into the `vault` submodule.

- `./scripts/vault-local.sh --dev` renders unpushed `../vault` commits on localhost — it fetches the sibling clone over the filesystem, never GitHub. `--reset` restores the normal checkout.
- The script is untracked (`/scripts/` is in `.git/info/exclude`), so it is machine-local and absent from fresh clones.
- While previewing, `git status` shows `modified: vault (new commits)`. Don't commit that pointer — it references a commit that isn't on the vault remote.

## Things to avoid

- Adding features, refactors, or abstractions beyond what was asked
- Designing data models before the screen exists
- Walls of filters, dense option grids, multi-step forms
- Modals or confirmations for low-stakes actions
- Cute copy, marketing voice, exclamation points
- New design tokens, fonts, or color values
- Running `npm run fmt` without checking `.prettierignore` — `src/content/guides/*` symlinks into the vault submodule
- Comments that explain what well-named code already says
- Documentation files (`.md`) unless explicitly requested

## When in doubt

Pick the calmer option. Pick fewer options. Pick more whitespace. Pick the version that respects the user's attention.
