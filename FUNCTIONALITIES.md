# Functionalities of Skeleton Library

This table details the functionalities of the `ng-hub-ui-skeleton` library and indicates which ones are covered by interactive examples.

The library ships one component, `hub-skeleton`, fed either by a named preset from the bundled catalogue or by an inline compact DSL template, plus the registry that resolves that catalogue.

## Component (`hub-skeleton`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Template source** | Bundled or registered preset (`preset`) | ✅ |
| | Inline compact DSL string (`template`) | ✅ |
| | Template definition object (`{ dsl, responsive }`) | ❌ |
| | Param interpolation (`params`) | ✅ |
| | Named preset variant (`variant`) | ✅ |
| **Appearance** | `default` tone | ✅ |
| | `subtle` tone | ✅ |
| | `contrast` tone | ✅ |
| | Shimmer animation toggle (`animated`) | ✅ |
| **Responsiveness** | Active breakpoint resolved from the viewport width (`base` / `sm` / `md` / `lg` / `xl`) | ✅ |
| | Breakpoint-specific DSL replacement (`responsive` map) | ❌ |
| **Accessibility** | `role="status"` / `aria-live="polite"` / `aria-busy="true"` contract | ❌ |
| | Custom accessible name (`ariaLabel`) | ✅ |
| | Placeholder shapes kept out of the accessibility tree (`aria-hidden`) | ❌ |
| **Failure modes** | Throws when neither `preset` nor `template` is set | ❌ |
| | Throws on an unknown preset name | ❌ |
| **SSR** | No viewport listener registered without a browser `window` | ❌ |

## Compact DSL

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Node types** | `line` | ✅ |
| | `block` | ✅ |
| | `circle` | ✅ |
| | `stack` | ✅ |
| | `grid` | ✅ |
| **Composition** | Nesting (`>`) | ✅ |
| | Siblings (`+`) | ✅ |
| | Repeat (`*N`) | ✅ |
| | Preset alias used as a node (`list-item*4`) | ✅ |
| | Inline variant selector (`card@compact`) | ❌ |
| **Modifiers** | `width` / `height` / `size` | ✅ |
| | `radius` | ✅ |
| | `gap` | ✅ |
| | `columns` | ✅ |
| | `align` / `justify` | ✅ |
| | `direction:row` | ✅ |
| | `grow` | ❌ |
| **Values** | `{{param}}` interpolation | ✅ |
| | Responsive tokens (`1\|md=2\|lg=3`) | ✅ |
| | Valueless modifier defaulting to `true` | ❌ |

> The `grow` modifier is read as the literal string `true`, so `grow:1` — the form every bundled preset and every example writes — leaves the node without `flex: 1 1 auto`.

## Preset catalogue

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Content surfaces** | `card` | ✅ |
| | `detail-view` | ✅ |
| | `profile-summary` | ✅ |
| | `search-result` | ✅ |
| | `feed-item` | ✅ |
| | `kanban-card` | ✅ |
| | `empty-state-skeleton` | ✅ |
| **Lists and tables** | `list-item` | ✅ |
| | `table-row` | ✅ |
| | `table-toolbar` | ✅ |
| | `filter-bar` | ✅ |
| | `master-detail` | ✅ |
| **Dashboards** | `dashboard-widget` | ✅ |
| | `stat-card` | ✅ |
| | `chart-panel` | ✅ |
| **Forms** | `form-section` | ✅ |
| **Variants** | `card` → `compact` | ✅ |
| | `list-item` → `compact` | ✅ |

## Programmatic registration

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Providers** | App-wide registration with `provideHubSkeletonPresets(presets)` | ❌ |
| | Direct `HUB_SKELETON_PRESETS` multi-provider | ✅ |
| | Later presets overriding earlier ones by `name` | ❌ |
| | Catalogue scoped to a subtree by providing `HubSkeletonPresetRegistryService` there | ✅ |
| **Registry** | `presets` signal with the merged catalogue | ❌ |
| | `getPreset(name)` | ❌ |
| **Preset contract** | `defaults` merged before interpolation | ✅ |
| | `variants` with their own `template` / `defaults` | ✅ |
| | `description` used by docs | ❌ |

## Styling

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **CSS Variables** | `--hub-skeleton-bg` | ✅ |
| | `--hub-skeleton-highlight` | ✅ |
| | `--hub-skeleton-radius` | ✅ |
| | `--hub-skeleton-gap` | ✅ |
| | `--hub-skeleton-animation-duration` | ✅ |
| **Sass** | `hub-skeleton-theme()` mixin | ✅ |
| **Structure** | BEM classes (`hub-skeleton__node`, `--surface`, `--line`, `--block`, `--circle`, `--stack`, `--grid`) | ❌ |
| | Per-node `--hub-skeleton-node-*` properties written by the renderer | ❌ |

## Packaging

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Imports** | Standalone `HubSkeletonComponent` | ✅ |
| | `HubSkeletonModule` wrapper for module-based apps — deprecated, removed in 23.0.0 | ❌ |
| **Styles** | `@use 'ng-hub-ui-skeleton/styles'` theming entry | ✅ |

---

_Note: ✅ indicates an active interactive example or playground control is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._
