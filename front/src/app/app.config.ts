import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.route.module';
import { AI_TUTOR_TOKEN } from './ports/AITutor.token';
import { VOICE_CONTROL_TOKEN } from './ports/voice-control.token';
import { DeepSeekAdapter } from './services/AI/implementations/DeepSeekTutor';
import { VoiceControlService } from './services/voice-control.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { 
      provide: VOICE_CONTROL_TOKEN , useClass: VoiceControlService
    },
    { 
      provide: AI_TUTOR_TOKEN, useClass: DeepSeekAdapter
    },
    provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(), provideRouter(routes, withComponentInputBinding())]
};
