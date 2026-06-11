import { DOCUMENT, NgStyle, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	computed,
	inject,
	input,
	signal
} from '@angular/core';
import {
	HubSkeletonAppearance,
	HubSkeletonParams,
	HubSkeletonRenderNode,
	HubSkeletonTemplateInput
} from './models/hub-skeleton.types';
import { HubSkeletonPresetRegistryService } from './services/hub-skeleton-preset-registry.service';
import {
	interpolateHubSkeletonParams,
	parseHubSkeletonDsl,
	resolveBreakpointFromWidth,
	resolveHubSkeletonNodes,
	resolveTemplateDsl
} from './utils/hub-skeleton-dsl';

/**
 * Dynamic skeleton component that renders bundled presets or compact inline DSL templates.
 */
@Component({
	selector: 'hub-skeleton',
	standalone: true,
	imports: [NgStyle, NgTemplateOutlet],
	providers: [HubSkeletonPresetRegistryService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div
			class="hub-skeleton"
			[class.hub-skeleton--animated]="animated()"
			[class.hub-skeleton--subtle]="appearance() === 'subtle'"
			[class.hub-skeleton--contrast]="appearance() === 'contrast'"
			[attr.aria-label]="ariaLabel()"
			role="presentation"
		>
			<ng-container *ngTemplateOutlet="renderNodes; context: { $implicit: resolvedNodes() }"></ng-container>
		</div>

		<ng-template #renderNodes let-nodes>
			@for (node of nodes; track node.id) {
				<div
					class="hub-skeleton__node"
					[class.hub-skeleton__node--surface]="node.isSurface"
					[class.hub-skeleton__node--line]="node.type === 'line'"
					[class.hub-skeleton__node--block]="node.type === 'block'"
					[class.hub-skeleton__node--circle]="node.type === 'circle'"
					[class.hub-skeleton__node--stack]="node.type === 'stack'"
					[class.hub-skeleton__node--grid]="node.type === 'grid'"
					[class.hub-skeleton__node--row]="node.type === 'stack' && node.props['direction'] === 'row'"
					[class.hub-skeleton__node--grow]="node.props['grow'] === 'true'"
					[ngStyle]="buildStyles(node)"
					aria-hidden="true"
				>
					@if (node.children.length > 0) {
						<ng-container *ngTemplateOutlet="renderNodes; context: { $implicit: node.children }"></ng-container>
					}
				</div>
			}
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;
			}

			.hub-skeleton {
				--hub-skeleton-bg: rgba(148, 163, 184, 0.18);
				--hub-skeleton-highlight: rgba(255, 255, 255, 0.52);
				--hub-skeleton-radius: 12px;
				--hub-skeleton-gap: 12px;
				--hub-skeleton-animation-duration: 1.35s;
				display: block;
				width: 100%;
			}

			.hub-skeleton--subtle {
				--hub-skeleton-bg: rgba(148, 163, 184, 0.12);
				--hub-skeleton-highlight: rgba(255, 255, 255, 0.38);
			}

			.hub-skeleton--contrast {
				--hub-skeleton-bg: rgba(71, 85, 105, 0.28);
				--hub-skeleton-highlight: rgba(255, 255, 255, 0.28);
			}

			.hub-skeleton__node {
				box-sizing: border-box;
				min-width: 0;
			}

			.hub-skeleton__node--surface {
				background: linear-gradient(
					90deg,
					var(--hub-skeleton-bg) 0%,
					var(--hub-skeleton-bg) 32%,
					var(--hub-skeleton-highlight) 50%,
					var(--hub-skeleton-bg) 68%,
					var(--hub-skeleton-bg) 100%
				);
				background-size: 220% 100%;
				border-radius: var(--hub-skeleton-node-radius, var(--hub-skeleton-radius));
			}

			.hub-skeleton--animated .hub-skeleton__node--surface {
				animation: hub-skeleton-shimmer var(--hub-skeleton-animation-duration) ease-in-out infinite;
			}

			.hub-skeleton__node--line,
			.hub-skeleton__node--block,
			.hub-skeleton__node--circle {
				width: var(--hub-skeleton-node-width, 100%);
				height: var(--hub-skeleton-node-height, 12px);
			}

			.hub-skeleton__node--circle {
				width: var(--hub-skeleton-node-size, var(--hub-skeleton-node-width, 40px));
				height: var(--hub-skeleton-node-size, var(--hub-skeleton-node-height, 40px));
				border-radius: 999px;
			}

			.hub-skeleton__node--stack {
				display: flex;
				flex-direction: column;
				gap: var(--hub-skeleton-node-gap, var(--hub-skeleton-gap));
				align-items: var(--hub-skeleton-node-align, stretch);
				justify-content: var(--hub-skeleton-node-justify, flex-start);
			}

			.hub-skeleton__node--row {
				flex-direction: row;
			}

			.hub-skeleton__node--grid {
				display: grid;
				grid-template-columns: repeat(var(--hub-skeleton-node-columns, 2), minmax(0, 1fr));
				gap: var(--hub-skeleton-node-gap, var(--hub-skeleton-gap));
				align-items: var(--hub-skeleton-node-align, stretch);
			}

			.hub-skeleton__node--grow {
				flex: 1 1 auto;
			}

			@keyframes hub-skeleton-shimmer {
				from {
					background-position: 100% 0;
				}
				to {
					background-position: -100% 0;
				}
			}
		`
	]
})
export class HubSkeletonComponent implements OnInit, OnDestroy {
	/** Built-in or registered preset name. */
	readonly preset = input<string | null>(null);

	/** Inline compact DSL template or template definition object. */
	readonly template = input<HubSkeletonTemplateInput | null>(null);

	/** Serializable params interpolated before parsing. */
	readonly params = input<HubSkeletonParams>({});

	/** Optional named variant. */
	readonly variant = input<string | null>(null);

	/** Toggles shimmer animation. */
	readonly animated = input(true);

	/** Visual appearance preset. */
	readonly appearance = input<HubSkeletonAppearance>('default');

	/** Optional accessible label applied to the container. */
	readonly ariaLabel = input('Loading placeholder');

	private readonly document = inject(DOCUMENT);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly registry = inject(HubSkeletonPresetRegistryService);

	private resizeCleanup: (() => void) | null = null;
	private readonly viewportWidth = signal(1200);
	readonly activeBreakpoint = computed(() => resolveBreakpointFromWidth(this.viewportWidth()));

	/** Resolved render nodes after preset expansion and breakpoint evaluation. */
	readonly resolvedNodes = computed<readonly HubSkeletonRenderNode[]>(() => {
		const { template, params, variant } = this.resolveRuntimeTemplate();
		const dsl = interpolateHubSkeletonParams(
			resolveTemplateDsl(template, this.activeBreakpoint()),
			params
		);
		const ast = parseHubSkeletonDsl(dsl);

		return resolveHubSkeletonNodes(ast, {
			breakpoint: this.activeBreakpoint(),
			params,
			registry: this.registry,
			fallbackVariant: variant ?? undefined
		});
	});

	ngOnInit(): void {
		if (!isPlatformBrowser(this.platformId) || !this.document.defaultView) {
			return;
		}

		const win = this.document.defaultView;
		this.viewportWidth.set(win.innerWidth);

		const listener = () => this.viewportWidth.set(win.innerWidth);
		win.addEventListener('resize', listener, { passive: true });
		this.resizeCleanup = () => win.removeEventListener('resize', listener);
	}

	ngOnDestroy(): void {
		this.resizeCleanup?.();
	}

	/**
	 * Converts node props into CSS custom properties consumed by the template.
	 *
	 * @param node Render node.
	 * @returns Style object.
	 */
	buildStyles(node: HubSkeletonRenderNode): Record<string, string | null> {
		const props = node.props;
		return {
			'--hub-skeleton-node-width': props['width'] ?? null,
			'--hub-skeleton-node-height': this.toCssSize(props['height']),
			'--hub-skeleton-node-size': this.toCssSize(props['size']),
			'--hub-skeleton-node-radius': this.toCssSize(props['radius']),
			'--hub-skeleton-node-gap': this.toCssSize(props['gap']),
			'--hub-skeleton-node-columns': props['columns'] ?? null,
			'--hub-skeleton-node-align': props['align'] ?? null,
			'--hub-skeleton-node-justify': props['justify'] ?? null
		};
	}

	private resolveRuntimeTemplate(): {
		readonly template: HubSkeletonTemplateInput;
		readonly params: HubSkeletonParams;
		readonly variant: string | null;
	} {
		const presetName = this.preset();
		const variantName = this.variant();
		const inlineTemplate = this.template();

		if (presetName) {
			const preset = this.registry.getPreset(presetName);
			if (!preset) {
				throw new Error(`Unknown skeleton preset "${presetName}".`);
			}

			const activeVariant = variantName ? preset.variants?.[variantName] : undefined;
			return {
				template: activeVariant?.template ?? preset.template,
				params: {
					...preset.defaults,
					...activeVariant?.defaults,
					...this.params()
				},
				variant: variantName
			};
		}

		if (!inlineTemplate) {
			throw new Error('hub-skeleton requires either `preset` or `template`.');
		}

		return {
			template: inlineTemplate,
			params: this.params(),
			variant: variantName
		};
	}

	private toCssSize(value: string | undefined): string | null {
		if (!value) {
			return null;
		}

		if (/^-?\d+(\.\d+)?$/.test(value)) {
			return `${value}px`;
		}

		return value;
	}
}
