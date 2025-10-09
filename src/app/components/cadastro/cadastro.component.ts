import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

interface VocabularyRequest {
  vocabulary: string;
  email?: string;
}

interface DeepSeekResponse {
  choices?: Array<{
    message?: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}

export const environment = {
  production: false,
  deepSeekApiKey: 'sk-2a4144829a9946fc9d01b0e8be0bf98d',
};

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
    // Default form setup (password required by default)
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      vocabulary: [''],
    });

    for (let i = 5; i <= 100; i++) this.ages.push(i);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('userId');
      this.isEditMode = !!userId;

      if (this.isEditMode && userId) {
        // Remove password requirement in edit mode
        this.registrationForm.get('password')?.clearValidators();
        this.registrationForm.get('password')?.updateValueAndValidity();

        // ✅ Disable email field in edit mode
        this.registrationForm.get('email')?.disable();

        this.usuarioRepositoryService.getUserState(userId).subscribe({
          next: (user) => {
            if (user) {
              this.registrationForm.patchValue({
                name: user.name || '',
                email: user.email || '',
                age: user.age || '',
                gender: user.gender || '',
                education: user.education || '',
                vocabulary: user.vocabulary || '',
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

  DEEPSEEK_CONFIG = {
    API_URL: 'https://api.deepseek.com/v1/chat/completions',
    MODEL: 'deepseek-chat',
    MAX_RETRIES: 5,
    INITIAL_DELAY: 1000,
    MAX_TOKENS: 1000,
    TEMPERATURE: 0,
  } as const;

  improveVocabularyOfInterest(value: VocabularyRequest): Promise<string> {
    if (!value?.vocabulary?.trim()) {
      return Promise.reject(new Error('Vocabulary field is required'));
    }

    const prompt = `Translate this from Portuguese to English using cognitively simpler terms. Return only a semicolon-separated list.

Example input: tecnologia, quimica, anime
Example output: Tools and machines; What stuff is made of; Cartoons from Japan

Input: ${value.vocabulary.trim()}

Output:`;

    return this.askDeepSeek(prompt);
  }

  async askDeepSeek(prompt: string): Promise<string> {
    const apiKey = this.getDeepSeekApiKey();
    let delay = this.DEEPSEEK_CONFIG.INITIAL_DELAY;

    for (let attempt = 0; attempt < this.DEEPSEEK_CONFIG.MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(this.DEEPSEEK_CONFIG.API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.DEEPSEEK_CONFIG.MODEL,
            messages: [{ role: 'user', content: prompt }],
            temperature: this.DEEPSEEK_CONFIG.TEMPERATURE,
            max_tokens: this.DEEPSEEK_CONFIG.MAX_TOKENS,
          }),
        });

        if (!response.ok) {
          if (response.status === 429 && attempt < this.DEEPSEEK_CONFIG.MAX_RETRIES - 1) {
            await this.delay(delay);
            delay *= 2;
            continue;
          }
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const result: DeepSeekResponse = await response.json();

        if (!result.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from API');
        }

        return result.choices[0].message.content.trim();
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === this.DEEPSEEK_CONFIG.MAX_RETRIES - 1) {
          throw new Error('Unable to generate vocabulary after multiple attempts.');
        }
        await this.delay(delay);
        delay *= 2;
      }
    }

    throw new Error('Unexpected error in API call');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getDeepSeekApiKey(): string {
    return environment.deepSeekApiKey;
  }

  async onSubmit(): Promise<void> {
    if (!this.registrationForm.valid) {
      this.showMessage('Por favor, preencha todos os campos obrigatórios.', true);
      this.markFormGroupTouched();
      return;
    }

    const formData = this.registrationForm.value;
    this.isLoading = true;

    try {
      let userData;
      if (this.hasVocabularyChanged) {
        const IAVocabulary = await this.improveVocabularyOfInterest(formData);
        userData = { ...formData, IAVocabulary };
      } else userData = formData;

      if (this.isEditMode) {
        // Update existing user
        this.usuarioRepositoryService
          .updateUser(userData)
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
            }
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
            }
          });
      }
    } catch (error) {
      console.error('Vocabulary generation failed:', error);
      this.isLoading = false;
      this.submitWithFallbackVocabulary();
    }
  }

  private submitWithFallbackVocabulary(): void {
    const formData = this.registrationForm.value;
    const userData = { ...formData };

    const submitMethod = this.isEditMode
      ? this.usuarioRepositoryService.updateUser(userData)
      : this.usuarioRepositoryService.postCadastro(userData);

    submitMethod.subscribe({
      next: () => {
        this.showMessage(this.isEditMode ? 'Usuário atualizado (vocabulário original).' : 'Usuário registrado (vocabulário original).');
        this.router.navigate(this.isEditMode ? ['/temas'] : ['/login']);
      },
      error: (err) => {
        console.error('Erro ao salvar usuário:', err);
        this.showMessage('Erro ao salvar usuário.', true);
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach((key) => this.registrationForm.get(key)?.markAsTouched());
  }
}
