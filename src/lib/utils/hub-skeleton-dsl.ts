import {
	HubSkeletonAstNode,
	HubSkeletonBreakpoint,
	HubSkeletonParams,
	HubSkeletonPreset,
	HubSkeletonPrimitive,
	HubSkeletonRenderNode,
	HubSkeletonResponsiveValue,
	HubSkeletonTemplateDefinition,
	HubSkeletonTemplateInput
} from '../models/hub-skeleton.types';

const BUILTIN_NODE_TYPES = new Set(['line', 'block', 'circle', 'stack', 'grid']);
const BREAKPOINT_ORDER: readonly HubSkeletonBreakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];
const BREAKPOINT_WIDTHS: Record<Exclude<HubSkeletonBreakpoint, 'base'>, number> = {
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1280
};

/**
 * Lightweight DSL parser for the compact skeleton syntax.
 */
class HubSkeletonDslParser {
	private index = 0;

	constructor(private readonly source: string) {}

	/**
	 * Parses the full source string into sibling root nodes.
	 *
	 * @returns Root nodes declared in the DSL.
	 */
	parse(): readonly HubSkeletonAstNode[] {
		const nodes = this.parseSiblings();
		this.skipWhitespace();

		if (this.index < this.source.length) {
			throw new Error(`Unexpected token "${this.source[this.index]}" at position ${this.index}.`);
		}

		return nodes;
	}

	private parseSiblings(): HubSkeletonAstNode[] {
		const nodes = [this.parseNode()];

		while (true) {
			this.skipWhitespace();
			if (this.peek() !== '+') {
				break;
			}

			this.index += 1;
			nodes.push(this.parseNode());
		}

		return nodes;
	}

	private parseNode(): HubSkeletonAstNode {
		this.skipWhitespace();
		const name = this.readIdentifier();
		let variant: string | undefined;

		if (this.peek() === '@') {
			this.index += 1;
			variant = this.readIdentifier();
		}

		const props = this.peek() === '(' ? this.readProps() : {};
		let children: readonly HubSkeletonAstNode[] = [];

		this.skipWhitespace();
		if (this.peek() === '>') {
			this.index += 1;
			children = this.parseSiblings();
		}

		this.skipWhitespace();
		let repeat = 1;
		if (this.peek() === '*') {
			this.index += 1;
			const rawRepeat = this.readUntilDelimiter(['+', '>', ')']).trim();
			repeat = Number.parseInt(rawRepeat, 10);
			if (!Number.isFinite(repeat) || repeat < 1) {
				throw new Error(`Invalid repeat value "${rawRepeat}" near position ${this.index}.`);
			}
		}

		return { name, props, variant, children, repeat };
	}

	private readProps(): Record<string, string> {
		const props: Record<string, string> = {};
		this.expect('(');
		let chunk = '';
		let depth = 1;

		while (this.index < this.source.length && depth > 0) {
			const char = this.source[this.index++];
			if (char === '(') {
				depth += 1;
				chunk += char;
				continue;
			}
			if (char === ')') {
				depth -= 1;
				if (depth === 0) {
					break;
				}
				chunk += char;
				continue;
			}
			chunk += char;
		}

		if (depth !== 0) {
			throw new Error('Unclosed modifier block in skeleton DSL.');
		}

		for (const entry of this.splitTopLevel(chunk, ',')) {
			const trimmedEntry = entry.trim();
			if (!trimmedEntry) {
				continue;
			}

			const [rawKey, ...rawValueParts] = trimmedEntry.split(':');
			if (!rawKey) {
				continue;
			}

			props[rawKey.trim()] = rawValueParts.length > 0 ? rawValueParts.join(':').trim() : 'true';
		}

		return props;
	}

	private splitTopLevel(value: string, separator: string): string[] {
		const parts: string[] = [];
		let current = '';
		let depth = 0;

		for (const char of value) {
			if (char === '(') {
				depth += 1;
			} else if (char === ')') {
				depth -= 1;
			}

			if (char === separator && depth === 0) {
				parts.push(current);
				current = '';
				continue;
			}

			current += char;
		}

		if (current) {
			parts.push(current);
		}

		return parts;
	}

	private readIdentifier(): string {
		this.skipWhitespace();
		const start = this.index;
		while (this.index < this.source.length && /[a-zA-Z0-9-]/.test(this.source[this.index])) {
			this.index += 1;
		}

		if (start === this.index) {
			throw new Error(`Expected identifier near position ${this.index}.`);
		}

		return this.source.slice(start, this.index);
	}

	private readUntilDelimiter(delimiters: readonly string[]): string {
		const start = this.index;
		while (this.index < this.source.length && !delimiters.includes(this.source[this.index])) {
			this.index += 1;
		}
		return this.source.slice(start, this.index);
	}

	private expect(char: string): void {
		this.skipWhitespace();
		if (this.peek() !== char) {
			throw new Error(`Expected "${char}" near position ${this.index}.`);
		}
		this.index += 1;
	}

	private skipWhitespace(): void {
		while (this.index < this.source.length && /\s/.test(this.source[this.index])) {
			this.index += 1;
		}
	}

	private peek(): string | undefined {
		return this.source[this.index];
	}
}

/**
 * Parses a DSL string into a raw AST.
 *
 * @param dsl Source template string.
 * @returns Parsed root nodes.
 */
export function parseHubSkeletonDsl(dsl: string): readonly HubSkeletonAstNode[] {
	return new HubSkeletonDslParser(dsl).parse();
}

/**
 * Interpolates `{{param}}` placeholders using a serializable params map.
 *
 * @param source Source DSL or modifier value.
 * @param params Runtime params.
 * @returns Interpolated string.
 */
export function interpolateHubSkeletonParams(source: string, params: HubSkeletonParams): string {
	return source.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (_, key: string) => String(params[key] ?? ''));
}

/**
 * Resolves the concrete DSL string to use for the current breakpoint.
 *
 * @param template Source template definition.
 * @param breakpoint Current active breakpoint.
 * @returns DSL string to parse.
 */
export function resolveTemplateDsl(
	template: HubSkeletonTemplateInput,
	breakpoint: HubSkeletonBreakpoint
): string {
	if (typeof template === 'string') {
		return template;
	}

	if (breakpoint !== 'base' && template.responsive?.[breakpoint]) {
		return template.responsive[breakpoint]!;
	}

	return template.dsl;
}

/**
 * Resolves a primitive or responsive value token to a string for the active breakpoint.
 *
 * @param value Raw modifier value.
 * @param breakpoint Current breakpoint.
 * @returns Breakpoint-resolved string.
 */
export function resolveResponsiveToken(value: string, breakpoint: HubSkeletonBreakpoint): string {
	const parsed = parseResponsiveToken(value);
	if (typeof parsed !== 'object' || parsed === null) {
		return String(parsed);
	}

	let resolved: HubSkeletonPrimitive | undefined = parsed.base;
	for (const key of BREAKPOINT_ORDER) {
		if (key === 'base') {
			continue;
		}

		if (BREAKPOINT_ORDER.indexOf(key) <= BREAKPOINT_ORDER.indexOf(breakpoint) && parsed[key] !== undefined) {
			resolved = parsed[key];
		}
	}

	return String(resolved ?? '');
}

/**
 * Maps the current viewport width to the nearest supported breakpoint id.
 *
 * @param width Viewport width in pixels.
 * @returns Breakpoint identifier.
 */
export function resolveBreakpointFromWidth(width: number): HubSkeletonBreakpoint {
	if (width >= BREAKPOINT_WIDTHS.xl) {
		return 'xl';
	}
	if (width >= BREAKPOINT_WIDTHS.lg) {
		return 'lg';
	}
	if (width >= BREAKPOINT_WIDTHS.md) {
		return 'md';
	}
	if (width >= BREAKPOINT_WIDTHS.sm) {
		return 'sm';
	}
	return 'base';
}

/**
 * Resolves an AST into render nodes, expanding preset aliases recursively.
 *
 * @param nodes AST nodes to resolve.
 * @param options Resolution context.
 * @returns Render nodes ready for the component template.
 */
export function resolveHubSkeletonNodes(
	nodes: readonly HubSkeletonAstNode[],
	options: {
		readonly breakpoint: HubSkeletonBreakpoint;
		readonly params: HubSkeletonParams;
		readonly registry: { getPreset(name: string): HubSkeletonPreset | undefined };
		readonly fallbackVariant?: string;
	}
): readonly HubSkeletonRenderNode[] {
	const counter = { value: 0 };

	const resolveNode = (
		node: HubSkeletonAstNode,
		inheritedParams: HubSkeletonParams,
		inheritedVariant?: string
	): HubSkeletonRenderNode[] => {
		const runtimeVariant = node.variant ?? inheritedVariant;
		const runtimeParams = {
			...inheritedParams,
			...convertNodePropsToParams(node.props, options.breakpoint)
		};

		if (BUILTIN_NODE_TYPES.has(node.name)) {
			const props = resolveProps(node.props, options.breakpoint);
			const builtNode: HubSkeletonRenderNode = {
				id: `hub-skeleton-node-${counter.value++}`,
				type: node.name as HubSkeletonRenderNode['type'],
				props,
				children: resolveNodes(node.children, runtimeParams, runtimeVariant),
				isSurface: node.name === 'line' || node.name === 'block' || node.name === 'circle'
			};

			return Array.from({ length: node.repeat }, () => builtNode).map((entry, index) => ({
				...entry,
				id: `${entry.id}-${index}`
			}));
		}

		const preset = options.registry.getPreset(node.name);
		if (!preset) {
			throw new Error(`Unknown skeleton node or preset alias "${node.name}".`);
		}

		const activeVariant = runtimeVariant ?? options.fallbackVariant;
		const variantDef = activeVariant ? preset.variants?.[activeVariant] : undefined;
		const presetParams = {
			...preset.defaults,
			...variantDef?.defaults,
			...runtimeParams
		};
		const presetTemplate = variantDef?.template ?? preset.template;
		const presetDsl = interpolateHubSkeletonParams(
			resolveTemplateDsl(presetTemplate, options.breakpoint),
			presetParams
		);
		const presetAst = parseHubSkeletonDsl(presetDsl);
		const resolvedPresetNodes = resolveNodes(presetAst, presetParams, activeVariant);

		return Array.from({ length: node.repeat }, () => resolvedPresetNodes).flat();
	};

	const resolveNodes = (
		inputNodes: readonly HubSkeletonAstNode[],
		params: HubSkeletonParams,
		variant?: string
	): HubSkeletonRenderNode[] => inputNodes.flatMap((node) => resolveNode(node, params, variant));

	return resolveNodes(nodes, options.params, options.fallbackVariant);
}

function resolveProps(
	props: Readonly<Record<string, string>>,
	breakpoint: HubSkeletonBreakpoint
): Record<string, string> {
	return Object.fromEntries(
		Object.entries(props).map(([key, value]) => [key, resolveResponsiveToken(value, breakpoint)])
	);
}

function convertNodePropsToParams(
	props: Readonly<Record<string, string>>,
	breakpoint: HubSkeletonBreakpoint
): HubSkeletonParams {
	const entries = Object.entries(props).map(([key, value]) => {
		const resolvedValue = resolveResponsiveToken(value, breakpoint);
		return [key, parsePrimitiveToken(resolvedValue)];
	});

	return Object.fromEntries(entries);
}

function parseResponsiveToken(value: string): HubSkeletonResponsiveValue {
	if (!value.includes('|')) {
		return parsePrimitiveToken(value);
	}

	const responsive: Partial<Record<HubSkeletonBreakpoint, HubSkeletonPrimitive>> = {};
	for (const part of value.split('|')) {
		const trimmedPart = part.trim();
		if (!trimmedPart) {
			continue;
		}

		if (!trimmedPart.includes('=')) {
			responsive.base = parsePrimitiveToken(trimmedPart);
			continue;
		}

		const [breakpoint, rawToken] = trimmedPart.split('=');
		const normalizedBreakpoint = breakpoint.trim();
		if (isBreakpoint(normalizedBreakpoint)) {
			responsive[normalizedBreakpoint] = parsePrimitiveToken(rawToken.trim());
		}
	}

	return responsive;
}

function isBreakpoint(value: string): value is HubSkeletonBreakpoint {
	return BREAKPOINT_ORDER.includes(value as HubSkeletonBreakpoint);
}

function parsePrimitiveToken(value: string): HubSkeletonPrimitive {
	const trimmedValue = value.trim();
	if (trimmedValue === 'true') {
		return true;
	}
	if (trimmedValue === 'false') {
		return false;
	}
	if (/^-?\d+(\.\d+)?$/.test(trimmedValue)) {
		return Number(trimmedValue);
	}
	return trimmedValue;
}
