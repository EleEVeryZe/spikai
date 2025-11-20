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
import { debounceTime, switchMap, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';


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
  private selection$ = new Subject<void>();
  isMultiSelectMode = false;
  translationResponse = '';
  isTranslating = false;
  isLoadingAtividade = true;
  currentQuestionIndex = 0;
  isTransitioning = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly usuarioRepositoryService: UsuarioRepositoryService,
    private readonly temasService: TemasService
  ) { }

  ngOnInit(): void {
    this.selection$.pipe(
      debounceTime(1000),
      switchMap(() => {
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
      }
    });

    this.route.paramMap.subscribe((params) => {
      const idCurso = params.get('id');

      this.usuarioRepositoryService.getUserState().subscribe(async ({ cursos }) => {
        const quizz = cursos[0].atividades[2];
        this.inputSentences = quizz.perguntas.map(({ sentence }: any) => sentence);
        this.uniqueWords = this.processSentences();

        const atvd = cursos[0].atividades.find((atv) => atv.nome === 'Texto');
        if (atvd && atvd.texto.length > 0) {
          this.atividade = atvd;
          this.isLoadingAtividade = false;
        } else 
          this.getSmartText(this.uniqueWords).then((atividade) => {
            this.atividade = atividade;
            this.currentQuestionIndex = 0;
            this.isLoadingAtividade = false;
            this.temasService.responderQuizz(this.atividade.perguntas, idCurso, { texto: this.atividade.texto, nomeAtividade: "Texto" }).subscribe();
          });
      });
    });
  }

  async getSmartText(uniqueWords: string[]) {
    if (!uniqueWords.length) {
      return Promise.reject(new Error('Vocabulary field is required'));
    }

    const prompt = `Você é um tutor de inglês. Sua tarefa é criar um exercício de compreensão de leitura e gramática baseado em uma lista de palavras-chave.

## 📝 Instruções de Criação

1.  **Crie um texto em inglês de aproximadamente 200 palavras** usando a lista de palavras-chave fornecida.
2.  O texto deve obrigatoriamente incorporar o **Verbo To Be** (em suas diversas formas: $am, is, are$) e o **Present Continuous** (estrutura: $to\ be\ +\ verbo\ no\ -ing$) de forma natural e frequente.
3.  Após o texto, crie **5 perguntas** de múltipla escolha sobre o conteúdo do texto.
4.  Cada pergunta deve ter **4 opções de resposta**:
    * **1 opção correta** que reflita o texto com precisão.
    * **3 opções incorretas** (distratores).
5.  O formato de saída deve ser um objeto JSON estrito, como mostrado no exemplo abaixo.

**Input:** ${uniqueWords.join(', ')}

---

**Exemplo de Formato de Resposta JSON:**
{
    "texto": "...",
    "perguntas": [
        {
            "pergunta": "Qual é a profissão de Ana, de acordo com o texto?",
            "opcoes": [
                {"descricao": "Ela é programadora de computador.", "correta": false},
                {"descricao": "Ela é médica.", "correta": true},
                {"descricao": "Ela está estudando direito.", "correta": false},
                {"descricao": "Ela é professora de história.", "correta": false}
            ]
        },
        // ... mais 4 perguntas nesse formato ...
    ]
}
    `;

    const tutor = new Tutor();
    const tutorAnswer = await tutor.askDeepSeek(prompt);
    const response: SmartTextResponse = JSON.parse(tutorAnswer);
    return {
      nome: 'Texto' as const,
      concluida: false,
      videos: [],
      texto: response.texto || '',
      perguntas: response.perguntas
    } as any;
  }

  processSentences(): string[] {
    const allWords: string[] = [];
    const ignoredPatterns = ['___'];

    this.inputSentences.forEach((sentence) => {
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

    // Aguardar um pouco para mostrar o feedback
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Fade out
    this.isTransitioning = true;
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Avançar para próxima pergunta
    this.currentQuestionIndex++;
    this.respondeu = false;
    this.respostaSelecionada = undefined;

    // Fade in
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
    event.preventDefault();
    this.longPressTriggered = false;

    this.longPressTimeoutId = window.setTimeout(() => {
      this.selectedWordIndexes.clear();
      this.longPressTriggered = true;
      this.isMultiSelectMode = true;
      this.toggleWordSelection(index);
      this.selection$.next();
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

    this.selection$.next();
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

  async obterContextoPalavras(words: string[], frase: string) {
    const requestId = ++this.currentWordRequestId;
    this.isLoadingUserQuestion = true;
    this.isGeminiLoading = true;
    this.geminiResponse = '';

    const palavras = words.join(' ');
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
