import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.route.module';
import { VOICE_CONTROL_TOKEN } from './ports/voice-control.token';
import { VoiceControlService } from './services/voice-control.service';

export const appConfig: ApplicationConfig = {
  providers: [{provide: VOICE_CONTROL_TOKEN , useClass: VoiceControlService}, provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(), provideRouter(routes, withComponentInputBinding())]
};
