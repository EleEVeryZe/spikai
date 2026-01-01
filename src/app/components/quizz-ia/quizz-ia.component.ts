import { CommonModule } from '@angular/common';
import { Component, computed, Inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute, Router } from '@angular/router';
import { AITutorPort } from '../../ports/AITutor.port';
import { AI_TUTOR_TOKEN } from '../../ports/AITutor.token';
import { SharedUiService } from '../../services/shared-ui.service';
import { TemasService } from '../../services/temas.service';
import { UiUtilsService } from '../../services/ui.utils.service';

interface Question {
  id: number;
  sentence: string;
  options: string[];
  correctAnswer: string;
  tutoringText: string;
  selectedAnswer: string;
  userDoubts: string;
  ehFeitaPorIA?: boolean;
}

interface QuestionProgress {
  sentence?: string | null;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  userDoubts: string;
  qtdQuestionMade?: number;
}

@Component({
  selector: 'app-quizz-ia',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './quizz-ia.component.html',
  styleUrl: './quizz-ia.component.scss',
})
export class QuizzIaComponent {
  idCurso: string = '';
  quizData = signal<Question[]>([]);
  currentQuestionIndex = signal(0);

  isLoading = signal(true);

  isLoadingUserQuestion = false;

  quizProgress: WritableSignal<QuestionProgress[]> = signal([]);

  userVocabulary: string = '';
  indexVocabulary: number = 0;

  isGeminiLoading = signal(false);
  geminiResponse = signal<string | null>(null);

  ehGrupoControle!: boolean;

  quizJaFeito: boolean = false;

  questionsLeft = computed(() => this.quizData().length - this.currentQuestionIndex());
  isLastQuestion = computed(() => this.currentQuestionIndex() === this.quizData().length - 1);
  progressPercent = computed(() => Math.min(100, ((this.currentQuestionIndex() + 1) / this.quizData().length) * 100));

  currentQuestion = computed(() => this.quizData()[this.currentQuestionIndex()] ?? null);
  currentProgress = computed(() => this.quizProgress()[this.currentQuestionIndex()] ?? null);

  userSelection = computed(() => this.currentProgress()?.selectedAnswer ?? null);
  isCorrect = computed(() => this.currentProgress()?.isCorrect ?? null);

  feedbackText = computed(() => {
    const progress = this.currentProgress();
    if (progress?.isCorrect === false) {
      return this.currentQuestion()?.tutoringText || 'No tutoring provided.';
    }
    return null;
  });

  constructor(
    private router: Router,
    private readonly uiUtils: UiUtilsService,
    private readonly sharedUi: SharedUiService,
    private readonly route: ActivatedRoute,
    private readonly temasService: TemasService,
    @Inject(AI_TUTOR_TOKEN) readonly tutor: AITutorPort,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idCurso = params.get('id');
      this.sharedUi.goBackTo('tema/' + idCurso);
      this.sharedUi.hideArrowBackToolbar(false);
      this.idCurso = idCurso || '';

      this.temasService.getAtividade(idCurso + '', 'Quizz').subscribe((atvd) => {
        const hostname = window.location.hostname;
        let perguntas;
        if (hostname === 'localhost') perguntas = (atvd?.perguntas.slice(0, 3) as Question[]) ?? [];
        else perguntas = (atvd?.perguntas /*.slice(0, 3)*/ as Question[]) ?? [];
        this.quizData.set(perguntas);
        this.quizJaFeito = atvd?.concluida || false;

        this.temasService.getUserProperties().subscribe(({ vocabulary, ehGrupoControle }) => {
          this.userVocabulary = vocabulary;
          this.ehGrupoControle = ehGrupoControle;

          this.quizProgress.set(
            perguntas.map(({ selectedAnswer, userDoubts }) => ({
              selectedAnswer,
              isCorrect: null,
              userDoubts,
            }))
          );

          if (perguntas.length > 0 && this.userVocabulary.length) this.adaptQuestionToVocabulary(0).then(() => {
            this.isLoading.set(false);
            this.guardarRespostas()
          });
        });
      });
    });
  }

  async obterContextoPalavra(word: string, frase: string) {
    this.speak(word);
    this.isLoadingUserQuestion = true;

    if (this.isGeminiLoading()) return;

    this.isGeminiLoading.set(true);
    this.geminiResponse.set(null);

    const questionContext = `Você é um professor de inglês. Dê o significado (com limite estrito de 50 palavras) da palavra '${word}' na frase a seguir: '${frase}' | Responda em português do Brasil`;

    const AiAnswer = await this.tutor.ask(questionContext);
    this.geminiResponse.set(AiAnswer);
    this.isGeminiLoading.set(false);
    this.isLoadingUserQuestion = false;
    this.updateQtdQuestionsMade();
    this.updateUserDoubts('');
  }

  selectOption(event: MatRadioChange): void {
    const selectedAnswer = event.value;
    const question = this.currentQuestion();
    if (!question) return;

    const isAnswerCorrect = selectedAnswer === question.correctAnswer;
    this.quizProgress.update((progress) => {
      const updatedItem: QuestionProgress = {
        ...progress[this.currentQuestionIndex()],
        selectedAnswer,
        isCorrect: isAnswerCorrect,
        sentence: question.sentence,
      };
      return progress.map((p, i) => (i === this.currentQuestionIndex() ? updatedItem : p));
    });

    if (isAnswerCorrect) this.speak(question.sentence.replaceAll('___', question.correctAnswer));
  }

  updateQtdQuestionsMade(): void {
    const index = this.currentQuestionIndex();
    this.quizProgress.update((progress) => {
      const updatedItem: QuestionProgress = {
        ...progress[index],
        qtdQuestionMade: progress[index]?.qtdQuestionMade ? progress[index]?.qtdQuestionMade + 1 : 1,
      };
      return progress.map((p, i) => (i === index ? updatedItem : p));
    });
    
  }

  updateUserDoubts(text: string): void {
    const index = this.currentQuestionIndex();
    this.quizProgress.update((progress) => {
      const updatedItem: QuestionProgress = {
        ...progress[index],
        userDoubts: text,
      };
      return progress.map((p, i) => (i === index ? updatedItem : p));
    });
  }

  nextQuestion(): void {
    this.stopSpeaking();
    this.guardarRespostas(false, this.currentQuestionIndex());
    this.currentQuestionIndex.update((i) => i + 1);
    if (this.currentQuestionIndex() < this.quizData().length) {
      if (this.userVocabulary.length) this.adaptQuestionToVocabulary(this.currentQuestionIndex());
    }
    this.geminiResponse.set(null);
  }

  fecharQuizz(): void {
    this.router.navigate(['/tema/' + this.idCurso]);
  }

  guardarRespostas(ehConcluida = false, idxQuestion = this.currentQuestionIndex()): void {
    const perguntas = this.quizData();
    if (perguntas) {
      if (this.quizData()[idxQuestion].ehFeitaPorIA) return;

      this.quizData()[idxQuestion].ehFeitaPorIA = true;
      let currentIndex = 0;
      const respostas = perguntas.map((pergunta: any) => {
        return {
          ...pergunta,
          ...this.quizProgress()[currentIndex++],
        };
      });

      this.temasService.responderQuizz(respostas, this.idCurso, { ehConcluida, nomeAtividade: 'Quizz' }).subscribe({
        next: (res: any) => {
          console.log('Quizz respondido:', res);
          this.uiUtils.showMessage('Resultado salvo com sucesso!');
        },
        error: (err: any) => {
          console.error(err);
          this.uiUtils.showMessage('Erro ao guardar resultado.', true);
        },
      });
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
      if (this.userVocabulary.length) this.adaptQuestionToVocabulary(this.currentQuestionIndex());
    }
    this.geminiResponse.set(null);
  }

  async askDeepSeekUserQuestion() {
    this.isLoadingUserQuestion = true;
    const doubt = this.currentProgress().userDoubts;

    if (!doubt || this.isGeminiLoading()) return;

    this.isGeminiLoading.set(true);
    this.geminiResponse.set(null);

    const questionContext = `A questão é: "${this.currentQuestion().sentence.replace('___', this.currentQuestion().correctAnswer)}".`;
    const systemPrompt = `Você é um tutor de IA especializado em **Gramática Inglesa** e **ensino de inglês como segunda língua**. Sua missão é fornecer uma explicação extremamente clara, concisa e motivadora (limite estrito de 50 palavras) sobre a dúvida ${doubt} **ignorando e descartando** quaisquer referências ao conteúdo temático (ex: história, química, biologia) da frase.`;

    const totalPrompt = `Responda em portugues do brasil | ${systemPrompt} | ${questionContext} `;

    const AIDoubtSolverAnswer = await this.tutor.ask(totalPrompt);
    this.geminiResponse.set(AIDoubtSolverAnswer);

    this.isGeminiLoading.set(false);
    this.isLoadingUserQuestion = false;
    this.updateQtdQuestionsMade();
    this.updateUserDoubts('');
  }

  getCurrentVocabulary() {
    let vocabularies = this.userVocabulary.split(',');
    if (this.indexVocabulary < vocabularies.length) return vocabularies[this.indexVocabulary++];
    else {
      this.indexVocabulary = 0;
      return vocabularies[0];
    }
  }

  async adaptQuestionToVocabulary(index: number) {
    const question = this.quizData()[index];
    if (this.ehGrupoControle || !question || !this.userVocabulary.length || question.ehFeitaPorIA) return;

    this.isLoading.set(true);

    let vocabularyTurn = this.getCurrentVocabulary();

    const prompt = `
    You are an English tutor that personalizes quiz questions.

Your task:
1. Rewrite ONLY the 'sentence' field of the given JSON, adapting it to use vocabulary related to **${vocabularyTurn}**.  
2. DO NOT translate, paraphrase, or change the grammar structure unnecessarily — only replace or adapt words to fit the given topic.
3. Write 'tutoringText' in **Brazilian Portuguese**, but keep 'sentence' **entirely in English**.
4. Return the result strictly as valid JSON with these exact three properties:  
   'sentence', 'correctAnswer', 'tutoringText'.  
5. Do not include explanations, comments, or any text outside the JSON.
6. Add 3 wrong options and the correct one

Input:
{
  "sentence": "${question.sentence}",
  "correctAnswer": "${question.correctAnswer}",
  "tutoringText": "${question.tutoringText}"
}

Output (JSON only):
{
  "sentence": "...",
  "correctAnswer": "...",
  "tutoringText": "...",
  "options": ["op1"...]
}

`;

    const adapted = await this.tutor.ask(prompt);
    if (adapted) {
      this.quizData.update((questions) =>
        questions.map((q, i) =>
          i === index
            ? {
                ...q,
                options: adapted.options,
                sentence: adapted.sentence,
                correctAnswer: adapted.correctAnswer,
                tutoringText: adapted.tutoringText,
              }
            : q
        )
      );
      this.speak(adapted.sentence);
    }
    this.isLoading.set(false);
  }

  speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replaceAll('_', ''));
    utterance.lang = 'en-US'; //'pt-BR'
    utterance.rate = 0.5; // speed (0.1–10)
    utterance.pitch = 1; // tone (0–2)
    utterance.volume = 1; // 0–1

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    speechSynthesis.cancel();
  }
}
