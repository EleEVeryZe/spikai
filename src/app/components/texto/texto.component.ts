import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Tutor } from '../../services/tutor.service';

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
import { Atividade, Opcao } from '../../model/atividade.model';
import { TemasService } from '../../services/temas.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

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
  inputSentences: string[] = [];
  uniqueWords: string[] = [];
  atividade!: Atividade;
  respostaSelecionada?: Opcao;
  respondeu = false;
  isLoadingUserQuestion = false;
  isGeminiLoading = false;
  geminiResponse = '';
  selectedWordIndexes: Set<number> = new Set<number>();
  private currentWordRequestId = 0;
  private longPressTimeoutId?: number;
  private longPressTriggered = false;
  isMultiSelectMode = false;
  translationResponse = '';
  isTranslating = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly usuarioRepositoryService: UsuarioRepositoryService,
    private readonly temasService: TemasService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idCurso = params.get('id');

      this.usuarioRepositoryService.getUserState().subscribe(async ({ cursos }) => {
        const quizz = cursos[0].atividades[2];
        this.inputSentences = quizz.perguntas.map(({ sentence }: any) => sentence);
        this.uniqueWords = this.processSentences();

        const atvd = cursos[0].atividades.find((atv) => atv.nome === 'Texto');
        if (atvd && atvd.texto.length > 0) {
          this.atividade = atvd;
        } else {
          this.atividade = await this.getSmartText(this.uniqueWords);
          this.temasService.responderQuizz(this.atividade.perguntas, idCurso, { texto: this.atividade.texto, nomeAtividade: "Texto" }).subscribe();
        }
      });
    });
  }

  async getSmartText(uniqueWords: string[]) {
    if (!uniqueWords.length) {
      return Promise.reject(new Error('Vocabulary field is required'));
    }

    const prompt = `Você é um tutor de inglês. Usando a lista de palavras abaixo, crie um texto em inglês de 200 palavras e 4 perguntas a respeito do texto. 3 perguntas deve estar incorretas e apenas 1 correta.
    
    Input: ${uniqueWords.join(', ')}
    
    Exemplo de Resposta:
    {
        texto: "Ana is a doctor at Rio Doce Hospital...",
        perguntas: [
          {
            descricao: "Ana é programadora de computador"
            correta: false
          }
        ]
    }
    `;

    const tutor = new Tutor();
    return JSON.parse(await tutor.askDeepSeek(prompt));
  }

  processSentences(): string[] {
    const allWords: string[] = [];
    const ignoredPatterns = ['___']; // Padrões a serem ignorados

    this.inputSentences.forEach((sentence) => {
      // Regex: Substitui todos os sinais de pontuação e os padrões ignorados por espaço,
      // depois divide a frase em palavras.
      const cleanedSentence = sentence.replace(/[.,!?:;"]/g, ' ').replace(new RegExp(ignoredPatterns.join('|'), 'g'), ' ');

      const words = cleanedSentence
        .split(/\s+/) // Divide por um ou mais espaços
        .filter((word) => word.length > 0) // Remove strings vazias
        .map((word) => word.toLowerCase()); // Converte para minúsculas

      allWords.push(...words);
    });

    // 3.2. Remover Duplicatas e Preencher FormArray
    return Array.from(new Set(allWords));
  }

  selecionar(opcao: Opcao) {
    if (this.respondeu) return; // impede mudança após resposta
    this.respostaSelecionada = opcao;
    this.respondeu = true;
  }

  obterClasse(opcao: Opcao): string {
    if (!this.respondeu) return '';
    if (opcao.correta) return 'quiz-option--correct';
    if (this.respostaSelecionada === opcao && !opcao.correta) return 'quiz-option--wrong';
    return '';
  }

  handleWordPointerDown(event: TouchEvent | MouseEvent, _word: string, index: number) {
    event.preventDefault();
    this.longPressTriggered = false;

    this.longPressTimeoutId = window.setTimeout(() => {
      this.longPressTriggered = true;
      this.isMultiSelectMode = true;
      this.toggleWordSelection(index);
      this.fetchSelectedWordsContext();
    }, 450);
  }

  handleWordPointerUp(event: TouchEvent | MouseEvent, _word: string, index: number) {
    event.preventDefault();

    if (this.longPressTimeoutId) {
      clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = undefined;
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

    this.fetchSelectedWordsContext();
  }

  handleWordPointerLeave() {
    if (this.longPressTimeoutId) {
      clearTimeout(this.longPressTimeoutId);
      this.longPressTimeoutId = undefined;
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
    if (!this.atividade?.texto) {
      return [];
    }

    const words = this.atividade.texto.split(' ');
    return Array.from(this.selectedWordIndexes)
      .sort((a, b) => a - b)
      .map((index) => words[index])
      .filter((word) => !!word);
  }

  private async fetchSelectedWordsContext() {
    const selectedWords = this.getSelectedWords();

    if (!selectedWords.length) {
      this.isLoadingUserQuestion = false;
      this.geminiResponse = '';
      return;
    }

    await this.obterContextoPalavras(selectedWords, this.atividade.texto);
  }

  async obterContextoPalavras(words: string[], frase: string) {
    const requestId = ++this.currentWordRequestId;
    this.isLoadingUserQuestion = true;
    this.isGeminiLoading = true;
    this.geminiResponse = '';

    const palavras = words.join(', ');
    const questionContext = `Você é um professor de inglês. Dê o significado (com limite estrito de 70 palavras) da seleção '${palavras}' considerando o texto completo a seguir: '${frase}'. Responda em português do Brasil e seja objetivo.`;

    try {
      const tutor = new Tutor();
      const response = await tutor.askDeepSeek(questionContext);

      if (this.currentWordRequestId === requestId) {
        this.geminiResponse = response;
      }
    } catch (error) {
      console.error('[TextoComponent] Erro ao buscar contexto da palavra', error);

      if (this.currentWordRequestId === requestId) {
        this.geminiResponse = 'Não foi possível carregar o significado agora. Tente novamente.';
      }
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
      const tutor = new Tutor();
      this.translationResponse = await tutor.askDeepSeek(prompt);
    } catch (error) {
      console.error('[TextoComponent] Erro ao traduzir texto', error);
      this.translationResponse = 'Não foi possível traduzir o texto agora. Tente novamente.';
    } finally {
      this.isTranslating = false;
    }
  }
}
