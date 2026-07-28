import { TestBed } from '@angular/core/testing';
import { HubSkeletonComponent } from '../hub-skeleton.component';
import { HubSkeletonPreset } from '../models/hub-skeleton.types';
import {
	interpolateHubSkeletonParams,
	parseHubSkeletonDsl,
	resolveBreakpointFromWidth,
	resolveHubSkeletonNodes,
	resolveResponsiveToken,
	resolveTemplateDsl
} from './hub-skeleton-dsl';

/**
 * Builds a minimal preset registry stub backed by a plain array.
 *
 * @param presets Presets resolvable through the stub.
 * @returns Registry-compatible object for `resolveHubSkeletonNodes`.
 */
function createRegistryStub(presets: readonly HubSkeletonPreset[] = []): {
	getPreset(name: string): HubSkeletonPreset | undefined;
} {
	return {
		getPreset: (name: string) => presets.find((preset) => preset.name === name)
	};
}

describe('parseHubSkeletonDsl', () => {
	describe('single nodes', () => {
		it('parses a bare node with default shape', () => {
			const nodes = parseHubSkeletonDsl('line');

			expect(nodes).toHaveLength(1);
			expect(nodes[0]).toEqual({
				name: 'line',
				props: {},
				variant: undefined,
				children: [],
				repeat: 1
			});
		});

		it('parses every built-in node type name', () => {
			for (const name of ['line', 'block', 'circle', 'stack', 'grid']) {
				const nodes = parseHubSkeletonDsl(name);
				expect(nodes).toHaveLength(1);
				expect(nodes[0].name).toBe(name);
			}
		});

		it('parses identifiers containing dashes and digits', () => {
			const nodes = parseHubSkeletonDsl('list-item2');
			expect(nodes[0].name).toBe('list-item2');
		});

		it('tolerates leading and trailing whitespace around the template', () => {
			const nodes = parseHubSkeletonDsl('   line   ');
			expect(nodes).toHaveLength(1);
			expect(nodes[0].name).toBe('line');
		});
	});

	describe('siblings and children', () => {
		it('parses sibling nodes joined with "+"', () => {
			const nodes = parseHubSkeletonDsl('line+block+circle');

			expect(nodes.map((node) => node.name)).toEqual(['line', 'block', 'circle']);
		});

		it('parses child nodes attached with ">"', () => {
			const nodes = parseHubSkeletonDsl('stack>line+block');

			expect(nodes).toHaveLength(1);
			expect(nodes[0].name).toBe('stack');
			expect(nodes[0].children.map((child) => child.name)).toEqual(['line', 'block']);
		});

		it('parses multi-level nesting chains', () => {
			const nodes = parseHubSkeletonDsl('stack>grid>stack>line');

			expect(nodes[0].name).toBe('stack');
			expect(nodes[0].children[0].name).toBe('grid');
			expect(nodes[0].children[0].children[0].name).toBe('stack');
			expect(nodes[0].children[0].children[0].children[0].name).toBe('line');
		});

		it('parses deep nesting without degrading', () => {
			const depth = 12;
			const dsl = `${Array.from({ length: depth }, () => 'stack').join('>')}>line`;
			let current = parseHubSkeletonDsl(dsl)[0];
			let visited = 1;

			while (current.children.length > 0) {
				current = current.children[0];
				visited += 1;
			}

			expect(visited).toBe(depth + 1);
			expect(current.name).toBe('line');
		});

		it('tolerates whitespace around "+", ">" and "*" operators', () => {
			const nodes = parseHubSkeletonDsl('stack(gap:12) > line + block * 2');

			expect(nodes[0].name).toBe('stack');
			expect(nodes[0].children.map((child) => child.name)).toEqual(['line', 'block']);
			expect(nodes[0].children[1].repeat).toBe(2);
		});
	});

	describe('props', () => {
		it('parses key:value modifier pairs', () => {
			const nodes = parseHubSkeletonDsl('line(width:50%,height:12)');

			expect(nodes[0].props).toEqual({ width: '50%', height: '12' });
		});

		it('trims whitespace inside modifier entries', () => {
			const nodes = parseHubSkeletonDsl('line( width : 50% , height : 12 )');

			expect(nodes[0].props).toEqual({ width: '50%', height: '12' });
		});

		it('parses value-less modifiers as boolean "true" flags', () => {
			const nodes = parseHubSkeletonDsl('stack(grow,gap:8)');

			expect(nodes[0].props).toEqual({ grow: 'true', gap: '8' });
		});

		it('keeps extra colons inside a modifier value', () => {
			const nodes = parseHubSkeletonDsl('line(label:a:b:c)');

			expect(nodes[0].props).toEqual({ label: 'a:b:c' });
		});

		it('preserves nested parentheses inside modifier values', () => {
			const nodes = parseHubSkeletonDsl('block(width:calc(100% - 20px))');

			expect(nodes[0].props).toEqual({ width: 'calc(100% - 20px)' });
		});

		it('does not split on commas nested inside parentheses', () => {
			const nodes = parseHubSkeletonDsl('block(width:min(10px,2rem),height:4)');

			expect(nodes[0].props).toEqual({ width: 'min(10px,2rem)', height: '4' });
		});

		it('parses an empty modifier block as no props', () => {
			const nodes = parseHubSkeletonDsl('line()');

			expect(nodes[0].props).toEqual({});
		});

		it('skips empty and key-less modifier entries', () => {
			const nodes = parseHubSkeletonDsl('line(width:5,,:ignored,)');

			expect(nodes[0].props).toEqual({ width: '5' });
		});
	});

	describe('variants and repeats', () => {
		it('parses the "@variant" selector', () => {
			const nodes = parseHubSkeletonDsl('card@compact');

			expect(nodes[0].name).toBe('card');
			expect(nodes[0].variant).toBe('compact');
		});

		it('parses the "*N" repeat suffix', () => {
			const nodes = parseHubSkeletonDsl('line*3');

			expect(nodes[0].repeat).toBe(3);
		});

		it('parses large multipliers', () => {
			const nodes = parseHubSkeletonDsl('line*999');

			expect(nodes[0].repeat).toBe(999);
		});

		it('applies the repeat to the node preceding a "+" sibling', () => {
			const nodes = parseHubSkeletonDsl('line*2+block');

			expect(nodes).toHaveLength(2);
			expect(nodes[0].repeat).toBe(2);
			expect(nodes[1].repeat).toBe(1);
		});

		it('binds the repeat to the child following ">"', () => {
			const nodes = parseHubSkeletonDsl('stack>line*3');

			expect(nodes[0].repeat).toBe(1);
			expect(nodes[0].children[0].repeat).toBe(3);
		});
	});

	describe('error paths', () => {
		it('throws on unexpected trailing tokens', () => {
			expect(() => parseHubSkeletonDsl('line)')).toThrowError('Unexpected token ")" at position 4.');
		});

		it('throws when a repeat is declared before the children operator', () => {
			// The grammar only accepts `*N` after children, so `stack*2>line` leaves ">" unconsumed.
			expect(() => parseHubSkeletonDsl('stack*2>line')).toThrowError('Unexpected token ">" at position 7.');
		});

		it('throws on a zero repeat value', () => {
			expect(() => parseHubSkeletonDsl('line*0')).toThrowError('Invalid repeat value "0" near position 6.');
		});

		it('throws on a negative repeat value', () => {
			expect(() => parseHubSkeletonDsl('line*-2')).toThrowError('Invalid repeat value "-2" near position 7.');
		});

		it('throws on a non-numeric repeat value', () => {
			expect(() => parseHubSkeletonDsl('line*abc')).toThrowError('Invalid repeat value "abc" near position 8.');
		});

		it('throws on a dangling repeat operator', () => {
			expect(() => parseHubSkeletonDsl('line*')).toThrowError('Invalid repeat value "" near position 5.');
		});

		it('throws on an unclosed modifier block', () => {
			expect(() => parseHubSkeletonDsl('line(width:50%')).toThrowError('Unclosed modifier block in skeleton DSL.');
		});

		it('throws on empty input', () => {
			expect(() => parseHubSkeletonDsl('')).toThrowError('Expected identifier near position 0.');
		});

		it('throws on whitespace-only input', () => {
			expect(() => parseHubSkeletonDsl('   ')).toThrowError('Expected identifier near position 3.');
		});

		it('throws when ">" has no child node', () => {
			expect(() => parseHubSkeletonDsl('stack>')).toThrowError('Expected identifier near position 6.');
		});

		it('throws when "+" has no sibling node', () => {
			expect(() => parseHubSkeletonDsl('line+')).toThrowError('Expected identifier near position 5.');
		});

		it('throws on a leading "+" operator', () => {
			expect(() => parseHubSkeletonDsl('+line')).toThrowError('Expected identifier near position 0.');
		});

		it('throws when "@" has no variant identifier', () => {
			expect(() => parseHubSkeletonDsl('line@')).toThrowError('Expected identifier near position 5.');
		});
	});
});

describe('interpolateHubSkeletonParams', () => {
	it('replaces placeholders with param values', () => {
		expect(interpolateHubSkeletonParams('line(width:{{width}})', { width: '50%' })).toBe('line(width:50%)');
	});

	it('tolerates whitespace inside placeholder braces', () => {
		expect(interpolateHubSkeletonParams('line(height:{{ height }})', { height: 12 })).toBe('line(height:12)');
	});

	it('replaces missing or undefined params with an empty string', () => {
		expect(interpolateHubSkeletonParams('line(width:{{missing}})', {})).toBe('line(width:)');
		expect(interpolateHubSkeletonParams('line(width:{{width}})', { width: undefined })).toBe('line(width:)');
	});

	it('stringifies number and boolean params', () => {
		expect(interpolateHubSkeletonParams('{{rows}}-{{grow}}', { rows: 4, grow: false })).toBe('4-false');
	});
});

describe('resolveTemplateDsl', () => {
	it('returns plain string templates unchanged', () => {
		expect(resolveTemplateDsl('line*2', 'lg')).toBe('line*2');
	});

	it('returns the base dsl of a template definition at the base breakpoint', () => {
		expect(resolveTemplateDsl({ dsl: 'line', responsive: { md: 'line*2' } }, 'base')).toBe('line');
	});

	it('returns the responsive override matching the active breakpoint', () => {
		expect(resolveTemplateDsl({ dsl: 'line', responsive: { md: 'line*2' } }, 'md')).toBe('line*2');
	});

	it('falls back to the base dsl when the breakpoint has no explicit override', () => {
		// Responsive template overrides do not cascade: only the exact breakpoint key wins.
		expect(resolveTemplateDsl({ dsl: 'line', responsive: { md: 'line*2' } }, 'lg')).toBe('line');
	});
});

describe('resolveResponsiveToken', () => {
	it('returns plain tokens unchanged', () => {
		expect(resolveResponsiveToken('50%', 'md')).toBe('50%');
		expect(resolveResponsiveToken('12', 'base')).toBe('12');
	});

	it('cascades responsive tokens up through the breakpoints', () => {
		const token = '1|md=2|lg=4';

		expect(resolveResponsiveToken(token, 'base')).toBe('1');
		expect(resolveResponsiveToken(token, 'sm')).toBe('1');
		expect(resolveResponsiveToken(token, 'md')).toBe('2');
		expect(resolveResponsiveToken(token, 'lg')).toBe('4');
		expect(resolveResponsiveToken(token, 'xl')).toBe('4');
	});

	it('supports the explicit "base=" segment syntax', () => {
		expect(resolveResponsiveToken('base=1|md=2', 'base')).toBe('1');
		expect(resolveResponsiveToken('base=1|md=2', 'md')).toBe('2');
	});

	it('returns an empty string below the first defined breakpoint', () => {
		expect(resolveResponsiveToken('md=2|lg=4', 'base')).toBe('');
		expect(resolveResponsiveToken('md=2|lg=4', 'md')).toBe('2');
	});

	it('ignores unknown breakpoints and empty segments', () => {
		expect(resolveResponsiveToken('1|foo=9|md=3', 'xl')).toBe('3');
		expect(resolveResponsiveToken('1||md=2', 'sm')).toBe('1');
	});

	it('resolves boolean tokens per breakpoint', () => {
		expect(resolveResponsiveToken('true|md=false', 'base')).toBe('true');
		expect(resolveResponsiveToken('true|md=false', 'md')).toBe('false');
	});
});

describe('resolveBreakpointFromWidth', () => {
	it('maps viewport widths to breakpoints at their exact boundaries', () => {
		expect(resolveBreakpointFromWidth(0)).toBe('base');
		expect(resolveBreakpointFromWidth(575)).toBe('base');
		expect(resolveBreakpointFromWidth(576)).toBe('sm');
		expect(resolveBreakpointFromWidth(767)).toBe('sm');
		expect(resolveBreakpointFromWidth(768)).toBe('md');
		expect(resolveBreakpointFromWidth(991)).toBe('md');
		expect(resolveBreakpointFromWidth(992)).toBe('lg');
		expect(resolveBreakpointFromWidth(1279)).toBe('lg');
		expect(resolveBreakpointFromWidth(1280)).toBe('xl');
		expect(resolveBreakpointFromWidth(3840)).toBe('xl');
	});
});

describe('resolveHubSkeletonNodes', () => {
	const baseOptions = {
		breakpoint: 'base' as const,
		params: {},
		registry: createRegistryStub()
	};

	it('marks line, block and circle as surface nodes', () => {
		const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('line+block+circle'), baseOptions);

		expect(rendered.map((node) => node.type)).toEqual(['line', 'block', 'circle']);
		expect(rendered.every((node) => node.isSurface)).toBe(true);
	});

	it('marks stack and grid as non-surface container nodes', () => {
		const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('stack+grid'), baseOptions);

		expect(rendered.map((node) => node.type)).toEqual(['stack', 'grid']);
		expect(rendered.every((node) => node.isSurface)).toBe(false);
	});

	it('assigns unique ids across sibling nodes', () => {
		const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('line+line+line'), baseOptions);

		expect(new Set(rendered.map((node) => node.id)).size).toBe(3);
	});

	it('resolves nested children recursively', () => {
		const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('stack>circle(size:40)+line(width:50%)'), baseOptions);

		expect(rendered).toHaveLength(1);
		expect(rendered[0].children.map((child) => child.type)).toEqual(['circle', 'line']);
		expect(rendered[0].children[0].props['size']).toBe('40');
	});

	it('expands the "*N" repeat into that many render nodes with unique ids', () => {
		const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('line*4'), baseOptions);

		expect(rendered).toHaveLength(4);
		expect(rendered.every((node) => node.type === 'line')).toBe(true);
		expect(new Set(rendered.map((node) => node.id)).size).toBe(4);
	});

	it('expands large multipliers', () => {
		const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('stack>line*250'), baseOptions);

		expect(rendered[0].children).toHaveLength(250);
	});

	it('resolves responsive prop tokens for the active breakpoint', () => {
		const ast = parseHubSkeletonDsl('grid(columns:1|md=2)');

		const baseNodes = resolveHubSkeletonNodes(ast, baseOptions);
		const mdNodes = resolveHubSkeletonNodes(ast, { ...baseOptions, breakpoint: 'md' });

		expect(baseNodes[0].props['columns']).toBe('1');
		expect(mdNodes[0].props['columns']).toBe('2');
	});

	it('throws for unknown node names and preset aliases', () => {
		expect(() => resolveHubSkeletonNodes(parseHubSkeletonDsl('mystery'), baseOptions)).toThrowError(
			'Unknown skeleton node or preset alias "mystery".'
		);
	});

	describe('preset expansion', () => {
		const avatarRow: HubSkeletonPreset = {
			name: 'avatar-row',
			template: 'stack(gap:{{gap}})>circle(size:{{size}})+line(width:{{width}})',
			defaults: { gap: 8, size: 40, width: '50%' },
			variants: {
				compact: { defaults: { size: 24 } },
				bare: { template: 'line(width:{{width}})' }
			}
		};
		const feed: HubSkeletonPreset = {
			name: 'feed',
			template: 'stack(gap:16)>avatar-row*2'
		};
		const rows: HubSkeletonPreset = {
			name: 'rows',
			template: 'stack>line(height:10)*{{rows}}',
			defaults: { rows: 2 }
		};
		const registry = createRegistryStub([avatarRow, feed, rows]);

		it('expands a preset alias applying its defaults', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('avatar-row'), { ...baseOptions, registry });

			expect(rendered).toHaveLength(1);
			expect(rendered[0].type).toBe('stack');
			expect(rendered[0].props['gap']).toBe('8');
			expect(rendered[0].children[0].props['size']).toBe('40');
			expect(rendered[0].children[1].props['width']).toBe('50%');
		});

		it('lets inline node props override preset defaults', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('avatar-row(size:64)'), { ...baseOptions, registry });

			expect(rendered[0].children[0].props['size']).toBe('64');
		});

		it('applies variant defaults selected with "@"', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('avatar-row@compact'), { ...baseOptions, registry });

			expect(rendered[0].children[0].props['size']).toBe('24');
		});

		it('uses the variant template override when defined', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('avatar-row@bare'), { ...baseOptions, registry });

			expect(rendered).toHaveLength(1);
			expect(rendered[0].type).toBe('line');
			expect(rendered[0].props['width']).toBe('50%');
		});

		it('applies the fallback variant when the node declares none', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('avatar-row'), {
				...baseOptions,
				registry,
				fallbackVariant: 'compact'
			});

			expect(rendered[0].children[0].props['size']).toBe('24');
		});

		it('repeats whole preset expansions with "*N"', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('avatar-row*3'), { ...baseOptions, registry });

			expect(rendered).toHaveLength(3);
			expect(rendered.every((node) => node.type === 'stack')).toBe(true);
		});

		it('expands presets nested inside other presets', () => {
			const rendered = resolveHubSkeletonNodes(parseHubSkeletonDsl('feed'), { ...baseOptions, registry });

			expect(rendered[0].type).toBe('stack');
			expect(rendered[0].children).toHaveLength(2);
			expect(rendered[0].children.every((child) => child.type === 'stack')).toBe(true);
			expect(rendered[0].children[0].children[0].type).toBe('circle');
		});

		it('interpolates runtime params into preset repeat counts', () => {
			const withDefaults = resolveHubSkeletonNodes(parseHubSkeletonDsl('rows'), { ...baseOptions, registry });
			const withOverride = resolveHubSkeletonNodes(parseHubSkeletonDsl('rows'), {
				...baseOptions,
				registry,
				params: { rows: 5 }
			});

			expect(withDefaults[0].children).toHaveLength(2);
			expect(withOverride[0].children).toHaveLength(5);
		});
	});
});

describe('HubSkeletonComponent DSL round-trips', () => {
	it('renders an inline DSL template into the expected node tree', async () => {
		await TestBed.configureTestingModule({ imports: [HubSkeletonComponent] }).compileComponents();

		const fixture = TestBed.createComponent(HubSkeletonComponent);
		fixture.componentRef.setInput('template', 'stack(gap:12)>circle(size:40)+line(width:50%)*2');
		fixture.detectChanges();

		const element: HTMLElement = fixture.nativeElement;
		expect(element.querySelectorAll('.hub-skeleton__node--stack').length).toBe(1);
		expect(element.querySelectorAll('.hub-skeleton__node--circle').length).toBe(1);
		expect(element.querySelectorAll('.hub-skeleton__node--line').length).toBe(2);
	});

	it('interpolates the params input before parsing the template', async () => {
		await TestBed.configureTestingModule({ imports: [HubSkeletonComponent] }).compileComponents();

		const fixture = TestBed.createComponent(HubSkeletonComponent);
		fixture.componentRef.setInput('template', 'stack(gap:{{gap}})>line(height:12)*{{rows}}');
		fixture.componentRef.setInput('params', { gap: 8, rows: 3 });
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelectorAll('.hub-skeleton__node--line').length).toBe(3);
	});
});
