import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';
// Interface para estruturar os dados de cada palavra
interface WordItem {
  word: string;
  memorized: boolean; // O estado do checkbox
}

@Component({
  selector: 'app-memorizacao',
  imports: [
        CommonModule,
    FormsModule,
  ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './memorizacao.component.html',
  styleUrl: './memorizacao.component.scss'
})
export class MemorizacaoComponent {
 // 1. Array de input
  inputSentences: string[] = [];

  isLoading: boolean = false;

  // 2. Formulário principal (Reactive Forms)
  wordForm: FormGroup;

  constructor(private fb: FormBuilder, private readonly usuarioRepositoryService: UsuarioRepositoryService, private snackBar: MatSnackBar, private router: Router) {
    // Inicializa o formulário com um FormArray vazio para as palavras
    this.wordForm = this.fb.group({
      words: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.usuarioRepositoryService.getUserState().subscribe(({cursos}) => {
      const quizz = cursos[0].atividades[2];
       this.inputSentences = quizz.perguntas.map(( { sentence } : any ) => sentence);
       this.processSentences();
    });
    
  }

  // Getter para acessar o FormArray no template
  get wordsArray(): FormArray {
    return this.wordForm.get('words') as FormArray;
  }

  /**
   * 3. Lógica principal para processar as frases
   */
  processSentences(): void {
    const allWords: string[] = [];
    const ignoredPatterns = ['___']; // Padrões a serem ignorados

    // 3.1. Extrair e Limpar Palavras
    this.inputSentences.forEach(sentence => {
      // Regex: Substitui todos os sinais de pontuação e os padrões ignorados por espaço,
      // depois divide a frase em palavras.
      const cleanedSentence = sentence.replace(/[.,!?:;"]/g, ' ').replace(new RegExp(ignoredPatterns.join('|'), 'g'), ' ');
      
      const words = cleanedSentence
        .split(/\s+/) // Divide por um ou mais espaços
        .filter(word => word.length > 0) // Remove strings vazias
        .map(word => word.toLowerCase()); // Converte para minúsculas

      allWords.push(...words);
    });

    // 3.2. Remover Duplicatas e Preencher FormArray
    const uniqueWords = Array.from(new Set(allWords));
    
    uniqueWords.forEach(word => {
      // Adiciona um novo FormGroup (palavra e estado) ao FormArray
      this.wordsArray.push(this.createWordControl(word));
    });
  }

  showMessage(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
    });
  }
  
  /**
   * Cria um FormGroup para cada palavra, contendo a palavra e o estado do checkbox.
   */
  createWordControl(word: string): FormGroup {
    return this.fb.group({
      word: new FormControl(word),         // A palavra em si (apenas para exibição)
      memorized: new FormControl(false)    // O checkbox (false = não memorizada)
    });
  }

  /**
   * 4. Exibe o resultado do formulário
   */
  onSubmit(): void {
    const formValue = this.wordForm.value;
    console.log('Todas as Palavras e Status:', formValue.words);

    const memorizedWords = formValue.words
      .filter((item: WordItem) => item.memorized)
      .map((item: WordItem) => item.word);

    const unmemorizedWords = formValue.words
      .filter((item: WordItem) => !item.memorized)
      .map((item: WordItem) => item.word);

    console.log('Palavras Memorizadas:', memorizedWords);
    console.log('Palavras NÃO Memorizadas:', unmemorizedWords);

     const email = this.usuarioRepositoryService.getUserEmail();
            this.usuarioRepositoryService
              .updateUser({ memoria: { memorizedWords, unmemorizedWords }, email })
              .pipe(finalize(() => (this.isLoading = false)))
              .subscribe({
                next: () => {
                  this.showMessage('Lista de palavras salva com sucesso!');
                  this.router.navigate(['/']);
                },
                error: (err) => {
                  console.error('Erro ao atualizar:', err);
                  if (err?.error) this.showMessage(err?.error.message, true);
                  else this.showMessage('Erro ao atualizar.', true);
                }
              });
  }
}
