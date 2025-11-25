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

  // New: user-defined vocabulary of interest
  userVocabulary: string = '';
  indexVocabulary: number = 0;

  // Deepseek State
  isGeminiLoading = signal(false);
  geminiResponse = signal<string | null>(null);

  // Statistics
  ehGrupoControle!: boolean;

  quizJaFeito: boolean = false;

  instrucaoIA = 'Tire suas dúvidas com tutor IA';

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
      this.sharedUi.hideArrowBackToolbar(false);
      this.idCurso = idCurso || '';

      this.temasService.getAtividade(idCurso + '', 'Quizz').subscribe((atvd) => {
        const hostname = window.location.hostname;
        let perguntas;
        if (hostname === 'localhost')
          perguntas = (atvd?.perguntas.slice(0, 3) as Question[]) ?? [];
        else 
          perguntas = (atvd?.perguntas /*.slice(0, 3)*/ as Question[]) ?? [];
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

          if (perguntas.length > 0 && this.userVocabulary.length) this.adaptQuestionToVocabulary(0);
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

  obterContextoPalavra(word: string, frase: string) {
    this.speak(word);
    this.isLoadingUserQuestion = true;

    if (this.isGeminiLoading()) return;

    this.isGeminiLoading.set(true);
    this.geminiResponse.set(null);

    const questionContext = `Você é um professor de inglês. Dê o significado (com limite estrito de 50 palavras) da palavra '${word}' na frase a seguir: '${frase}' | Responda em português do Brasil`;

    this.askDeepSeek(questionContext);
    this.isGeminiLoading.set(false);
    this.updateQtdQuestionsMade();
    this.updateUserDoubts('');
  }

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
        sentence: question.sentence,
      };
      return progress.map((p, i) => (i === index ? updatedItem : p));
    });

    if (isAnswerCorrect) this.speak(question.sentence.replaceAll('___', question.correctAnswer));

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
  }

  nextQuestion(): void {
    this.stopSpeaking();
    this.currentQuestionIndex.update((i) => i + 1);
    if (this.currentQuestionIndex() < this.quizData().length) {
      if (this.userVocabulary.length) this.adaptQuestionToVocabulary(this.currentQuestionIndex()).then(() => this.guardarRespostas());
    } else {
      this.guardarRespostas(true, this.currentQuestionIndex() - 1); 
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

      this.temasService.responderQuizz(respostas, this.idCurso, { ehConcluida, nomeAtividade: "Quizz" }).subscribe({
        next: (res: any) => {
          console.log('Quizz respondido:', res);
          this.showMessage('Resultado salvo com sucesso!');
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

  askDeepSeekUserQuestion() {
    this.isLoadingUserQuestion = true;
    const doubt = this.currentProgress().userDoubts;
    this.instrucaoIA = doubt;

    if (!doubt || this.isGeminiLoading()) return;

    this.isGeminiLoading.set(true);
    this.geminiResponse.set(null);

    const questionContext = `A questão é: "${this.currentQuestion().sentence.replace('___', this.currentQuestion().correctAnswer)}".`;
    const systemPrompt = `Você é um tutor de IA especializado em **Gramática Inglesa** e **ensino de inglês como segunda língua**. Sua missão é fornecer uma explicação extremamente clara, concisa e motivadora (limite estrito de 50 palavras) sobre a dúvida ${doubt} **ignorando e descartando** quaisquer referências ao conteúdo temático (ex: história, química, biologia) da frase.`;

    const totalPrompt = `Responda em portugues do brasil | ${systemPrompt} | ${questionContext} `;
    this.askDeepSeek(totalPrompt);
    this.isGeminiLoading.set(false);
    this.updateQtdQuestionsMade();
    this.updateUserDoubts('');
  }

  async adaptQuestionToVocabulary(index: number) {
    if (this.ehGrupoControle) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    const question = this.quizData()[index];
    if (!question || !this.userVocabulary.length || question.ehFeitaPorIA) {
      this.isLoading.set(false);
      return;
    }
    const apiUrl = `https://api.deepseek.com/v1/chat/completions`;
    const deepseekAPIKey = 'sk-2a4144829a9946fc9d01b0e8be0bf98d';

    let vocabularies = this.userVocabulary.split(',');
    let vocabularyTurn = '';
    if (this.indexVocabulary < vocabularies.length) vocabularyTurn = vocabularies[this.indexVocabulary++];
    else {
      vocabularyTurn = vocabularies[0];
      this.indexVocabulary = 0;
    }

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
          questions.map((q, i) =>
            i === index ? { ...q, options: adapted.options, sentence: adapted.sentence, correctAnswer: adapted.correctAnswer, tutoringText: adapted.tutoringText } : q
          )
        );

        this.speak(adapted.sentence);

        this.isLoading.set(false);
      }
    } catch (err) {
      console.log('DeepSeek adaptation failed', err);
    } finally {
        this.isLoading.set(false);
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
    this.isLoadingUserQuestion = false;
  }

  speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text.replaceAll('_', ''));
    utterance.lang = 'en-US'; // or 'pt-BR' for Portuguese
    utterance.rate = 0.5; // speed (0.1–10)
    utterance.pitch = 1; // tone (0–2)
    utterance.volume = 1; // 0–1

    speechSynthesis.cancel(); // stop any current speech
    speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    speechSynthesis.cancel();
  }
}
