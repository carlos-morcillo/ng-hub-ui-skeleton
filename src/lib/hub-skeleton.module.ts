import { NgModule } from '@angular/core';
import { HubSkeletonComponent } from './hub-skeleton.component';

/**
 * NgModule wrapper kept for compatibility with module-based Angular apps.
 */
@NgModule({
	imports: [HubSkeletonComponent],
	exports: [HubSkeletonComponent]
})
export class HubSkeletonModule {}
