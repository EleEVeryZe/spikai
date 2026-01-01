import { HostListener, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VoiceControlStatus } from '../model/voice-control-status.model';
import { VoiceControlPort } from '../ports/voice-control.port';

@Injectable({
  providedIn: 'root',
})
export class VoiceControlService implements VoiceControlPort, OnDestroy {
  statusInitialState = {
    isPaused: true,
    isSpeaking: false,
    currentSpokenWordIndex: 0,
    worksInThisBrowser: false,
    rate: 0.5,
    currentText: '',
    volume: 0.5,
  };
  state!: VoiceControlStatus;

  private statusSubject = new BehaviorSubject<VoiceControlStatus>(this.statusInitialState);
  status$ = this.statusSubject.asObservable();

  private addHighlightSubject = new Subject<number>();
  addHighlight$ = this.addHighlightSubject.asObservable();

  private removeHighlightSubject = new Subject<number>();
  removeHighlight$ = this.removeHighlightSubject.asObservable();

  private onBtnPressedSubject = new Subject<string>();
  onBtnPressed$ = this.onBtnPressedSubject.asObservable();

  utterance!: SpeechSynthesisUtterance | null;

  constructor() {
    const voiceBoard = localStorage.getItem('voiceBoard');
    if (voiceBoard) {
      const { rate, volume } = JSON.parse(voiceBoard);

      this.statusInitialState.rate = rate === undefined ? this.statusInitialState.rate : rate;
      this.statusInitialState.volume = volume === undefined ? this.statusInitialState.volume : volume;
    }

    this.state = { ...this.statusInitialState };

    this.initSpeech();
  }

  ngOnDestroy() {
    this.stopSpeech();
  }

  @HostListener('window:beforeunload', ['$event'])
  private unloadHandler() {
    this.stopSpeech();
  }

  onBtnPressed(name: 'play' | 'pause' | 'stop' | 'increase_rate' | 'lower_rate') {
    this.onBtnPressedSubject.next(name);
  }

  private updateStatusState(newState: Partial<VoiceControlStatus>) {
    this.state = { ...this.state, ...newState };
    this.statusSubject.next(this.state);
  }

  private initSpeech(): void {
    if (!('speechSynthesis' in window)) return;

    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }

  private updateVoiceBoard(newState: Partial<{ volume: number; rate: number }>) {
    const oldLocalStrg = localStorage.getItem('voiceBoard');
    if (oldLocalStrg) {
      const prevState = JSON.parse(oldLocalStrg);
      const newLocalStrg = JSON.stringify({ ...prevState, ...newState });
      localStorage.setItem('voiceBoard', newLocalStrg);
    } else {
      const newLocalStrg = JSON.stringify(newState);
      localStorage.setItem('voiceBoard', newLocalStrg);
    }
  }

  private getEnglishVoice(): SpeechSynthesisVoice | undefined {
    const voices = speechSynthesis.getVoices();
    return voices.find((voice) => voice.lang.startsWith('en'));
  }

  increaseRate() {
    if (this.state.rate < 2) {
      const newRate = parseFloat((this.state.rate + 0.1).toFixed(1));
      this.updateStatusState({ rate: newRate });
      this.stopSpeech();
      this.updateVoiceBoard({ rate: newRate });
    }
  }

  decreaseRate() {
    if (this.state.rate > 0.5) {
      const newRate = Number.parseFloat((this.state.rate - 0.1).toFixed(1));
      this.updateStatusState({ rate: newRate });
      if (this.state.isSpeaking) this.stopSpeech();
      this.updateVoiceBoard({ rate: newRate });
    }
  }

  setVolume(newVolume: number) {
    this.updateVoiceBoard({ volume: newVolume });
    this.updateStatusState({ volume: newVolume });
    if (this.state.isSpeaking) this.stopSpeech();
  }

  stopSpeech(): void {
    if (!this.state.isSpeaking) return;
    speechSynthesis.cancel();
    this.updateStatusState({ isPaused: true, isSpeaking: false });
    this.resetSpeechState();
  }

  async toggleSpeech(text: string) {
    if (speechSynthesis.speaking && speechSynthesis.paused) {
      if (this.state.worksInThisBrowser) speechSynthesis.resume();
      else speechSynthesis.cancel();
      this.updateStatusState({ isPaused: true, isSpeaking: false });
      return;
    }

    if (speechSynthesis.speaking) {
      if (this.state.worksInThisBrowser) speechSynthesis.pause();
      else speechSynthesis.cancel();
      this.updateStatusState({ isPaused: true, isSpeaking: false });
      return;
    }
    return this.speak(text);
  }

  private speak(text: string) {
    return new Promise<void>((resolve, reject) => {
      if (!('speechSynthesis' in window)) return;

      const cleanText = text.replaceAll('_', '');

      speechSynthesis.cancel();

      this.state.currentText = cleanText;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.utterance = utterance;

      utterance.lang = 'en-US';
      utterance.rate = this.state.rate;
      utterance.pitch = 1;
      utterance.volume = this.state.volume ?? this.statusInitialState.volume;

      const voice = this.getEnglishVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => {
        this.updateStatusState({ isPaused: false, isSpeaking: true, currentText: this.state.currentText });
      };

      utterance.onend = () => {
        this.resetSpeechState();
        resolve();
      };

      utterance.onerror = (err) => {
        this.updateStatusState({ isPaused: true, isSpeaking: false });
        
        if (err.error === "interrupted") {
          resolve();
          return;
        }

        reject(err);
      };

      this.attachEvents(utterance);
    });
  }

  private attachEvents(utterance: SpeechSynthesisUtterance) {
    utterance.onboundary = (event) => {
      this.state.worksInThisBrowser = true;
      if (event.name === 'word') {
        const words = this.state.currentText?.split(' ');
        let indexToHighlight = this.state.currentSpokenWordIndex;
        if (words && indexToHighlight < words.length) {
          if (indexToHighlight > 0) {
            this.removeHighlightSubject.next(indexToHighlight - 1);
          }
          this.addHighlightSubject.next(indexToHighlight);
          this.updateStatusState({ currentSpokenWordIndex: ++indexToHighlight });
        }
      }
    };

    requestAnimationFrame(() => {
      speechSynthesis.speak(utterance);
    });
  }

  private resetSpeechState(): void {
    this.updateStatusState({ isPaused: true, isSpeaking: false, currentSpokenWordIndex: 0 });
  }
}
