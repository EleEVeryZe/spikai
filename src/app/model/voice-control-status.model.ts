export interface VoiceControlStatus {
  isSpeaking: boolean;
  isPaused: boolean;
  worksInThisBrowser: boolean;
  currentSpokenWordIndex: number;
  rate: number;
  currentText?: string;
  volume?: number
}