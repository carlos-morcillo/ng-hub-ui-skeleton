# Breaking Changes — ng-hub-ui-skeleton

## [22.3.0] - 2026-09-06
### Custom presets are read from the environment injector the application bootstrapped

- **Change**: `<hub-skeleton>` no longer provides `HubSkeletonPresetRegistryService` on its own
  element injector. The component resolves the `providedIn: 'root'` instance, so the catalogue is
  built once for the whole application instead of once per placeholder.
- **Impact**: `HUB_SKELETON_PRESETS` registered below the root environment injector no longer
  reaches the component — a `provideHubSkeletonPresets(...)` in a lazy route's `providers`, or a
  raw `{ provide: HUB_SKELETON_PRESETS, multi: true }` in a component's `providers`. Those presets
  used to be found because the registry was instantiated at the element, next to them. Nothing
  warns at build time: the component throws `Unknown skeleton preset "…"` the first time it
  renders. An application that registers its presets at bootstrap — the arrangement the README
  documents — is unaffected.
- **Migration**: move the registration to the application providers, or keep the narrower scope by
  providing the registry alongside the presets so that subtree owns its own catalogue:

  ```ts
  providers: [HubSkeletonPresetRegistryService, { provide: HUB_SKELETON_PRESETS, multi: true, useValue: presets }]
  ```


### Announced: `HubSkeletonModule` is removed in 23.0.0

- **Change**: the class is now marked `@deprecated`. Nothing is removed here and nothing changes at
  runtime — this release is the notice, and the removal lands in 23.0.0, the next version that tracks
  a new Angular major.
- **Impact**: from 23.0.0 the symbol is gone from the entry point, so `import { HubSkeletonModule }`
  and `imports: [HubSkeletonModule]` stop compiling.
- **Migration**: import the standalone `HubSkeletonComponent`. It is what the module re-exported, and
  the module provided nothing else — custom presets go through `provideHubSkeletonPresets()`, which
  never travelled through it.

  ```ts
  // Before
  @NgModule({ imports: [HubSkeletonModule] })
  export class AppModule {}

  // After
  @Component({ imports: [HubSkeletonComponent] })
  export class OrdersComponent {}
  ```

## [22.2.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-skeleton/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/skeleton/styles/...` instead of `dist/skeleton/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-skeleton/styles' as *;`

