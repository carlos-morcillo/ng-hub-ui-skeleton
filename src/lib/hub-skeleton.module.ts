import { NgModule } from '@angular/core';
import { HubSkeletonComponent } from './hub-skeleton.component';

/**
 * Backward-compatibility module for NgModule-based applications.
 *
 * @deprecated Import the standalone `HubSkeletonComponent` directly; this module only
 * re-exports it and provides nothing of its own. Custom presets are registered with
 * `provideHubSkeletonPresets()`, which never travelled through here. Scheduled for
 * removal in **23.0.0**.
 */
@NgModule({
	imports: [HubSkeletonComponent],
	exports: [HubSkeletonComponent]
})
export class HubSkeletonModule {}
