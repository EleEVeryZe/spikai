import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { Usuario } from '../../model/user.model';
import { AITutorPort } from '../../ports/AITutor.port';
import { AI_TUTOR_TOKEN } from '../../ports/AITutor.token';
import { VoiceControlPort } from '../../ports/voice-control.port';
import { VOICE_CONTROL_TOKEN } from '../../ports/voice-control.token';
import { TimelyShowService } from '../../services/timelyshow.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';
import { PreviousNextBtnComponent } from '../../smallcomponents/previous-next-btn/previous-next-btn.component';
import { VoiceControlComponent } from '../../smallcomponents/voice-control/voice-control.component';
import { RandomlyShowService } from '../../services/randomlyshow.service';

interface LetterLesson {
  letter: string;
  example: string;
  translation: string;
  pronunciation: string;
  isSpeaking?: boolean;
}

@Component({
  selector: 'app-alphabet-tutor',
  imports: [CommonModule, VoiceControlComponent, PreviousNextBtnComponent, MatButtonModule, MatIconModule],
  templateUrl: './alphabet-tutor.component.html',
  styleUrl: './alphabet-tutor.component.scss',
})
export class AlphabetTutorComponent implements OnDestroy {
  exercise: any;
  private readonly subs = new Subscription();
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  pronunciation = [
    'Êi',
    'Bí',
    'Sí',
    'Dí',
    'Í',
    'Éf',
    'Djí',
    'Êitch',
    'Ái',
    'Djêi',
    'Quêi',
    'Éll (língua no céu da boca)',
    'Ém (fecha os lábios no final)',
    'Én (língua no céu da boca)',
    'Ôu',
    'Pí',
    'Quiú',
    "Ár (o 'r' do interior, como em 'porta')",
    'Éss',
    'Tí',
    'Iú',
    'Ví',
    'Dâ-bol-iú',
    'Éks',
    'Uái (como em Minas Gerais)',
    'Zí',
  ];

  showPronunciation = localStorage.getItem('showPronunciation') === 'true';
  letters: LetterLesson[] = [];

  disablePrevious = true;
  disableNext = false;

  lessonFinished = false;

  total = 0;

  current = 0;

  constructor(
    @Inject(AI_TUTOR_TOKEN) readonly tutor: AITutorPort,
    @Inject(VOICE_CONTROL_TOKEN) readonly voiceControlService: VoiceControlPort,
    private readonly randomlyShowService: RandomlyShowService,
    private readonly user: UsuarioRepositoryService,
    readonly timelyShowService: TimelyShowService
  ) {}

  ngOnInit(): void {
    this.subs.add(this.user.getUserState().subscribe(this.loadLetters.bind(this)));

    this.subs.add(
      this.voiceControlService.onBtnPressed$.subscribe((name) => {
        switch (name) {
          case 'pause':
            this.timelyShowService.pause();
            break;
          case 'play':
            this.timelyShowService.start();
            break;
        }
      })
    );
  }

  startApp() {
    this.timelyShowService.start();
  }

  private async loadLetters({ vocabulary }: Partial<Usuario>) {
    const lessons = await this.tutor
      .ask(`With the english alphabet ${this.alphabet} give me an exemple **in english** for each letter. Exemple, [A, 'Apple', B, 'Banana']. Try to use words related to this vocabulary interest: ${vocabulary}; 
      return with JSON with this format
      {
        letter,
        example,
        translation
      };
      `);

    lessons.forEach((letter: any, idx: number) => {
      letter.pronunciation = this.pronunciation[idx];
    });

    this.letters = lessons;

    this.timelyShowService.setAllLessons(lessons);
    this.timelyShowService.setHandler((lesson: any): Promise<void> => {
      if (!this.timelyShowService.getState().isPaused)
        setTimeout(() => {
          document.getElementById('bottom-anchor')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

      return this.voiceControlService.toggleSpeech(`${lesson.letter}(...) ${lesson.example}`);
    });

    this.randomlyShowService.setAllLessons(lessons);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  togglePronunciation() {
    this.showPronunciation = !this.showPronunciation;
    localStorage.setItem('showPronunciation', this.showPronunciation.toString());
  }

  recordPronunciation() {
    alert('Recording feature can be implemented with MediaRecorder API.');
  }

  async next(option: number) {
    switch (option) {
      case 0:
        this.timelyShowService.restart(0);
      break;
      case 1:
        this.exercise = null;
        this.timelyShowService.pause();
        this.timelyShowService.showAll();
      break;
      case 2:
        this.timelyShowService.stop();
        this.exercise = this.randomlyShowService.next();
        this.total = this.randomlyShowService.getSize();
        this.current = this.randomlyShowService.getCurrent();
        break;
    }
  }

  repeatLesson(idx: number) {
    if (this.timelyShowService.getState().isPaused) this.timelyShowService.execOnlyLesson(idx);
    else this.timelyShowService.restart(idx);
  }

  async speak(lesson: LetterLesson) {
    this.voiceControlService.toggleSpeech(`${lesson.letter}(...) ${lesson.example}`);
  }
}
