import { Observable } from "rxjs";
import { VoiceControlStatus } from "../model/voice-control-status.model";

export interface VoiceControlPort {
    toggleSpeech(text: string): Promise<void>;
    stopSpeech(): void;
    increaseRate(): void;
    decreaseRate(): void;
    setVolume(newVolume: number): void;
    onBtnPressed(name: "play" | "pause" | "stop" | "increase_rate" | "lower_rate" ): void;
    status$: Observable<VoiceControlStatus>;
    addHighlight$: Observable<number>;
    removeHighlight$: Observable<number>;
    onBtnPressed$: Observable<string>;
}