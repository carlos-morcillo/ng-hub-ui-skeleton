# ng-hub-ui-skeleton

[Español](./README.es.md) | **English**

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-skeleton.svg)](https://www.npmjs.com/package/ng-hub-ui-skeleton)
[![license](https://img.shields.io/npm/l/ng-hub-ui-skeleton.svg)](https://github.com/carlos-morcillo/ng-hub-ui/blob/main/LICENSE)

Dynamic Angular skeleton placeholders driven by a compact Emmet-like DSL, reusable presets, responsive values, variants, and programmatic preset registration.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/skeleton/overview/
- Live examples: https://hubui.dev/en/skeleton/examples/
- Hub UI: https://hubui.dev/en/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **Hub UI** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton) ← You are here
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Table of Contents

- [📦 Description](#-description)
- [✨ Features](#-features)
- [📦 Installation](#-installation)
- [🚀 Usage](#-usage)
    - [Render a bundled preset](#render-a-bundled-preset)
    - [Render an inline DSL template](#render-an-inline-dsl-template)
    - [Parameterized presets](#parameterized-presets)
    - [Variants](#variants)
    - [Responsive templates](#responsive-templates)
    - [Register custom presets](#register-custom-presets)
- [✍️ The Template DSL](#️-the-template-dsl)
- [📖 API Reference](#-api-reference)
- [🎨 Styling / CSS Variables](#-styling--css-variables)
- [📊 Changelog](#-changelog)
- [🤝 Contribution](#-contribution)
- [☕ Support](#-support)
- [📄 License](#-license)

## 📦 Description

`ng-hub-ui-skeleton` renders loading placeholders for Angular standalone apps. Instead of hand-crafting a markup tree per loading state, you describe the placeholder with a single compact string — a small Emmet-inspired DSL — or you pick one of the bundled presets. Skeletons are fully responsive (values can change per breakpoint), support visual variants, and can be extended at the application level with your own preset catalogue.

The `<hub-skeleton>` component resolves the active breakpoint from the viewport width, expands presets and aliases recursively, interpolates any `{{param}}` placeholders, and paints animated shimmer surfaces with CSS — no external dependencies.

## ✨ Features

- **Compact DSL**: Describe entire placeholder trees with a single Emmet-like string.
- **Bundled presets**: Ready-made layouts for cards, lists, tables, forms, dashboards, charts, profiles, feeds, and empty states.
- **Preset composition**: Reference any preset by name inside the DSL as an alias (e.g. `list-item*4`).
- **Responsive values**: Per-breakpoint tokens (`base`, `sm`, `md`, `lg`, `xl`) resolved from the viewport width.
- **Variants**: Named preset variants (such as `compact`) selected with the `variant` input or inline `name@variant`.
- **Parameters**: Inject runtime values via `{{param}}` interpolation and the `params` input.
- **Programmatic registration**: Add custom presets app-wide with `provideHubSkeletonPresets`.
- **Appearance presets**: `default`, `subtle`, and `contrast` tones.
- **CSS shimmer animation**: Toggleable, fully CSS-driven, no JavaScript animation loop.
- **Standalone & SSR-aware**: Standalone component, `OnPush` change detection, and browser-only resize handling.
- **Lightweight**: No external runtime dependencies.

## 📦 Installation

```bash
npm install ng-hub-ui-skeleton
```

## 🚀 Usage

Import the standalone component:

```typescript
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
	selector: 'app-demo',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `...`
})
export class DemoComponent {}
```

### Render a bundled preset

```html
<hub-skeleton preset="card"></hub-skeleton>
<hub-skeleton preset="list-item"></hub-skeleton>
<hub-skeleton preset="dashboard-widget"></hub-skeleton>
```

Bundled preset names: `card`, `list-item`, `table-row`, `detail-view`, `form-section`, `dashboard-widget`, `stat-card`, `chart-panel`, `profile-summary`, `master-detail`, `kanban-card`, `feed-item`, `search-result`, `table-toolbar`, `filter-bar`, `empty-state-skeleton`.

### Render an inline DSL template

```html
<hub-skeleton
	template="stack(gap:12)>circle(size:48)+stack(gap:8)>line(width:40%)+line(width:72%)"
></hub-skeleton>
```

You can also pass a template definition object instead of a string (see [Responsive templates](#responsive-templates)).

### Parameterized presets

Presets expose `{{param}}` placeholders that you can override through the `params` input. Any value passed in `params` is merged on top of the preset defaults.

```html
<!-- The "card" preset accepts `rows`, `radius`, `titleWidth`, etc. -->
<hub-skeleton preset="card" [params]="{ rows: 4, radius: 8 }"></hub-skeleton>

<!-- The "table-row" preset adapts to the column count -->
<hub-skeleton preset="table-row" [params]="{ columns: 6 }"></hub-skeleton>
```

### Variants

Some presets define named variants (for example `card` and `list-item` ship a `compact` variant). Select one with the `variant` input:

```html
<hub-skeleton preset="card" variant="compact"></hub-skeleton>
```

Inside the DSL, a variant can be selected per node with the `name@variant` syntax:

```html
<hub-skeleton template="card@compact"></hub-skeleton>
```

### Responsive templates

Pass a `HubSkeletonTemplateDefinition` with breakpoint-specific DSL replacements:

```typescript
import { HubSkeletonTemplateDefinition } from 'ng-hub-ui-skeleton';

readonly responsiveTemplate: HubSkeletonTemplateDefinition = {
	dsl: 'grid(columns:1,gap:12)>block(height:120)*2',
	responsive: {
		md: 'grid(columns:2,gap:16)>block(height:160)*4',
		lg: 'grid(columns:4,gap:20)>block(height:200)*4'
	}
};
```

```html
<hub-skeleton [template]="responsiveTemplate"></hub-skeleton>
```

Individual modifier values can also be made responsive inline (see [The Template DSL](#️-the-template-dsl)).

### Register custom presets

Register your own preset catalogue at the application level. Custom presets are merged on top of the bundled ones (matching names override).

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHubSkeletonPresets } from 'ng-hub-ui-skeleton';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHubSkeletonPresets([
			{
				name: 'profile-card',
				description: 'Custom profile card placeholder',
				template:
					'stack(gap:16)>circle(size:72)+line(width:52%,height:18)+line(width:70%,height:12)+grid(columns:2|md=4,gap:10)>block(height:56)*4',
				defaults: { rows: 2 },
				variants: {
					compact: { defaults: { rows: 1 } }
				}
			}
		])
	]
};
```

```html
<hub-skeleton preset="profile-card"></hub-skeleton>
```

## ✍️ The Template DSL

The DSL is a compact, Emmet-inspired grammar that compiles into a tree of skeleton nodes.

### Node types

| Node     | Surface? | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| `line`   | Yes      | A thin text-line placeholder                     |
| `block`  | Yes      | A rectangular block (media, button, image, etc.) |
| `circle` | Yes      | A circular placeholder (avatars, icons)          |
| `stack`  | No       | Flex container (column by default)               |
| `grid`   | No       | CSS grid container                               |

Any name that is **not** a built-in node type is resolved as a **preset alias** and expanded recursively.

### Operators

| Operator    | Meaning                                              | Example                          |
| ----------- | ---------------------------------------------------- | -------------------------------- |
| `>`         | Child — nest the following siblings inside the node  | `stack>line+line`                |
| `+`         | Sibling — add another node at the same level         | `circle+line`                    |
| `*N`        | Repeat — repeat the preceding node `N` times         | `line*3`                         |
| `(k:v,...)` | Modifiers — set properties on a node                 | `block(height:120,radius:18)`    |
| `@variant`  | Variant — select a preset variant for an alias node  | `card@compact`                   |
| `{{param}}` | Parameter — interpolated from `params`/preset values | `line(width:{{titleWidth}})`     |

### Modifiers

Modifiers are key/value pairs inside parentheses, comma-separated. A modifier with no value defaults to `true` (e.g. `grow` is equivalent to `grow:true`).

| Modifier   | Applies to       | Description                                                |
| ---------- | ---------------- | ---------------------------------------------------------- |
| `width`    | line/block/circle| Node width (percentage or length; raw numbers → `px`)      |
| `height`   | line/block/circle| Node height (raw numbers → `px`)                           |
| `size`     | circle           | Diameter (raw numbers → `px`)                              |
| `radius`   | surface nodes    | Border radius (raw numbers → `px`)                         |
| `gap`      | stack/grid       | Gap between children (raw numbers → `px`)                  |
| `columns`  | grid             | Number of grid columns                                     |
| `direction`| stack            | `column` (default) or `row`                                |
| `align`    | stack/grid       | `align-items` value (e.g. `center`, `flex-start`)          |
| `justify`  | stack            | `justify-content` value (e.g. `space-between`, `flex-end`) |
| `grow`     | any node         | When `true`, the node flex-grows to fill space             |

### Responsive modifier values

A single modifier value can carry breakpoint-specific overrides using the `|` separator and `breakpoint=value` syntax. The bare value (no `=`) is the `base` value, and each breakpoint applies from its width upward.

```
grid(columns:1|md=2|lg=4)
block(height:220|lg=280)
```

Supported breakpoints and their min-widths: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1280px). `base` applies below `sm`.

### Full example

```
stack(gap:16)>block(height:180,radius:18)+line(height:18,width:56%)+stack(gap:10)>line(width:100%)*2+line(width:76%)
```

## 📖 API Reference

### `HubSkeletonComponent`

Selector: `hub-skeleton`

#### Inputs

| Input        | Type                              | Default                  | Description                                                                 |
| ------------ | --------------------------------- | ------------------------ | --------------------------------------------------------------------------- |
| `preset`     | `string \| null`                  | `null`                   | Built-in or registered preset name to render.                               |
| `template`   | `HubSkeletonTemplateInput \| null`| `null`                   | Inline DSL string or template definition object.                            |
| `params`     | `HubSkeletonParams`               | `{}`                     | Serializable values interpolated into `{{param}}` placeholders.             |
| `variant`    | `string \| null`                  | `null`                   | Named preset variant to apply.                                              |
| `animated`   | `boolean`                         | `true`                   | Toggles the shimmer animation.                                              |
| `appearance` | `HubSkeletonAppearance`           | `'default'`              | Visual tone: `'default' \| 'subtle' \| 'contrast'`.                         |
| `ariaLabel`  | `string`                          | `'Loading placeholder'`  | Accessible name of the container's `role="status"` live region.             |

> Either `preset` or `template` must be provided; otherwise the component throws. An unknown preset name also throws.

This component has no outputs.

### `provideHubSkeletonPresets(presets)`

Environment provider that appends custom presets to the bundled catalogue for the active injector tree.

```typescript
function provideHubSkeletonPresets(presets: readonly HubSkeletonPreset[]): EnvironmentProviders;
```

It is multi-provider backed (token `HUB_SKELETON_PRESETS`), so multiple calls accumulate. Later presets override earlier ones with the same `name`.

### `HubSkeletonPresetRegistryService`

Injectable (`providedIn: 'root'`) service that resolves the merged preset catalogue.

| Member             | Signature                                       | Description                                  |
| ------------------ | ----------------------------------------------- | -------------------------------------------- |
| `presets`          | `Signal<Map<string, HubSkeletonPreset>>`        | All presets merged by name.                  |
| `getPreset(name)`  | `(name: string) => HubSkeletonPreset \| undefined` | Returns a single preset by name.          |

### Exported types

```typescript
type HubSkeletonBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
type HubSkeletonPrimitive = string | number | boolean;
type HubSkeletonResponsiveValue<T extends HubSkeletonPrimitive = HubSkeletonPrimitive> =
	| T
	| Partial<Record<HubSkeletonBreakpoint, T>>;
type HubSkeletonParams = Record<string, HubSkeletonPrimitive | undefined>;
type HubSkeletonAppearance = 'default' | 'subtle' | 'contrast';
type HubSkeletonTemplateInput = string | HubSkeletonTemplateDefinition;

interface HubSkeletonTemplateDefinition {
	readonly dsl: string;
	readonly responsive?: Partial<Record<Exclude<HubSkeletonBreakpoint, 'base'>, string>>;
}

interface HubSkeletonPreset {
	readonly name: string;
	readonly template: HubSkeletonTemplateInput;
	readonly defaults?: HubSkeletonParams;
	readonly variants?: Record<string, {
		readonly template?: HubSkeletonTemplateInput;
		readonly defaults?: HubSkeletonParams;
	}>;
	readonly description?: string;
}
```

The package also exports the `HUB_SKELETON_DEFAULT_PRESETS` catalogue and `HubSkeletonModule`. The DSL parser and its resolvers stay inside the package: a layout is written as a template string and handed to the component or registered as a preset, so nothing outside has to call them, and keeping them private is what lets the grammar grow without breaking anybody.

`HubSkeletonModule` is **deprecated and removed in 23.0.0**: it only re-exports `HubSkeletonComponent`, so a module-based application imports the component directly. Custom presets go through `provideHubSkeletonPresets()`, which never travelled through the module. See `BREAKING_CHANGES.md`.

## 🎨 Styling / CSS Variables

The component styles itself with CSS custom properties scoped to the `.hub-skeleton` container. Override them on the host to theme skeletons:

| Variable                              | Default                          | Description                          |
| ------------------------------------- | -------------------------------- | ------------------------------------ |
| `--hub-skeleton-bg`                   | `rgba(148, 163, 184, 0.18)`      | Base surface color.                  |
| `--hub-skeleton-highlight`            | `rgba(255, 255, 255, 0.52)`      | Shimmer highlight color.             |
| `--hub-skeleton-radius`               | `12px`                           | Default surface border radius.       |
| `--hub-skeleton-gap`                  | `12px`                           | Default gap for stack/grid nodes.    |
| `--hub-skeleton-animation-duration`   | `1.35s`                          | Shimmer animation duration.          |

```scss
hub-skeleton {
	--hub-skeleton-bg: rgba(0, 0, 0, 0.08);
	--hub-skeleton-highlight: rgba(255, 255, 255, 0.6);
	--hub-skeleton-radius: 8px;
	--hub-skeleton-animation-duration: 1.6s;
}
```

The `appearance` input swaps the base/highlight colors for `subtle` and `contrast` tones. Per-node modifiers (`width`, `height`, `size`, `radius`, `gap`, `columns`, `align`, `justify`) are applied as scoped `--hub-skeleton-node-*` custom properties.

### The `hub-skeleton-theme()` Sass mixin

For Sass-based projects, the `hub-skeleton-theme()` mixin overrides the `--hub-skeleton-*` tokens in a single include. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted — the rest keep the component defaults. It is token-based and self-contained (no Bootstrap dependency). A skeleton is a neutral placeholder, so there is no semantic color variant: tune the base / highlight surfaces, the corner radius, the gap between nodes and the shimmer speed instead (per-node sizes still come from the template DSL / presets).

```scss
@use 'ng-hub-ui-skeleton/styles' as *;

hub-skeleton.on-dark {
	@include hub-skeleton-theme(
		$bg: rgba(255, 255, 255, 0.1),
		$highlight: rgba(255, 255, 255, 0.22),
		$radius: 8px,
		$animation-duration: 1.8s
	);
}
```

Available parameters: `$bg`, `$highlight`, `$radius`, `$gap`, `$animation-duration`.

## 📊 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

## 🤝 Contribution

Contributions are welcome. Please open an issue to discuss substantial changes before submitting a pull request, and make sure to document every library change in `CHANGELOG.md`.

## ☕ Support

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui/issues)
- **Author**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 📄 License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)

---

Made with ❤️ by the Hub UI team
