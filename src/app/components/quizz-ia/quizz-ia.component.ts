import { CommonModule } from '@angular/common';
import { Component, computed, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedUiService } from '../../services/shared-ui.service';
import { TemasService } from '../../services/temas.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

interface Question {
  id: number;
  sentence: string;
  options: string[];
  correctAnswer: string;
  tutoringText: string;
  selectedAnswer: string;
  userDoubts: string;
}

interface QuestionProgress {
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

  quizProgress: WritableSignal<QuestionProgress[]> = signal([]);

  // New: user-defined vocabulary of interest
  userVocabulary: string = '';
  indexVocabulary: number = 0;

  // Gemini State
  isGeminiLoading = signal(false);
  geminiResponse = signal<string | null>(null);

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private readonly sharedUi: SharedUiService,
    private readonly route: ActivatedRoute,
    private readonly temasService: TemasService,
    private usuarioRepositoryService: UsuarioRepositoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idCurso = params.get('id');
      this.sharedUi.goBackTo('tema/' + idCurso);
      this.idCurso = idCurso || '';

      this.temasService.getAtividade(idCurso + '', 'Quizz').subscribe((atvd) => {
        const perguntas = (atvd?.perguntas.slice(0, 3) as Question[]) ?? [];
        this.quizData.set(perguntas);

        this.temasService.getUserVocabularyOfInterest().subscribe((vocabulary) => {
          this.userVocabulary = vocabulary;
          this.quizProgress.set(
            perguntas.map(({ selectedAnswer, userDoubts }) => ({
              selectedAnswer,
              isCorrect: null,
              userDoubts,
            }))
          );
          // As soon as we load, adapt the first question
          if (perguntas.length > 0 && this.userVocabulary.length) {
            this.adaptQuestionToVocabulary(0);
          }
        });
      });
    });
  }

  // Computed signals
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

  questionsLeft = computed(() => this.quizData().length - this.currentQuestionIndex());
  isLastQuestion = computed(() => this.currentQuestionIndex() === this.quizData().length - 1);
  progressPercent = computed(() => Math.min(100, ((this.currentQuestionIndex() + 1) / this.quizData().length) * 100));

  // Actions
  selectOption(event: MatRadioChange): void {
    const selectedAnswer = event.value;
    const question = this.currentQuestion();
    if (!question) return;

    const isAnswerCorrect = selectedAnswer === question.correctAnswer;
    const index = this.currentQuestionIndex();

    this.quizProgress.update((progress) => {
      const updatedItem: QuestionProgress = {
        ...progress[index],
        selectedAnswer,
        isCorrect: isAnswerCorrect,
      };
      return progress.map((p, i) => (i === index ? updatedItem : p));
    });

    this.geminiResponse.set(null);
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
    this.geminiResponse.set(null);
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
    this.geminiResponse.set(null);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex() < this.quizData().length - 1) {
      this.currentQuestionIndex.update((i) => i + 1);
      if (this.userVocabulary.length) this.adaptQuestionToVocabulary(this.currentQuestionIndex());
    } else {
      this.currentQuestionIndex.update((i) => i + 1);
      this.guardarRespostas();
    }
    this.geminiResponse.set(null);
  }

  guardarRespostas(): void {
    const perguntas = this.quizData();

    if (perguntas) {
      let currentIndex = 0;
      const respostas = perguntas.map((pergunta: any) => {
        return {
          ...pergunta,
          ...this.quizProgress()[currentIndex++],
        };
      });
      const userEmail = this.usuarioRepositoryService.getUserEmail();
      console.log('Atividade', respostas, userEmail, this.idCurso);
      this.temasService.responderQuizz(respostas, this.idCurso).subscribe({
        next: (res: any) => {
          console.log('Quizz respondido:', res);
          this.showMessage('Resultado salvo com sucesso!');
          
          setTimeout(() => {
            this.router.navigate(['/tema/' + this.idCurso]);
          }, 5000);
        },
        error: (err: any) => {
          console.error(err);
          this.showMessage('Erro ao guardar resultado.', true);
        },
      });
    }
  }

  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
    });
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update((i) => i - 1);
      if (this.userVocabulary.length) this.adaptQuestionToVocabulary(this.currentQuestionIndex());
    }
    this.geminiResponse.set(null);
  }

  async askDeepSeekUserQuestion() {
    const doubt = this.currentProgress().userDoubts;

    if (!doubt || this.isGeminiLoading()) return;

    this.isGeminiLoading.set(true);
    this.geminiResponse.set(null);

    const questionContext = `Pergunta atual: "${this.currentQuestion().sentence.replace('___', this.currentQuestion().correctAnswer)}".`;
    const userQuery = `Minha dúvida com relação a esse ponto específico da gramática inglesa é: "${doubt}"`;

    const systemPrompt =
      "Você é um tutor de IA especializado em **Gramática Inglesa** e, especificamente, no **Verbo 'TO BE'**. Sua missão é fornecer uma explicação extremamente clara, concisa e motivadora (limite estrito de 100 palavras) sobre **o ponto gramatical** que gerou a dúvida do usuário, **ignorando e descartando** quaisquer referências ao conteúdo temático (ex: história, química, biologia) da frase. **Foque unicamente na aplicação correta da gramática.**";

    const totalPrompt = `${systemPrompt} | ${questionContext} | ${userQuery}`;
    this.askDeepSeek(totalPrompt);
    this.isGeminiLoading.set(false);
    this.updateQtdQuestionsMade();
  }

  async adaptQuestionToVocabulary(index: number) {
    this.isLoading.set(true);
    const question = this.quizData()[index];
    if (!question || !this.userVocabulary.length) return;
    const apiUrl = `https://api.deepseek.com/v1/chat/completions`;
    const deepseekAPIKey = 'sk-2a4144829a9946fc9d01b0e8be0bf98d';

    let vocabularies = this.userVocabulary.split(',');
    let vocabularyTurn = '';
    if (this.indexVocabulary < vocabularies.length) vocabularyTurn = vocabularies[this.indexVocabulary++];
    else {
      vocabularyTurn = vocabularies[0];
      this.indexVocabulary = 0;
    }

    const prompt = `Rewrite the following quiz question so that the sentence and tutoring explanation
    Grammatical Immutability: The new sentence must preserve the grammatical structure of the original. Specifically, the subject of the new sentence must have the same grammatical number (singular/plural) and person (first, second, third) as the original. This ensures that the correctAnswer remains the only valid choice.
    use vocabulary about: ${vocabularyTurn}
    Keep the options and correctAnswer unchanged.
    
    Question:
    sentence: "${question.sentence}"
    correctAnswer: "${question.correctAnswer}"
    tutoringText: "${question.tutoringText}"

    Return JSON with properties: sentence, tutoringText.
`;

    const payload = {
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${deepseekAPIKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      
      const result = await response.json();
      console.log('Adaptation response:', result);
      const raw = result.choices?.[0]?.message?.content;
      
      if (raw) {
        const adapted = JSON.parse(raw.replaceAll('```', '').replaceAll('json', '')); // expect JSON response
        // update quizData immutably
        this.quizData.update((questions) =>
          questions.map((q, i) => (i === index ? { ...q, sentence: adapted.sentence, tutoringText: adapted.tutoringText } : q))
        );
        this.isLoading.set(false);
      }
    } catch (err) {
      console.error('DeepSeek adaptation failed', err);
    }
  }

  /**
   * Calls the Gemini API to clarify the user's doubt.
   */
  async askDeepSeek(totalPrompt: string): Promise<void> {
    const apiUrl = `https://api.deepseek.com/v1/chat/completions`;
    const deepseekAPIKey = 'sk-2a4144829a9946fc9d01b0e8be0bf98d';
    const payload = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: totalPrompt,
        },
      ],
      temperature: 0,
      max_tokens: 1000,
    };

    const maxRetries = 5;
    let delay = 1000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${deepseekAPIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          if (response.status === 429 && i < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
            continue;
          }
          throw new Error(`API call failed with status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Full API Response:', result);

        const text =
          result.choices?.[0]?.message?.content ||
          'Desculpe, o tutor IA não está disponível no momento. Por favor, confira a conexão de internet ou tente novamente.';

        console.log('Tokens used:', result.usage?.total_tokens);

        this.geminiResponse.set(text);
        break;
      } catch (error) {
        if (i === maxRetries - 1) {
          this.geminiResponse.set('Um erro critico ocorreu. Por favor, tente novamente.');
        }
      }
    }
    this.isGeminiLoading.set(false);
  }
}
