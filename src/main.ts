import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    ...appConfig.providers // ✅ Asegura que `appConfig` se pase correctamente
  ],
})
  .catch((err) => console.error(err));
