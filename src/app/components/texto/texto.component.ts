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
    if (opcao.correta) return 'correta';
    if (this.respostaSelecionada === opcao && !opcao.correta) return 'incorreta';
    return '';
  }

  async obterContextoPalavra(word: string, frase: string) {
    console.log(word);

    this.isLoadingUserQuestion = true;

    if (this.isGeminiLoading) return;

    this.isGeminiLoading = true;
    this.geminiResponse = '';

    const questionContext = `Você é um professor de inglês. Dê o significado (com limite estrito de 50 palavras) da palavra '${word}' no texto a seguir: '${frase}' | Responda em português do Brasil`;

    const tutor = new Tutor();
    this.geminiResponse = await tutor.askDeepSeek(questionContext);
    this.isGeminiLoading = false;
    this.isLoadingUserQuestion = false;
  }
}
