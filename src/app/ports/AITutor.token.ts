import { InjectionToken } from "@angular/core";
import { AITutorPort } from "./AITutor.port";

export const AI_TUTOR_TOKEN = new InjectionToken<AITutorPort>("VOICE_CONTROL_TOKEN");