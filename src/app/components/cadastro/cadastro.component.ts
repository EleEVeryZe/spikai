import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// Importações do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

// Add interface for better type safety
interface VocabularyRequest {
  vocabulary: string;
  email?: string;
  // Add other form fields as needed
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
  deepSeekApiKey: 'sk-2a4144829a9946fc9d01b0e8be0bf98d' // Replace with actual environment variable
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
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
  isLoading!: boolean;
  usuarioRepositoryService!: UsuarioRepositoryService;
  hidePassword = true;
  registrationForm: FormGroup;
  ages: number[] = [];
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
    usuarioRepositoryService: UsuarioRepositoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.usuarioRepositoryService = usuarioRepositoryService;
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      education: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      vocabulary: [''],
    });

    for (let i = 1; i <= 100; i++) {
      this.ages.push(i);
    }
  }

  ngOnInit(): void {}

  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
    });
  }

// Constants for better maintainability
 DEEPSEEK_CONFIG = {
  API_URL: 'https://api.deepseek.com/v1/chat/completions',
  MODEL: 'deepseek-chat',
  MAX_RETRIES: 5,
  INITIAL_DELAY: 1000,
  MAX_TOKENS: 1000,
  TEMPERATURE: 0
} as const;

improveVocabularyOfInterest(value: VocabularyRequest): Promise<string> {
  // Validate input
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

/**
 * Calls the DeepSeek API with retry mechanism and proper error handling
 */
async askDeepSeek(prompt: string): Promise<string> {
  const apiKey = this.getDeepSeekApiKey(); // Move API key to environment
  let delay = this.DEEPSEEK_CONFIG.INITIAL_DELAY;

  for (let attempt = 0; attempt < this.DEEPSEEK_CONFIG.MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(this.DEEPSEEK_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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

      const text = result.choices[0].message.content.trim();
      console.log('API call successful. Tokens used:', result.usage?.total_tokens);
      
      return text;

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === this.DEEPSEEK_CONFIG.MAX_RETRIES - 1) {
        throw new Error('Unable to generate vocabulary after multiple attempts. Please try again later.');
      }
      
      await this.delay(delay);
      delay *= 2;
    }
  }

  throw new Error('Unexpected error in API call');
}

// Helper method for delays
private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Secure way to handle API key (move to environment/service)
private getDeepSeekApiKey(): string {
  // In production, use environment variables or a secure config service
  return environment.deepSeekApiKey || 'sk-2a4144829a9946fc9d01b0e8be0bf98d';
}

async onSubmit(): Promise<void> {
  if (this.registrationForm.valid) {
    try {
      const formData = this.registrationForm.value;
      console.log('Form data:', formData);

      // Show loading state to user
      this.isLoading = true;

      const improvedVocabulary = await this.improveVocabularyOfInterest(formData);
      
      const userData = {
        ...formData,
        vocabulary: improvedVocabulary
      };

      this.usuarioRepositoryService.postCadastro(userData).subscribe({
        next: (res) => {
          console.log('User registered successfully:', res);
          this.showMessage('Usuário registrado com sucesso!');
          this.router.navigate(['/login'], { 
            queryParams: { email: formData.email } 
          });
        },
        error: (err) => {
          console.error('Registration failed:', err);
          this.showMessage('Erro ao registrar usuário. Tente novamente.', true);
        },
        complete: () => {
          this.isLoading = false;
        }
      });

    } catch (error) {
      console.error('Vocabulary generation failed:', error);
      this.isLoading = false;
      
      // Fallback: proceed with original vocabulary
      this.submitWithFallbackVocabulary();
    }
  } else {
    this.showMessage('Por favor, preencha todos os campos obrigatórios.', true);
    this.markFormGroupTouched();
  }
}

// Fallback method if vocabulary generation fails
private submitWithFallbackVocabulary(): void {
  const formData = this.registrationForm.value;
  const userData = {
    ...formData,
    vocabulary: formData.vocabulary // Use original vocabulary
  };

  this.usuarioRepositoryService.postCadastro(userData).subscribe({
    next: (res) => {
      console.log('User registered with original vocabulary:', res);
      this.showMessage('Usuário registrado com sucesso! (Vocabulário original)');
      this.router.navigate(['/login'], { 
        queryParams: { email: formData.email } 
      });
    },
    error: (err) => {
      console.error('Registration failed:', err);
      this.showMessage('Erro ao registrar usuário.', true);
    }
  });
}

// Helper to mark form as touched for validation
private markFormGroupTouched(): void {
  Object.keys(this.registrationForm.controls).forEach(key => {
    this.registrationForm.get(key)?.markAsTouched();
  });
}
}
