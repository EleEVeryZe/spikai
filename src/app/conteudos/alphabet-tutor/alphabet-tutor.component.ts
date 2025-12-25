import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { VoiceControlPort } from '../../ports/voice-control.port';
import { VOICE_CONTROL_TOKEN } from '../../ports/voice-control.token';
import { AITutor } from '../../services/tutor.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';
import { VoiceControlComponent } from '../../smallcomponents/voice-control/voice-control.component';

interface LetterLesson {
  letter: string;
  example: string;
  translation: string;
  pronunciation: string;
}

@Component({
  selector: 'app-alphabet-tutor',
  imports: [
    CommonModule,
    VoiceControlComponent
  ],
  templateUrl: './alphabet-tutor.component.html',
  styleUrl: './alphabet-tutor.component.scss',
})
export class AlphabetTutorComponent {
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

  lessons: LetterLesson[] = [];
  loading = false;
  finished = false;
  showPronunciation = true;
  tutor = new AITutor();

  constructor(private user: UsuarioRepositoryService, @Inject(VOICE_CONTROL_TOKEN) readonly voiceControlService: VoiceControlPort) {}

  ngOnInit(): void {
    this.user.getUserState().subscribe((usr) => this.startLesson(usr.vocabulary));
  }

  async startLesson(userVocabularyOfInterest: string) {
    const letters = [{pronunciation: "lskd", letter: "A", example: "Apple", translation: "Maça"}] /* await this.tutor
      .askDeepSeek(`With the english alphabet ${this.alphabet} give me an exemple **in english** for each letter. Exemple, [A, 'Apple', B, 'Banana']. Try to use words related to this vocabulary interest: ${userVocabularyOfInterest}; 
      return with JSON with this format
      {
        letter,
        example,
        translation
      };
      `);*/

    for (let idx = 0; idx < letters.length; idx++) {
      const lesson: LetterLesson = letters[idx];
      this.lessons.push({ ...lesson, pronunciation: this.pronunciation[idx] });
      await this.voiceControlService.toggleSpeech(`${lesson.letter}. ${lesson.example}`)
      await new Promise(res => setTimeout(res, 500));
    }

    this.finished = true
  }

  async speakLetter(lesson: LetterLesson) {
      await this.voiceControlService.toggleSpeech(`${lesson.letter}. ${lesson.example}`)
  }

  togglePronunciation() {
    this.showPronunciation = !this.showPronunciation;
  }

  recordPronunciation() {
    alert('Recording feature can be implemented with MediaRecorder API.');
  }
}
