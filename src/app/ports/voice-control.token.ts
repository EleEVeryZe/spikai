import { InjectionToken } from "@angular/core";
import { VoiceControlPort } from "./voice-control.port";

export const VOICE_CONTROL_TOKEN = new InjectionToken<VoiceControlPort>("VOICE_CONTROL_TOKEN");