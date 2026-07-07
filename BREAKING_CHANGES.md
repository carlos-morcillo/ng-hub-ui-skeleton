# Breaking Changes — ng-hub-ui-skeleton

## [22.2.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-skeleton/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/skeleton/styles/...` instead of `dist/skeleton/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-skeleton/styles' as *;`

