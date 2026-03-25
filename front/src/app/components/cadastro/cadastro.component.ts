import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
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
import { AITutorPort } from '../../ports/AITutor.port';
import { AI_TUTOR_TOKEN } from '../../ports/AITutor.token';

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
  editUserId: number | null = null;

  hasVocabularyChanged = false;

  separatorKeysCodes: number[] = [13, 188];
  areaCtrl = new FormControl();

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
    private route: ActivatedRoute,
    @Inject(AI_TUTOR_TOKEN) readonly tutor: AITutorPort,
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      vocabulary: [
        '', 
        requiredChipListValidator(this.areasSelecionadas), // <--- VALIDADOR APLICADO
      ],
    });

    for (let i = 5; i <= 100; i++) this.ages.push(i);

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
        this.editUserId = Number(userId);

        this.registrationForm.get('password')?.clearValidators();
        this.registrationForm.get('password')?.updateValueAndValidity();
        this.registrationForm.get('email')?.disable();

        this.usuarioRepositoryService.getUserState(userId).subscribe({
          next: (user) => {
            if (user) {
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

    return this.tutor.ask(prompt);
  }

  async onSubmit(): Promise<void> {
    if (!this.registrationForm.valid) {
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', true);
      this.markFormGroupTouched();
      return;
    }

    const vocabularyString = this.areasSelecionadas.join(';').trim();
    this.registrationForm.get('vocabulary')?.setValue(vocabularyString);

    const formData = this.registrationForm.value;
    this.isLoading = true;

    try {
      let userData;
      if (this.hasVocabularyChanged && vocabularyString) {
        const IAVocabulary = await this.improveVocabularyOfInterest(formData);
        userData = { ...formData, IAVocabulary };
      } else {
        userData = formData;
      }

      if (this.isEditMode) {
        const email = this.usuarioRepositoryService.getUserEmail(); // Assume que este método retorna o email correto do usuário logado
        const formEmail = this.registrationForm.get('email')?.value || email;

        const updatePayload = {
          ...userData,
          email: formEmail,
          ...(this.editUserId != null ? { id: this.editUserId } : {}),
        };

        this.usuarioRepositoryService
          .updateUser(updatePayload)
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
    const vocabularyString = this.areasSelecionadas.join(';').trim();
    this.registrationForm.get('vocabulary')?.setValue(vocabularyString);

    const formData = this.registrationForm.value;
    const formEmail = this.registrationForm.get('email')?.value;

    let userData = { ...formData };
    if (this.isEditMode && formEmail) {
      userData.email = formEmail; 
    }

    const payload = this.isEditMode
      ? { ...userData, ...(this.editUserId != null ? { id: this.editUserId } : {}) }
      : userData;

    const submitMethod = this.isEditMode
      ? this.usuarioRepositoryService.updateUser(payload)
      : this.usuarioRepositoryService.postCadastro(payload);

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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this._filterAreasParaSugestao().filter((area) => area.toLowerCase().includes(filterValue));
  }

  private _filterAreasParaSugestao(): string[] {
    return this.todasAsAreas.filter((area) => !this.areasSelecionadas.includes(area));
  }

  private updateVocabularyAndValidate(): void {
    const vocabularyControl = this.registrationForm.get('vocabulary');

    const vocabularyString = this.areasSelecionadas.join(';');
    vocabularyControl?.setValue(vocabularyString, { emitEvent: false });

    vocabularyControl?.markAsTouched();
    vocabularyControl?.updateValueAndValidity();
  }

  addArea(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.areasSelecionadas.includes(value)) {
      this.areasSelecionadas.push(value);
      this.setVocabularyAsChanged();
      this.updateVocabularyAndValidate(); 
    }

    event.chipInput!.clear();
    this.areaCtrl.setValue(null);
  }

  removeArea(area: string): void {
    const index = this.areasSelecionadas.indexOf(area);

    if (index >= 0) {
      this.areasSelecionadas.splice(index, 1);
      this.setVocabularyAsChanged();
      this.updateVocabularyAndValidate(); 
    }
  }

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
