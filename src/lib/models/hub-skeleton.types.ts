/**
 * Available breakpoint identifiers resolved by the skeleton renderer.
 */
export type HubSkeletonBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Primitive values accepted by the DSL and public params API.
 */
export type HubSkeletonPrimitive = string | number | boolean;

/**
 * Breakpoint-aware primitive values.
 */
export type HubSkeletonResponsiveValue<T extends HubSkeletonPrimitive = HubSkeletonPrimitive> =
	| T
	| Partial<Record<HubSkeletonBreakpoint, T>>;

/**
 * Serializable params accepted by presets and inline templates.
 */
export type HubSkeletonParams = Record<string, HubSkeletonPrimitive | undefined>;

/**
 * Public visual appearance presets.
 */
export type HubSkeletonAppearance = 'default' | 'subtle' | 'contrast';

/**
 * Template value accepted by the public component API.
 */
export type HubSkeletonTemplateInput = string | HubSkeletonTemplateDefinition;

/**
 * Programmatic template definition with explicit responsive overrides.
 */
export interface HubSkeletonTemplateDefinition {
	/** Base compact DSL string. */
	readonly dsl: string;
	/** Optional breakpoint-specific DSL replacement. */
	readonly responsive?: Partial<Record<Exclude<HubSkeletonBreakpoint, 'base'>, string>>;
}

/**
 * Public preset contract used by bundled and custom presets.
 */
export interface HubSkeletonPreset {
	/** Stable preset identifier used in the `preset` input and DSL alias composition. */
	readonly name: string;
	/** Main preset template. */
	readonly template: HubSkeletonTemplateInput;
	/** Optional parameter defaults merged before template interpolation. */
	readonly defaults?: HubSkeletonParams;
	/** Optional preset-level variants. */
	readonly variants?: Record<
		string,
		{
			readonly template?: HubSkeletonTemplateInput;
			readonly defaults?: HubSkeletonParams;
		}
	>;
	/** Optional human-friendly summary used by docs. */
	readonly description?: string;
}

/**
 * Parsed DSL node before alias expansion.
 */
export interface HubSkeletonAstNode {
	/** Stable node name parsed from the DSL token. */
	readonly name: string;
	/** Parsed modifier map. */
	readonly props: Readonly<Record<string, string>>;
	/** Optional inline variant selector parsed from `name@variant`. */
	readonly variant?: string;
	/** Child nodes attached via the `>` operator. */
	readonly children: readonly HubSkeletonAstNode[];
	/** Repetition count parsed from the `*N` suffix. */
	readonly repeat: number;
}

/**
 * Internal normalized render node after preset and responsive resolution.
 */
export interface HubSkeletonRenderNode {
	/** Stable generated node identifier. */
	readonly id: string;
	/** Renderable node type. */
	readonly type: 'line' | 'block' | 'circle' | 'stack' | 'grid';
	/** Final string props after param interpolation and breakpoint resolution. */
	readonly props: Readonly<Record<string, string>>;
	/** Nested child nodes for container types. */
	readonly children: readonly HubSkeletonRenderNode[];
	/** Marks whether the node paints a visible skeleton surface. */
	readonly isSurface: boolean;
}
