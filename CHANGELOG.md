# Changelog

## [22.3.1] - 2026-09-07

### Fixed

- **Both READMEs stop presenting six internal DSL helpers as part of the API.** They listed
  `parseHubSkeletonDsl`, `interpolateHubSkeletonParams`, `resolveTemplateDsl`,
  `resolveResponsiveToken`, `resolveBreakpointFromWidth` and `resolveHubSkeletonNodes` as
  exported, and `public-api.ts` has never re-exported the module that declares them — so a
  reader who followed the documentation and imported one got a build error from a package that
  had promised the symbol in writing. They stay internal: a layout is written as a template
  string and handed to the component or registered as a preset, so nothing outside the package
  has to call them, and keeping them private is what lets the grammar grow without breaking
  anybody. The sentence now names only what the package actually exports.

## [22.3.0] - 2026-09-06

### Added

- **`FUNCTIONALITIES.md`**, the coverage table the rest of the family ships: which parts of the
  component, the DSL, the preset catalogue, the registry and the styling surface a live example
  actually demonstrates, and which are only prose. Nothing stated it before, so a reader had to
  open the documentation site and infer it.

### Changed

- **One preset registry is shared again, instead of one per placeholder.** The component listed
  `HubSkeletonPresetRegistryService` in its own `providers`, so every `<hub-skeleton>` on screen
  built a private instance and merged the sixteen bundled presets into a fresh `Map` — a screen
  with twenty placeholders did that twenty times — while the README described the service as the
  `providedIn: 'root'` singleton a consumer who injects it actually gets. The component now
  resolves the root instance. **This changes where custom presets are read from**: see
  `BREAKING_CHANGES.md`.

- **Both READMEs teach the canonical `ng-hub-ui-skeleton/styles` entry for the theming mixin.**
  They still reached for `ng-hub-ui-skeleton/styles/mixins/skeleton-theme`, the deep path — it
  resolves, but it is not the entry 22.2.0 introduced and not what `BREAKING_CHANGES.md`, the
  mixin's own header and the generated mixin reference all show, so a reader comparing two sources
  had to guess which one was current.

### Deprecated

- **`HubSkeletonModule`, marked for removal in 23.0.0.** The class described itself as "kept for
  compatibility with module-based Angular apps" but carried no `@deprecated` tag, so neither an
  editor nor the build warned anyone it was on its way out. It now says so. The module imports and
  exports `HubSkeletonComponent` and provides nothing of its own, so importing the component
  directly is the whole migration; custom presets go through `provideHubSkeletonPresets()`, which
  never travelled through the module either. See `BREAKING_CHANGES.md`.

### Fixed

- **The `ariaLabel` input is finally reachable by assistive technology.** The container carried
  `role="presentation"` and `aria-label` at once — a conflict that costs the name whichever way a user
  agent resolves it — while every placeholder shape inside is `aria-hidden`, so nothing was left to carry
  the name either. A consumer setting the input, or relying on its non-empty default, got silence and had
  to announce the loading state from an outer element of their own. The container is now a polite
  `role="status"` region with `aria-busy="true"`, matching `ng-hub-ui-loading`, and keeps the label as its
  accessible name.

- **The `styles` subpath the docs prescribe is now declared in the manifest `exports`.** Since 22.2.0 the
  stylesheets have shipped at `styles/`, and both the README and `BREAKING_CHANGES.md` tell consumers to
  reach them with `@use 'ng-hub-ui-skeleton/styles'`. The generated exports map declared only `.` and
  `./package.json`, so anything that enforces the map — Node subpath resolution, Sass's `pkg:` importer,
  bundlers that honour `exports` — refused the very import the documentation teaches. An Angular CLI build
  happened to survive because it resolves bare Sass specifiers through `loadPaths` instead, which is why
  the block went unnoticed. The theming entry and the `skeleton-theme` mixin are now declared explicitly,
  as the sibling libraries already do.

## [22.2.4] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.2.3] - 2026-08-17

### Fixed

- **The package shipped without its licence notice.** `package.json` declared MIT, but no `LICENSE` file travelled in the tarball — and MIT itself requires the copyright notice to be included in distributions. The notice ships now.

## [22.2.2] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.2.1] - 2026-07-28

### Added

- Comprehensive test suite for the skeleton DSL parser and preset registry: full grammar coverage (node types, nesting, siblings, props, variants, multipliers, responsive tokens), every parser error path with its exact message, preset expansion/override/variant resolution, and component render round-trips. No runtime changes.

## [22.2.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-skeleton/styles`.** The theme mixin now builds to `dist/skeleton/styles/...` (was `dist/skeleton/src/lib/styles/...`), so `@use 'ng-hub-ui-skeleton/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

## [22.1.0] - 2026-06-24

### Added

- New **`hub-skeleton-theme()` Sass mixin** (`styles/mixins/skeleton-theme`) — theme the loading placeholders in one call: base / highlight surfaces (the shimmer gradient), corner radius, node gap and shimmer speed. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-skeleton-*` overrides. Token-based, no Bootstrap dependency. (A skeleton is a neutral placeholder — there is no semantic colour variant; per-node sizes still come from the template DSL / presets.) The five theming tokens (`--hub-skeleton-bg` / `-highlight` / `-radius` / `-gap` / `-animation-duration`) are now documented in the design-token reference.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## 0.1.1 - 2026-06-14

- Replaced the deprecated `ngStyle` directive with the native `[style]` binding (Angular soft-deprecated `ngStyle`/`ngClass` in November 2024 in favour of native bindings, for better performance and smaller bundles).

## 0.1.0 - 2026-04-14

- Added the initial dynamic skeleton component for Angular.
- Added a compact Emmet-like DSL with preset composition and repeat support.
- Added responsive property values, variants, and programmatic preset registration.
- Added the first preset catalogue for cards, lists, tables, forms, dashboards, and empty states.
