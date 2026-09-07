# ng-hub-ui-skeleton

**Español** | [English](./README.md)

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-skeleton.svg)](https://www.npmjs.com/package/ng-hub-ui-skeleton)
[![license](https://img.shields.io/npm/l/ng-hub-ui-skeleton.svg)](https://github.com/carlos-morcillo/ng-hub-ui/blob/main/LICENSE)

Placeholders de carga (skeletons) dinámicos para Angular, definidos con un DSL compacto al estilo Emmet, presets reutilizables, valores responsive, variantes y registro programático de presets.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de librerías de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/skeleton/overview/
- Ejemplos en vivo: https://hubui.dev/en/skeleton/examples/
- Hub UI: https://hubui.dev/en/

## 🧩 Familia de librerías `ng-hub-ui`

Esta librería forma parte del ecosistema **Hub UI**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleta — usa ng-hub-ui-panels)
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
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton) ← Estás aquí
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Índice

- [📦 Descripción](#-descripción)
- [✨ Características](#-características)
- [📦 Instalación](#-instalación)
- [🚀 Uso](#-uso)
    - [Renderizar un preset incluido](#renderizar-un-preset-incluido)
    - [Renderizar una plantilla DSL en línea](#renderizar-una-plantilla-dsl-en-línea)
    - [Presets parametrizados](#presets-parametrizados)
    - [Variantes](#variantes)
    - [Plantillas responsive](#plantillas-responsive)
    - [Registrar presets personalizados](#registrar-presets-personalizados)
- [✍️ El DSL de plantillas](#️-el-dsl-de-plantillas)
- [📖 Referencia de la API](#-referencia-de-la-api)
- [🎨 Estilos / Variables CSS](#-estilos--variables-css)
- [📊 Changelog](#-changelog)
- [🤝 Contribución](#-contribución)
- [☕ Soporte](#-soporte)
- [📄 Licencia](#-licencia)

## 📦 Descripción

`ng-hub-ui-skeleton` renderiza placeholders de carga para aplicaciones Angular standalone. En lugar de construir a mano un árbol de marcado por cada estado de carga, describes el placeholder con una única cadena compacta — un pequeño DSL inspirado en Emmet — o eliges uno de los presets incluidos. Los skeletons son totalmente responsive (los valores pueden cambiar por breakpoint), admiten variantes visuales y pueden ampliarse a nivel de aplicación con tu propio catálogo de presets.

El componente `<hub-skeleton>` resuelve el breakpoint activo a partir del ancho del viewport, expande presets y alias de forma recursiva, interpola los marcadores `{{param}}` y pinta superficies animadas con shimmer mediante CSS, sin dependencias externas.

## ✨ Características

- **DSL compacto**: Describe árboles completos de placeholders con una sola cadena al estilo Emmet.
- **Presets incluidos**: Diseños listos para tarjetas, listas, tablas, formularios, dashboards, gráficas, perfiles, feeds y estados vacíos.
- **Composición de presets**: Referencia cualquier preset por nombre dentro del DSL como un alias (p. ej. `list-item*4`).
- **Valores responsive**: Tokens por breakpoint (`base`, `sm`, `md`, `lg`, `xl`) resueltos según el ancho del viewport.
- **Variantes**: Variantes de preset con nombre (como `compact`), seleccionables con el input `variant` o el inline `name@variant`.
- **Parámetros**: Inyecta valores en tiempo de ejecución mediante interpolación `{{param}}` y el input `params`.
- **Registro programático**: Añade presets personalizados a toda la aplicación con `provideHubSkeletonPresets`.
- **Apariencias**: Tonos `default`, `subtle` y `contrast`.
- **Animación shimmer en CSS**: Conmutable, totalmente basada en CSS, sin bucle de animación en JavaScript.
- **Standalone y compatible con SSR**: Componente standalone, detección de cambios `OnPush` y gestión del resize solo en navegador.
- **Ligero**: Sin dependencias de runtime externas.

## 📦 Instalación

```bash
npm install ng-hub-ui-skeleton
```

## 🚀 Uso

Importa el componente standalone:

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

### Renderizar un preset incluido

```html
<hub-skeleton preset="card"></hub-skeleton>
<hub-skeleton preset="list-item"></hub-skeleton>
<hub-skeleton preset="dashboard-widget"></hub-skeleton>
```

Nombres de presets incluidos: `card`, `list-item`, `table-row`, `detail-view`, `form-section`, `dashboard-widget`, `stat-card`, `chart-panel`, `profile-summary`, `master-detail`, `kanban-card`, `feed-item`, `search-result`, `table-toolbar`, `filter-bar`, `empty-state-skeleton`.

### Renderizar una plantilla DSL en línea

```html
<hub-skeleton
	template="stack(gap:12)>circle(size:48)+stack(gap:8)>line(width:40%)+line(width:72%)"
></hub-skeleton>
```

También puedes pasar un objeto de definición de plantilla en lugar de una cadena (ver [Plantillas responsive](#plantillas-responsive)).

### Presets parametrizados

Los presets exponen marcadores `{{param}}` que puedes sobrescribir con el input `params`. Cualquier valor pasado en `params` se fusiona por encima de los valores por defecto del preset.

```html
<!-- El preset "card" acepta `rows`, `radius`, `titleWidth`, etc. -->
<hub-skeleton preset="card" [params]="{ rows: 4, radius: 8 }"></hub-skeleton>

<!-- El preset "table-row" se adapta al número de columnas -->
<hub-skeleton preset="table-row" [params]="{ columns: 6 }"></hub-skeleton>
```

### Variantes

Algunos presets definen variantes con nombre (por ejemplo `card` y `list-item` incluyen una variante `compact`). Selecciona una con el input `variant`:

```html
<hub-skeleton preset="card" variant="compact"></hub-skeleton>
```

Dentro del DSL, se puede seleccionar una variante por nodo con la sintaxis `name@variant`:

```html
<hub-skeleton template="card@compact"></hub-skeleton>
```

### Plantillas responsive

Pasa un `HubSkeletonTemplateDefinition` con reemplazos de DSL por breakpoint:

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

Los valores de modificador individuales también pueden hacerse responsive en línea (ver [El DSL de plantillas](#️-el-dsl-de-plantillas)).

### Registrar presets personalizados

Registra tu propio catálogo de presets a nivel de aplicación. Los presets personalizados se fusionan por encima de los incluidos (los nombres coincidentes los sobrescriben).

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHubSkeletonPresets } from 'ng-hub-ui-skeleton';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHubSkeletonPresets([
			{
				name: 'profile-card',
				description: 'Placeholder personalizado de tarjeta de perfil',
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

## ✍️ El DSL de plantillas

El DSL es una gramática compacta inspirada en Emmet que se compila en un árbol de nodos de skeleton.

### Tipos de nodo

| Nodo     | ¿Superficie? | Descripción                                          |
| -------- | ------------ | ---------------------------------------------------- |
| `line`   | Sí           | Placeholder de línea de texto fina                   |
| `block`  | Sí           | Bloque rectangular (media, botón, imagen, etc.)      |
| `circle` | Sí           | Placeholder circular (avatares, iconos)              |
| `stack`  | No           | Contenedor flex (columna por defecto)                |
| `grid`   | No           | Contenedor de cuadrícula CSS                         |

Cualquier nombre que **no** sea un tipo de nodo nativo se resuelve como un **alias de preset** y se expande de forma recursiva.

### Operadores

| Operador    | Significado                                              | Ejemplo                          |
| ----------- | ------------------------------------------------------- | -------------------------------- |
| `>`         | Hijo — anida los siguientes hermanos dentro del nodo    | `stack>line+line`                |
| `+`         | Hermano — añade otro nodo al mismo nivel                | `circle+line`                    |
| `*N`        | Repetición — repite el nodo anterior `N` veces          | `line*3`                         |
| `(k:v,...)` | Modificadores — establece propiedades en un nodo        | `block(height:120,radius:18)`    |
| `@variant`  | Variante — selecciona una variante de preset en un alias| `card@compact`                   |
| `{{param}}` | Parámetro — interpolado desde `params`/valores de preset| `line(width:{{titleWidth}})`     |

### Modificadores

Los modificadores son pares clave/valor dentro de paréntesis, separados por comas. Un modificador sin valor toma `true` por defecto (p. ej. `grow` equivale a `grow:true`).

| Modificador | Aplica a          | Descripción                                                  |
| ----------- | ----------------- | ------------------------------------------------------------ |
| `width`     | line/block/circle | Ancho del nodo (porcentaje o longitud; números → `px`)       |
| `height`    | line/block/circle | Alto del nodo (números → `px`)                               |
| `size`      | circle            | Diámetro (números → `px`)                                    |
| `radius`    | nodos superficie  | Radio de borde (números → `px`)                              |
| `gap`       | stack/grid        | Separación entre hijos (números → `px`)                      |
| `columns`   | grid              | Número de columnas de la cuadrícula                          |
| `direction` | stack             | `column` (por defecto) o `row`                               |
| `align`     | stack/grid        | Valor de `align-items` (p. ej. `center`, `flex-start`)       |
| `justify`   | stack             | Valor de `justify-content` (p. ej. `space-between`, `flex-end`) |
| `grow`      | cualquier nodo    | Cuando es `true`, el nodo crece (flex) para llenar el espacio |

### Valores de modificador responsive

Un único valor de modificador puede llevar overrides por breakpoint usando el separador `|` y la sintaxis `breakpoint=valor`. El valor sin `=` es el valor `base`, y cada breakpoint se aplica desde su ancho hacia arriba.

```
grid(columns:1|md=2|lg=4)
block(height:220|lg=280)
```

Breakpoints admitidos y sus anchos mínimos: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1280px). `base` se aplica por debajo de `sm`.

### Ejemplo completo

```
stack(gap:16)>block(height:180,radius:18)+line(height:18,width:56%)+stack(gap:10)>line(width:100%)*2+line(width:76%)
```

## 📖 Referencia de la API

### `HubSkeletonComponent`

Selector: `hub-skeleton`

#### Inputs

| Input        | Tipo                              | Por defecto             | Descripción                                                                |
| ------------ | --------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `preset`     | `string \| null`                  | `null`                  | Nombre del preset incluido o registrado a renderizar.                      |
| `template`   | `HubSkeletonTemplateInput \| null`| `null`                  | Cadena DSL en línea u objeto de definición de plantilla.                   |
| `params`     | `HubSkeletonParams`               | `{}`                    | Valores serializables interpolados en los marcadores `{{param}}`.          |
| `variant`    | `string \| null`                  | `null`                  | Variante de preset con nombre a aplicar.                                   |
| `animated`   | `boolean`                         | `true`                  | Conmuta la animación shimmer.                                              |
| `appearance` | `HubSkeletonAppearance`           | `'default'`             | Tono visual: `'default' \| 'subtle' \| 'contrast'`.                        |
| `ariaLabel`  | `string`                          | `'Loading placeholder'` | Nombre accesible de la región `role="status"` del contenedor.              |

> Debe proporcionarse `preset` o `template`; de lo contrario el componente lanza un error. Un nombre de preset desconocido también lanza un error.

Este componente no tiene outputs.

### `provideHubSkeletonPresets(presets)`

Provider de entorno que añade presets personalizados al catálogo incluido para el árbol de inyectores activo.

```typescript
function provideHubSkeletonPresets(presets: readonly HubSkeletonPreset[]): EnvironmentProviders;
```

Está respaldado por un multi-provider (token `HUB_SKELETON_PRESETS`), por lo que varias llamadas se acumulan. Los presets posteriores sobrescriben a los anteriores con el mismo `name`.

### `HubSkeletonPresetRegistryService`

Servicio inyectable (`providedIn: 'root'`) que resuelve el catálogo de presets fusionado.

| Miembro            | Firma                                              | Descripción                              |
| ------------------ | -------------------------------------------------- | ---------------------------------------- |
| `presets`          | `Signal<Map<string, HubSkeletonPreset>>`           | Todos los presets fusionados por nombre. |
| `getPreset(name)`  | `(name: string) => HubSkeletonPreset \| undefined` | Devuelve un único preset por nombre.     |

### Tipos exportados

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

El paquete exporta además el catálogo `HUB_SKELETON_DEFAULT_PRESETS` y `HubSkeletonModule`. El analizador del DSL y sus resolutores se quedan dentro del paquete: un diseño se escribe como cadena de plantilla y se le entrega al componente o se registra como preset, así que nadie de fuera necesita llamarlos, y mantenerlos privados es lo que permite que la gramática crezca sin romperle nada a nadie.

`HubSkeletonModule` está **obsoleto y se retira en la 23.0.0**: solo reexporta `HubSkeletonComponent`, así que una aplicación basada en módulos importa el componente directamente. Los presets personalizados van por `provideHubSkeletonPresets()`, que nunca pasó por el módulo. Consulta `BREAKING_CHANGES.md`.

## 🎨 Estilos / Variables CSS

El componente se estiliza con propiedades CSS personalizadas con ámbito en el contenedor `.hub-skeleton`. Sobrescríbelas en el host para tematizar los skeletons:

| Variable                              | Por defecto                      | Descripción                            |
| ------------------------------------- | -------------------------------- | -------------------------------------- |
| `--hub-skeleton-bg`                   | `rgba(148, 163, 184, 0.18)`      | Color base de la superficie.           |
| `--hub-skeleton-highlight`            | `rgba(255, 255, 255, 0.52)`      | Color del resalte del shimmer.         |
| `--hub-skeleton-radius`               | `12px`                           | Radio de borde por defecto.            |
| `--hub-skeleton-gap`                  | `12px`                           | Separación por defecto en stack/grid.  |
| `--hub-skeleton-animation-duration`   | `1.35s`                          | Duración de la animación shimmer.      |

```scss
hub-skeleton {
	--hub-skeleton-bg: rgba(0, 0, 0, 0.08);
	--hub-skeleton-highlight: rgba(255, 255, 255, 0.6);
	--hub-skeleton-radius: 8px;
	--hub-skeleton-animation-duration: 1.6s;
}
```

El input `appearance` intercambia los colores base/resalte por los tonos `subtle` y `contrast`. Los modificadores por nodo (`width`, `height`, `size`, `radius`, `gap`, `columns`, `align`, `justify`) se aplican como propiedades personalizadas con ámbito `--hub-skeleton-node-*`.

### El mixin Sass `hub-skeleton-theme()`

Para proyectos basados en Sass, el mixin `hub-skeleton-theme()` sobrescribe los tokens `--hub-skeleton-*` en un único include. Todos los parámetros son opcionales y por defecto valen `null`, así que solo se emiten los que pasas — el resto conserva los valores por defecto del componente. Es autónomo y basado en tokens (sin dependencia de Bootstrap). Un skeleton es un placeholder neutro, por lo que no hay variante de color semántica: ajusta las superficies base / de resalte, el radio de borde, la separación entre nodos y la velocidad del shimmer (los tamaños por nodo siguen viniendo del DSL de plantillas / presets).

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

Parámetros disponibles: `$bg`, `$highlight`, `$radius`, `$gap`, `$animation-duration`.

## 📊 Changelog

Consulta [CHANGELOG.md](./CHANGELOG.md) para el historial completo de versiones.

## 🤝 Contribución

Las contribuciones son bienvenidas. Abre una issue para discutir cambios sustanciales antes de enviar un pull request, y asegúrate de documentar cada cambio de la librería en `CHANGELOG.md`.

## ☕ Soporte

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui/issues)
- **Autor**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 📄 Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)

---

Hecho con ❤️ por el equipo de Hub UI
