# ng-hub-ui-skeleton

Dynamic Angular skeleton placeholders with a compact DSL, reusable presets, responsive values, and programmable registration.

## Install

```bash
npm install ng-hub-ui-skeleton
```

## Basic usage

```ts
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';
```

```html
<hub-skeleton preset="card"></hub-skeleton>
<hub-skeleton template="stack(gap:12)>circle(size:48)+stack(gap:8)>line(width:40%)+line(width:72%)"></hub-skeleton>
```

## Programmatic preset registration

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHubSkeletonPresets } from 'ng-hub-ui-skeleton';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHubSkeletonPresets([
      {
        name: 'profile-card',
        template:
          'stack(gap:16)>circle(size:72)+line(width:52%,height:18)+line(width:70%,height:12)+grid(columns:2|md=4,gap:10)>block(height:56)*4'
      }
    ])
  ]
};
```
