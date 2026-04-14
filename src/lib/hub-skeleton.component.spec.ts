import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { HubSkeletonComponent } from './hub-skeleton.component';
import { HUB_SKELETON_PRESETS } from './services/hub-skeleton-preset-registry.service';
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
});
