import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Opcao } from '../../model/atividade.model';
import { TextoActivity } from '../../model/texto-activity.model';
import { Usuario } from '../../model/user.model';
import { VoiceControlStatus } from '../../model/voice-control-status.model';
import { AITutorPort } from '../../ports/AITutor.port';
import { AI_TUTOR_TOKEN } from '../../ports/AITutor.token';
import { SharedUiService } from '../../services/shared-ui.service';
import { TemasService } from '../../services/temas.service';
import { UiUtilsService } from '../../services/ui.utils.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';
import { VoiceControlService } from '../../services/voice-control.service';

/**
 * * TODOS: 
  1. Gerar plano de estudos e alimentar template do curso.
  2. Criar tela de cadastro de professor
 */
interface PerguntaComOpcoes {
  pergunta: string;
  opcoes: Opcao[];
}

interface SmartTextResponse {
  texto: string;
  perguntas: PerguntaComOpcoes[];
}

@Component({
  selector: 'app-texto',
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
  templateUrl: './texto.component.html',
  styleUrl: './texto.component.scss',
})
export class TextoComponent {
  atividade!: TextoActivity;
  respostaSelecionada?: Opcao;
  respondeu = false;
  isLoadingUserQuestion = false;
  isGeminiLoading = false;
  geminiResponse = '';
  selectedWordIndexes: Set<number> = new Set<number>();
  currentWordRequestId = 0;
  longPressTimeoutId?: number;
  longPressTriggered = false;
  selection$ = new Subject<void>();
  isMultiSelectMode = false;
  translationResponse = '';
  isTranslating = false;
  isLoadingAtividade = true;
  currentQuestionIndex = 0;
  isTransitioning = false;
  
  idCurso = "";
  user!: Usuario;
  private isDragging = false;  
  private startX = 0;
  private startY = 0;
  private readonly DRAG_THRESHOLD = 10;

  voiceControlState!: VoiceControlStatus;

  constructor(
    @Inject(AI_TUTOR_TOKEN) readonly tutor: AITutorPort,
    private readonly uiUtils: UiUtilsService,
    private readonly route: ActivatedRoute,
    private readonly usuarioRepositoryService: UsuarioRepositoryService,
    private readonly temasService: TemasService,
    private readonly sharedUi: SharedUiService,
    readonly speakService: VoiceControlService
  ) { }

  ngOnInit(): void {
    this.speakService.status$.subscribe((status) => {
      this.voiceControlState = status;
    })

    this.selection$.pipe(
      debounceTime(1000),
      switchMap(() => {
        window.scrollTo(0,0)
        const selectedWords = this.getSelectedWords();
        this.isLoadingUserQuestion = true;
        return this.obterContextoPalavras(selectedWords, this.atividade?.texto ?? '');
      })
    ).subscribe({
      next: () => {
        this.isLoadingUserQuestion = false;
      },
      error: () => {
        this.geminiResponse = '';
        this.isLoadingUserQuestion = false;
        this.uiUtils.showMessage('Erro ao buscar contexto da palavra.', true);
      }
    });

    this.route.paramMap.subscribe((params) => {
      this.idCurso = params.get('id') || "";
      this.sharedUi.goBackTo('tema/' + this.idCurso);

      this.usuarioRepositoryService.getUserState().subscribe(async (user) => {
        this.user = user;
        const currentCourse = user.setCurrentCourse(this.idCurso);
        if (!currentCourse) return;

        const uniqueWords = user.processSentences();
        const atvd = user.getAtividade("Texto") as unknown as TextoActivity;

        if (atvd && atvd.texto.length > 0) {
          this.atividade = atvd;
          this.isLoadingAtividade = false;
        } else
          this.getSmartText(uniqueWords).then((atividade) => {
            this.atividade = atividade;
            this.currentQuestionIndex = 0;
            this.isLoadingAtividade = false;
            this.temasService.responderQuizz(this.atividade.perguntas, this.idCurso, { texto: this.atividade.texto, nomeAtividade: "Texto" }).subscribe(
              {
                next: () => {
                  this.isLoadingUserQuestion = false;
                },
                error: () => {
                  this.geminiResponse = '';
                  this.isLoadingUserQuestion = false;
                  this.uiUtils.showMessage('Erro ao guardar resultado do quizz.', true);
                }
              }
            );
          });
      });
    });
  }

  async getSmartText(uniqueWords: string[]) {
    if (!uniqueWords.length) {
      return Promise.reject(new Error('Vocabulary field is required'));
    }

    const prompt = `Create a 200-word English text using: ${uniqueWords.join(', ')} Incorporate ${this.user.getPreviousTemas().map(prevCourse => `**${prevCourse}** `)} frequently. Output only the text.`;

    const tutorAnswer = await this.tutor.ask(prompt);

    const secondPromt = `Crie 3 perguntas MCQ em português sobre o texto.

FORMATO JSON:
[
  {
    "pergunta": "texto",
    "opcoes": [
      {"descricao": "opção", "correta": false/true}
    ]
  }
]

REGRAS:
- 4 opções por pergunta (1 correta)
- Distratores plausíveis

TEXTO:
[o texto completo aqui]
${tutorAnswer}
    `

    const tutorAnswer2 = await this.tutor.ask(secondPromt);

    return {
      nome: 'Texto' as const,
      concluida: false,
      videos: [],
      texto: tutorAnswer || '',
      perguntas: tutorAnswer2
    } as any;
  }

  getCurrentQuestion(): PerguntaComOpcoes | null {
    const perguntas = (this.atividade?.perguntas as PerguntaComOpcoes[]) || [];
    if (perguntas.length === 0 || this.currentQuestionIndex >= perguntas.length) {
      return null;
    }
    return perguntas[this.currentQuestionIndex];
  }

  getTotalQuestions(): number {
    const perguntas = (this.atividade?.perguntas as PerguntaComOpcoes[]) || [];
    return perguntas.length;
  }

  async selecionar(opcao: Opcao) {
    if (this.respondeu || this.isTransitioning) return; // impede mudança após resposta ou durante transição

    this.respostaSelecionada = opcao;
    this.respondeu = true;

    await new Promise(resolve => {
      this.atividade.perguntas[this.currentQuestionIndex].ehAcerto = opcao.correta;
      this.temasService.responderQuizz(this.atividade.perguntas, this.idCurso, { texto: this.atividade.texto, nomeAtividade: 'Texto' }).subscribe({
        next: (res: any) => {
          console.log('Quizz respondido:', res);
          this.uiUtils.showMessage('Resultado salvo com sucesso!');
          resolve("");
        },
        error: (err: any) => {
          console.error(err);
          this.uiUtils.showMessage('Erro ao guardar resultado.', true);
          resolve("");
        },
      });
    });

    this.isTransitioning = true;
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.currentQuestionIndex++;
    this.respondeu = false;
    this.respostaSelecionada = undefined;

    await new Promise(resolve => setTimeout(resolve, 100));
    this.isTransitioning = false;
  }

  obterClasse(opcao: Opcao): string {
    if (!this.respondeu) return '';
    if (opcao.correta) return 'quiz-option--correct';
    if (this.respostaSelecionada === opcao && !opcao.correta) return 'quiz-option--wrong';
    return '';
  }

  handleWordPointerDown(event: TouchEvent | MouseEvent, _word: string, index: number) {
    this.isDragging = false;
    this.longPressTriggered = false;

    const clientX = (event instanceof TouchEvent) ? event.touches[0].clientX : event.clientX;
    const clientY = (event instanceof TouchEvent) ? event.touches[0].clientY : event.clientY;
    this.startX = clientX;
    this.startY = clientY;

    this.longPressTimeoutId = window.setTimeout(() => {
      if (this.isDragging) return;

      this.vibrate(100);

      this.selectedWordIndexes.clear();
      this.longPressTriggered = true;
      this.isMultiSelectMode = true;
      this.toggleWordSelection(index);
      this.selection$.next();
    }, 450);
  }

  handleWordPointerMove(event: TouchEvent | MouseEvent) {
    if (this.longPressTimeoutId && !this.isDragging) {
      const clientX = (event instanceof TouchEvent) ? event.touches[0].clientX : event.clientX;
      const clientY = (event instanceof TouchEvent) ? event.touches[0].clientY : event.clientY;

      const distanceX = Math.abs(clientX - this.startX);
      const distanceY = Math.abs(clientY - this.startY);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance > this.DRAG_THRESHOLD) {
        this.isDragging = true;
      }
    }
  }

  handleWordPointerUp(event: TouchEvent | MouseEvent, _word: string, index: number) {
    event.preventDefault();

    if (this.longPressTimeoutId) {
      clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = undefined;
    }

    if (this.isDragging) {
      this.isDragging = false;
      if (this.longPressTriggered) {
        this.longPressTriggered = false;
      }
      return;
    }

    if (this.longPressTriggered) {
      this.longPressTriggered = false;
      return;
    }

    if (this.isMultiSelectMode) {
      this.toggleWordSelection(index);
    } else {
      this.selectedWordIndexes.clear();
      this.selectedWordIndexes.add(index);
    }

    this.selection$.next();
  }

  handleWordPointerLeave() {
    if (this.longPressTimeoutId) {
      clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = undefined;
    }
    this.isDragging = false;
    this.longPressTriggered = false;
  }

  vibrate(duration: number | number[]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }

  isWordSelected(index: number): boolean {
    return this.selectedWordIndexes.has(index); 
  }

  private toggleWordSelection(index: number) {
    if (this.selectedWordIndexes.has(index)) {
      this.selectedWordIndexes.delete(index);
      if (this.selectedWordIndexes.size === 0) {
        this.isMultiSelectMode = false;
        this.geminiResponse = '';
      }
    } else {
      this.selectedWordIndexes.add(index);
    }
  }

  private getSelectedWords(): string[] {
    if (!this.atividade?.texto)
      return [];

    const words = this.atividade.texto.split(' ');
    return Array.from(this.selectedWordIndexes)
      .sort((a, b) => a - b)
      .map((index) => words[index])
      .filter((word) => !!word);
  }

  async obterContextoPalavras(words: string[], frase: string) {
    const requestId = ++this.currentWordRequestId;
    this.isLoadingUserQuestion = true;
    this.isGeminiLoading = true;
    this.geminiResponse = '';

    const palavras = words.join(' ');
    const questionContext = `Você é um professor de inglês. Dê o significado (com limite estrito de 70 palavras) da seleção '${palavras}' considerando o texto completo a seguir: '${frase}'. Responda em português do Brasil e seja objetivo.`;

    try {
      const response = await this.tutor.ask(questionContext);
      if (this.currentWordRequestId === requestId)
        this.geminiResponse = response as string;
    } catch (error) {
      this.uiUtils.showMessage('Erro ao buscar contexto da palavra.', true);
      console.error('[TextoComponent] Erro ao buscar contexto da palavra', error);

      if (this.currentWordRequestId === requestId)
        this.geminiResponse = 'Não foi possível carregar o significado agora. Tente novamente.';

    } finally {
      if (this.currentWordRequestId === requestId) {
        this.isGeminiLoading = false;
        this.isLoadingUserQuestion = false;
      }
    }
  }

  async traduzirTexto() {
    if (!this.atividade?.texto || this.isTranslating) return;

    this.translationResponse = '';
    this.isTranslating = true;

    const prompt = `Traduza para o português do Brasil o texto a seguir, mantendo significado e fluidez natural: '${this.atividade.texto}'`;

    try {
      this.translationResponse = await this.tutor.ask(prompt);
    } catch (error) {
      console.error('[TextoComponent] Erro ao traduzir texto', error);
      this.translationResponse = 'Não foi possível traduzir o texto agora. Tente novamente.';
    } finally {
      this.isTranslating = false;
    }
  }  
}