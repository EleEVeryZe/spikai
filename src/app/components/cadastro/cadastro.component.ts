import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, Observable, startWith } from 'rxjs';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Tutor } from '../../services/tutor.service';

export function requiredChipListValidator(areasSelecionadas: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = areasSelecionadas && areasSelecionadas.length > 0;
    return isValid ? null : { requiredChipList: true };
  };
}

interface VocabularyRequest {
  vocabulary: string;
  email?: string;
}


@Component({
  selector: 'app-cadastro',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinner,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  isLoading = false;
  hidePassword = true;
  registrationForm: FormGroup;
  ages: number[] = [];
  isEditMode = false;

  hasVocabularyChanged = false;

  separatorKeysCodes: number[] = [13, 188];
  areaCtrl = new FormControl();

  // ATENÇÃO: areasSelecionadas é a lista de chips que o usuário vê.
  areasSelecionadas: string[] = [];

  todasAsAreas: string[] = [
    'Tecnologia',
    'Programação',
    'Inteligência Artificial',
    'Cibersegurança',
    'Games',
    'Finanças',
    'Investimentos',
    'Economia',
    'Contabilidade',
    'Empreendedorismo',
    'Direito',
    'Psicologia',
    'Filosofia',
    'História',
    'Literatura',
    'Engenharia Civil',
    'Engenharia Elétrica',
    'Engenharia de Energia',
    'Arquitetura',
    'Saúde',
    'Nutrição',
    'Exercício Físico',
    'Saúde Mental',
    'Meditação',
    'Ciência',
    'Biologia',
    'Astronomia',
    'Química',
    'Física',
    'Arte',
    'Fotografia',
    'Música',
    'Cinema',
    'Design Gráfico',
    'Esportes',
    'Fitness',
    'Viagens',
    'Culinária',
    'Jardinagem',
    'Anime',
    'Universo Pop',
    'Moda',
    'Carros',
    'Jogos de Tabuleiro',
    'Meio Ambiente',
    'Sustentabilidade',
    'Geologia',
    'Exploração Espacial',
  ];

  areasFiltradas: Observable<string[]>;
  @ViewChild('chipList') chipList!: MatChipListbox;
  @ViewChild('areaInput') areaInput!: ElementRef<HTMLInputElement>;

  setVocabularyAsChanged() {
    this.hasVocabularyChanged = true;
  }

  educationLevels: string[] = [
    'Ensino Fundamental',
    'Ensino Médio',
    'Ensino Superior Incompleto',
    'Ensino Superior Completo',
    'Pós-graduação',
    'Outro',
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioRepositoryService: UsuarioRepositoryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // MANTENHA AQUI PARA ARMAZENAR O VALOR FINAL (string separada por ;)
      vocabulary: [
        '', // Valor inicial vazio
        requiredChipListValidator(this.areasSelecionadas), // <--- VALIDADOR APLICADO
      ],
    });

    for (let i = 5; i <= 100; i++) this.ages.push(i);

    // Inicialize o Observable de filtro aqui ou no ngOnInit
    this.areasFiltradas = this.areaCtrl.valueChanges.pipe(
      startWith(null),
      map((area: string | null) => (area ? this._filter(area) : this._filterAreasParaSugestao()))
    );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      this.isEditMode = !!userId;

      if (this.isEditMode && userId) {
        // Remove password requirement in edit mode and disable email
        this.registrationForm.get('password')?.clearValidators();
        this.registrationForm.get('password')?.updateValueAndValidity();
        this.registrationForm.get('email')?.disable();

        this.usuarioRepositoryService.getUserState(userId).subscribe({
          next: (user) => {
            if (user) {
              // CONVERSÃO: 'vocabulary' (string com ;) para 'areasSelecionadas' (string[])
              if (user.vocabulary) {
                this.areasSelecionadas = user.vocabulary.split(';').filter((a) => a.trim() !== '');
              } else {
                this.areasSelecionadas = [];
              }

              this.registrationForm.patchValue({
                name: user.name || '',
                email: user.email || '',
                age: user.age || '',
                gender: user.gender || '',
                education: user.education || '',
                // Não faz patchValue no 'vocabulary' do formulário,
                // ele será reconstruído pelo 'areasSelecionadas' no onSubmit
                // ou mantido vazio.
              });
            }
          },
          error: (err) => {
            console.error('Erro ao carregar usuário:', err);
            this.showMessage('Erro ao carregar dados do usuário.', true);
          },
        });
      }
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


  improveVocabularyOfInterest(value: VocabularyRequest): Promise<string> {
    if (!value?.vocabulary?.trim()) {
      return Promise.reject(new Error('Vocabulary field is required'));
    }

    const prompt = `Translate this from Portuguese to English using cognitively simpler terms. Return only a semicolon-separated list.

Example input: tecnologia, quimica, anime
Example output: Tools and machines; What stuff is made of; Cartoons from Japan

Input: ${value.vocabulary.trim()}

Output:`;

    const tutor = new Tutor();
    return tutor.askDeepSeek(prompt);
  }

  async onSubmit(): Promise<void> {
    if (!this.registrationForm.valid) {
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', true);
      this.markFormGroupTouched();
      return;
    }

    // PASSO CHAVE: Converte areasSelecionadas (string[]) para a string 'vocabulary' (string com ;)
    const vocabularyString = this.areasSelecionadas.join(';').trim();
    this.registrationForm.get('vocabulary')?.setValue(vocabularyString);

    const formData = this.registrationForm.value;
    this.isLoading = true;

    try {
      let userData;
      if (this.hasVocabularyChanged && vocabularyString) {
        // Só chama a IA se o vocabulário mudou E não estiver vazio
        const IAVocabulary = await this.improveVocabularyOfInterest(formData);
        userData = { ...formData, IAVocabulary };
      } else {
        // Se não mudou OU está vazio, usa o valor do formulário (que agora tem o 'vocabulary' correto)
        userData = formData;
      }

      if (this.isEditMode) {
        // Update existing user
        const email = this.usuarioRepositoryService.getUserEmail(); // Assume que este método retorna o email correto do usuário logado
        // Se estiver em modo de edição, o email está desabilitado, então precisamos pegar o valor do controle desabilitado
        const formEmail = this.registrationForm.get('email')?.value || email;

        this.usuarioRepositoryService
          .updateUser({ ...userData, email: formEmail }) // Certifica-se de usar o email correto
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.showMessage('Usuário atualizado com sucesso!');
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('Erro ao atualizar usuário:', err);
              if (err?.error) this.showMessage(err?.error.message, true);
              else this.showMessage('Erro ao atualizar usuário.', true);
            },
          });
      } else {
        // Register new user
        this.usuarioRepositoryService
          .postCadastro(userData)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe({
            next: () => {
              this.showMessage('Usuário registrado com sucesso!');
              this.router.navigate(['/login'], {
                queryParams: { email: formData.email },
              });
            },
            error: (err) => {
              console.error('Erro ao registrar usuário:', err);
              if (err?.error) this.showMessage(err?.error.message, true);
              else this.showMessage('Erro ao registrar usuário.', true);
            },
          });
      }
    } catch (error) {
      console.error('Vocabulary generation failed:', error);
      this.isLoading = false;
      this.submitWithFallbackVocabulary();
    }
  }

  private submitWithFallbackVocabulary(): void {
    // PASSO CHAVE: Converte areasSelecionadas (string[]) para a string 'vocabulary' (string com ;) para o fallback
    const vocabularyString = this.areasSelecionadas.join(';').trim();
    this.registrationForm.get('vocabulary')?.setValue(vocabularyString);

    const formData = this.registrationForm.value;
    // Se estiver em modo de edição, o email está desabilitado, então precisamos pegar o valor do controle desabilitado
    const formEmail = this.registrationForm.get('email')?.value;

    let userData = { ...formData };
    if (this.isEditMode && formEmail) {
      userData.email = formEmail; // Adiciona o email correto no modo de edição
    }

    const submitMethod = this.isEditMode
      ? this.usuarioRepositoryService.updateUser(userData)
      : this.usuarioRepositoryService.postCadastro(userData);

    submitMethod.subscribe({
      next: () => {
        this.showMessage(this.isEditMode ? 'Usuário atualizado (sem processamento IA).' : 'Usuário registrado (sem processamento IA).');
        this.router.navigate(this.isEditMode ? ['/'] : ['/login']);
      },
      error: (err) => {
        console.error('Erro ao salvar usuário (fallback):', err);
        this.showMessage('Erro ao salvar usuário (fallback).', true);
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach((key) => this.registrationForm.get(key)?.markAsTouched());
  }

  // Filtro que verifica se a área digitada é substring de alguma sugestão
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    // Filtra apenas as áreas que ainda não foram selecionadas
    return this._filterAreasParaSugestao().filter((area) => area.toLowerCase().includes(filterValue));
  }

  // Retorna a lista de áreas que *ainda não* estão nos chips
  private _filterAreasParaSugestao(): string[] {
    return this.todasAsAreas.filter((area) => !this.areasSelecionadas.includes(area));
  }

  private updateVocabularyAndValidate(): void {
    const vocabularyControl = this.registrationForm.get('vocabulary');

    // 1. Atualiza o valor do controle (string separada por ;)
    const vocabularyString = this.areasSelecionadas.join(';');
    vocabularyControl?.setValue(vocabularyString, { emitEvent: false });

    // 2. Força a revalidação (necessário pois a validação depende de uma variável externa)
    vocabularyControl?.markAsTouched();
    vocabularyControl?.updateValueAndValidity();
  }

  // Adicionar um novo Chip (ao pressionar Enter ou Vírgula)
  addArea(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Adiciona apenas se o valor não estiver vazio e não for repetido
    if (value && !this.areasSelecionadas.includes(value)) {
      this.areasSelecionadas.push(value);
      this.setVocabularyAsChanged();
      this.updateVocabularyAndValidate(); // <--- CHAMADA ADICIONADA
    }

    // Limpa o input
    event.chipInput!.clear();
    this.areaCtrl.setValue(null);
  }

  // Remover um Chip
  removeArea(area: string): void {
    const index = this.areasSelecionadas.indexOf(area);

    if (index >= 0) {
      this.areasSelecionadas.splice(index, 1);
      this.setVocabularyAsChanged();
      this.updateVocabularyAndValidate(); // <--- CHAMADA ADICIONADA
    }
  }

  // Selecionar uma sugestão do Autocomplete
  selectedArea(event: MatAutocompleteSelectedEvent): void {
    const area = event.option.viewValue;

    if (!this.areasSelecionadas.includes(area)) {
      this.areasSelecionadas.push(area);
      this.setVocabularyAsChanged();
      this.updateVocabularyAndValidate();
    }

    this.areaInput.nativeElement.value = '';
    this.areaCtrl.setValue(null);
  }
}
