# Changelog

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
