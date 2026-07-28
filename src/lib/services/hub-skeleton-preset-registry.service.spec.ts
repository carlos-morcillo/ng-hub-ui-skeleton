import { TestBed } from '@angular/core/testing';
import { HubSkeletonPreset } from '../models/hub-skeleton.types';
import { HUB_SKELETON_DEFAULT_PRESETS } from '../presets/hub-skeleton-default-presets';
import { interpolateHubSkeletonParams, parseHubSkeletonDsl, resolveTemplateDsl } from '../utils/hub-skeleton-dsl';
import {
	HUB_SKELETON_PRESETS,
	HubSkeletonPresetRegistryService,
	provideHubSkeletonPresets
} from './hub-skeleton-preset-registry.service';

describe('HubSkeletonPresetRegistryService', () => {
	it('exposes the bundled default presets', () => {
		const service = TestBed.inject(HubSkeletonPresetRegistryService);

		for (const name of ['card', 'list-item', 'table-row', 'detail-view', 'form-section']) {
			expect(service.getPreset(name)?.name).toBe(name);
		}
		expect(service.presets().size).toBe(HUB_SKELETON_DEFAULT_PRESETS.length);
	});

	it('returns undefined for unknown preset names', () => {
		const service = TestBed.inject(HubSkeletonPresetRegistryService);

		expect(service.getPreset('does-not-exist')).toBeUndefined();
	});

	it('merges custom presets provided through the multi token', () => {
		const custom: HubSkeletonPreset = { name: 'profile-card', template: 'stack>circle(size:72)+line(width:46%)' };
		TestBed.configureTestingModule({
			providers: [{ provide: HUB_SKELETON_PRESETS, multi: true, useValue: [custom] }]
		});

		const service = TestBed.inject(HubSkeletonPresetRegistryService);

		expect(service.getPreset('profile-card')).toBe(custom);
		expect(service.presets().size).toBe(HUB_SKELETON_DEFAULT_PRESETS.length + 1);
	});

	it('lets a custom preset override a bundled preset with the same name', () => {
		const override: HubSkeletonPreset = { name: 'card', template: 'block(height:100)' };
		TestBed.configureTestingModule({
			providers: [{ provide: HUB_SKELETON_PRESETS, multi: true, useValue: [override] }]
		});

		const service = TestBed.inject(HubSkeletonPresetRegistryService);

		expect(service.getPreset('card')).toBe(override);
		expect(service.presets().size).toBe(HUB_SKELETON_DEFAULT_PRESETS.length);
	});

	it('resolves conflicts between provider groups in favour of the later group', () => {
		const first: HubSkeletonPreset = { name: 'banner', template: 'line' };
		const second: HubSkeletonPreset = { name: 'banner', template: 'block(height:80)' };
		TestBed.configureTestingModule({
			providers: [
				{ provide: HUB_SKELETON_PRESETS, multi: true, useValue: [first] },
				{ provide: HUB_SKELETON_PRESETS, multi: true, useValue: [second] }
			]
		});

		const service = TestBed.inject(HubSkeletonPresetRegistryService);

		expect(service.getPreset('banner')).toBe(second);
	});

	it('registers presets through provideHubSkeletonPresets', () => {
		const custom: HubSkeletonPreset = { name: 'hero', template: 'block(height:220,radius:20)' };
		TestBed.configureTestingModule({
			providers: [provideHubSkeletonPresets([custom])]
		});

		const service = TestBed.inject(HubSkeletonPresetRegistryService);

		expect(service.getPreset('hero')).toBe(custom);
	});

	it('ships default preset templates that parse without errors', () => {
		for (const preset of HUB_SKELETON_DEFAULT_PRESETS) {
			const dsl = interpolateHubSkeletonParams(resolveTemplateDsl(preset.template, 'base'), preset.defaults ?? {});

			expect(() => parseHubSkeletonDsl(dsl), `preset "${preset.name}" should parse`).not.toThrow();
		}
	});
});
