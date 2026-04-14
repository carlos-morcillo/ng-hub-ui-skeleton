# ng-hub-ui-skeleton

Placeholders skeleton dinámicos para Angular con una DSL compacta, presets reutilizables, valores responsive y registro programático.

## Instalación

```bash
npm install ng-hub-ui-skeleton
```

## Uso básico

```ts
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';
```

```html
<hub-skeleton preset="card"></hub-skeleton>
<hub-skeleton template="stack(gap:12)>circle(size:48)+stack(gap:8)>line(width:40%)+line(width:72%)"></hub-skeleton>
```

## Registro programático de presets

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
