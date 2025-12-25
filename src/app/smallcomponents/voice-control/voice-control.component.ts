import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VoiceControlPort } from '../../ports/voice-control.port';
import { VOICE_CONTROL_TOKEN } from '../../ports/voice-control.token';

@Component({
  selector: 'app-voice-control',
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './voice-control.component.html',
  styleUrl: './voice-control.component.scss',
})
export class VoiceControlComponent {
  isSpeaking: boolean = false;
  isPaused: boolean = false;
  currentText = "";
  rate!: number;

  constructor(@Inject(VOICE_CONTROL_TOKEN) readonly voiceControlService: VoiceControlPort) {}

  ngOnInit(): void {
    this.voiceControlService.status$.subscribe(({ isSpeaking, isPaused, currentText, rate }) => {
      this.isSpeaking = isSpeaking;
      this.isPaused = isPaused;
      this.currentText = currentText || "";
      this.rate = rate;
      console.log(currentText)
    })
  }

  playPausePressed() {
    this.voiceControlService.toggleSpeech(this.currentText);
  }
}
