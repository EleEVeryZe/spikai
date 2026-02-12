import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { Subscription } from 'rxjs';
import { VoiceControlPort } from '../../ports/voice-control.port';
import { VOICE_CONTROL_TOKEN } from '../../ports/voice-control.token';

@Component({
  selector: 'app-voice-control',
  imports: [MatIconModule, CommonModule, MatSliderModule, MatDividerModule, MatCardModule],
  templateUrl: './voice-control.component.html',
  styleUrl: './voice-control.component.scss',
})
export class VoiceControlComponent implements OnDestroy, OnInit {
  private readonly subs = new Subscription();
  isSpeaking: boolean = false;
  isPaused: boolean = false;
  currentText = '';
  rate!: number;
  volume!: number;

  constructor(@Inject(VOICE_CONTROL_TOKEN) readonly voiceControlService: VoiceControlPort) {}

  ngOnInit(): void {
    this.subs.add(
    this.voiceControlService.status$.subscribe(({ isSpeaking, isPaused, currentText, rate, volume }) => {
      this.isSpeaking = isSpeaking;
      this.isPaused = isPaused;
      this.currentText = currentText || '';
      this.rate = rate;
      this.volume = volume ?? 0.5;
    }));
  }

  playPausePressed() {
    this.voiceControlService.onBtnPressed(this.isPaused ? 'play' : 'pause');
  }

  onVolumeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number.parseFloat(input.value);

    this.volume = value;

    this.voiceControlService.setVolume(this.volume);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  next() {

  }

  previous() {
    
  }
}
