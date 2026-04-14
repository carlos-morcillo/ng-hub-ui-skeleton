import { EnvironmentProviders, Injectable, InjectionToken, computed, inject, makeEnvironmentProviders } from '@angular/core';
import { HUB_SKELETON_DEFAULT_PRESETS } from '../presets/hub-skeleton-default-presets';
import { HubSkeletonPreset } from '../models/hub-skeleton.types';

/** Multi-provider token for consumer-defined skeleton preset groups. */
export const HUB_SKELETON_PRESETS = new InjectionToken<readonly (readonly HubSkeletonPreset[])[]>(
	'HUB_SKELETON_PRESETS',
	{
	factory: () => []
	}
);

/**
 * Registers one or more custom presets for the active injector tree.
 *
 * @param presets Custom presets to append to the bundled catalogue.
 * @returns Environment providers ready for app-level registration.
 */
export function provideHubSkeletonPresets(presets: readonly HubSkeletonPreset[]): EnvironmentProviders {
	return makeEnvironmentProviders([
		{
			provide: HUB_SKELETON_PRESETS,
			multi: true,
			useValue: presets
		}
	]);
}

/**
 * Resolves the full preset catalogue available to the current injector.
 */
@Injectable({ providedIn: 'root' })
export class HubSkeletonPresetRegistryService {
	private readonly customPresetGroups = inject(HUB_SKELETON_PRESETS);

	/** All presets merged by name, where later entries override earlier ones. */
	readonly presets = computed(() => {
		const merged = new Map<string, HubSkeletonPreset>();

		for (const preset of HUB_SKELETON_DEFAULT_PRESETS) {
			merged.set(preset.name, preset);
		}

		for (const presetGroup of this.customPresetGroups) {
			for (const preset of presetGroup) {
				merged.set(preset.name, preset);
			}
		}

		return merged;
	});

	/**
	 * Returns a single preset by name.
	 *
	 * @param name Preset identifier.
	 * @returns Matching preset, when available.
	 */
	getPreset(name: string): HubSkeletonPreset | undefined {
		return this.presets().get(name);
	}
}
