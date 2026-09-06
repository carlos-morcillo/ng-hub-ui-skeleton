import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HubSkeletonComponent } from './hub-skeleton.component';
import { HUB_SKELETON_PRESETS, HubSkeletonPresetRegistryService } from './services/hub-skeleton-preset-registry.service';
import { parseHubSkeletonDsl, resolveResponsiveToken } from './utils/hub-skeleton-dsl';

/**
 * Host component used to validate provider-driven custom presets.
 */
@Component({
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `<hub-skeleton preset="profile-card"></hub-skeleton>`
})
class HostSkeletonComponent {}

/**
 * Host with two sibling placeholders, used to observe which registry each one resolves.
 */
@Component({
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `<hub-skeleton preset="card"></hub-skeleton><hub-skeleton preset="list-item"></hub-skeleton>`
})
class SiblingSkeletonsHostComponent {}

/**
 * Host that scopes its own catalogue by providing the registry next to the presets token.
 */
@Component({
	standalone: true,
	imports: [HubSkeletonComponent],
	providers: [
		HubSkeletonPresetRegistryService,
		{
			provide: HUB_SKELETON_PRESETS,
			multi: true,
			useValue: [{ name: 'scoped-card', template: 'block(height:64)' }]
		}
	],
	template: `<hub-skeleton preset="scoped-card"></hub-skeleton>`
})
class ScopedRegistryHostComponent {}

describe('HubSkeletonComponent', () => {
	it('parses sibling and child nodes from the DSL', () => {
		const nodes = parseHubSkeletonDsl('stack(gap:12)>circle(size:40)+line(width:50%)*2');
		expect(nodes).toHaveLength(1);
		expect(nodes[0].name).toBe('stack');
		expect(nodes[0].children).toHaveLength(2);
		expect(nodes[0].children[1].repeat).toBe(2);
	});

	it('resolves responsive tokens according to the active breakpoint', () => {
		expect(resolveResponsiveToken('1|md=2|lg=4', 'base')).toBe('1');
		expect(resolveResponsiveToken('1|md=2|lg=4', 'md')).toBe('2');
		expect(resolveResponsiveToken('1|md=2|lg=4', 'lg')).toBe('4');
	});

	it('renders a built-in preset', async () => {
		await TestBed.configureTestingModule({
			imports: [HubSkeletonComponent]
		}).compileComponents();

		const fixture = TestBed.createComponent(HubSkeletonComponent);
		fixture.componentRef.setInput('preset', 'card');
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('.hub-skeleton')).toBeTruthy();
		expect(fixture.nativeElement.querySelectorAll('.hub-skeleton__node--surface').length).toBeGreaterThan(0);
	});

	it('renders a provider-registered custom preset', async () => {
		await TestBed.configureTestingModule({
			imports: [HostSkeletonComponent],
			providers: [
				{
					provide: HUB_SKELETON_PRESETS,
					multi: true,
					useValue: [
						{
							name: 'profile-card',
							template:
								'stack(gap:16)>circle(size:72)+line(width:46%)+line(width:68%)+grid(columns:2,gap:10)>block(height:56)*2'
						}
					]
				}
			]
		}).compileComponents();

		const fixture: ComponentFixture<HostSkeletonComponent> = TestBed.createComponent(HostSkeletonComponent);
		fixture.detectChanges();

		expect(fixture.nativeElement.querySelectorAll('.hub-skeleton__node--circle').length).toBe(1);
		expect(fixture.nativeElement.querySelectorAll('.hub-skeleton__node--block').length).toBeGreaterThan(1);
	});

	describe('preset registry ownership', () => {
		it('resolves the same registry for sibling placeholders', async () => {
			await TestBed.configureTestingModule({ imports: [SiblingSkeletonsHostComponent] }).compileComponents();

			const fixture: ComponentFixture<SiblingSkeletonsHostComponent> =
				TestBed.createComponent(SiblingSkeletonsHostComponent);
			fixture.detectChanges();

			const placeholders = fixture.debugElement.queryAll(By.directive(HubSkeletonComponent));
			expect(placeholders).toHaveLength(2);

			const [first, second] = placeholders.map((placeholder) =>
				placeholder.injector.get(HubSkeletonPresetRegistryService)
			);

			expect(first).toBe(second);
			expect(first).toBe(TestBed.inject(HubSkeletonPresetRegistryService));
		});

		it('lets an ancestor scope its own catalogue by providing the registry', async () => {
			await TestBed.configureTestingModule({ imports: [ScopedRegistryHostComponent] }).compileComponents();

			const fixture: ComponentFixture<ScopedRegistryHostComponent> = TestBed.createComponent(ScopedRegistryHostComponent);
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelectorAll('.hub-skeleton__node--block').length).toBe(1);
			expect(TestBed.inject(HubSkeletonPresetRegistryService).getPreset('scoped-card')).toBeUndefined();
		});
	});

	describe('accessibility', () => {
		let fixture: ComponentFixture<HubSkeletonComponent>;

		const container = (): HTMLElement => fixture.nativeElement.querySelector('.hub-skeleton');

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [HubSkeletonComponent]
			}).compileComponents();

			fixture = TestBed.createComponent(HubSkeletonComponent);
			fixture.componentRef.setInput('preset', 'card');
			fixture.detectChanges();
		});

		it('exposes the container as a polite busy status region', () => {
			expect(container().getAttribute('role')).toBe('status');
			expect(container().getAttribute('aria-live')).toBe('polite');
			expect(container().getAttribute('aria-busy')).toBe('true');
		});

		it('names the status region with the default label', () => {
			expect(container().getAttribute('aria-label')).toBe('Loading placeholder');
		});

		it('names the status region with the supplied label', () => {
			fixture.componentRef.setInput('ariaLabel', 'Cargando pedidos');
			fixture.detectChanges();

			expect(container().getAttribute('aria-label')).toBe('Cargando pedidos');
		});

		it('keeps the placeholder shapes out of the accessibility tree', () => {
			const nodes = Array.from(fixture.nativeElement.querySelectorAll('.hub-skeleton__node')) as HTMLElement[];

			expect(nodes.length).toBeGreaterThan(0);
			expect(nodes.every((node) => node.getAttribute('aria-hidden') === 'true')).toBe(true);
		});
	});
});
