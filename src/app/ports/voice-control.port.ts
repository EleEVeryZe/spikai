import { Observable } from "rxjs";
import { VoiceControlStatus } from "../model/voice-control-status.model";

export interface VoiceControlPort {
    toggleSpeech(text: string): Promise<void>;
    stopSpeech(): void;
    increaseRate(): void;
    decreaseRate(): void;
    status$: Observable<VoiceControlStatus>;
    addHighlight$: Observable<number>;
    removeHighlight$: Observable<number>;
}