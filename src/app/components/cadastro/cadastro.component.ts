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
    MatButtonModule
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent {
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

  constructor(private fb: FormBuilder, usuarioRepositoryService: UsuarioRepositoryService, private snackBar: MatSnackBar, private router: Router) {
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

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log('Dados do formulário:', this.registrationForm.value);
      this.usuarioRepositoryService.postCadastro(this.registrationForm.value).subscribe({
        next: (res) => {
          console.log('User registered:', res);
          this.showMessage('Usuário registrado com sucesso!');
          this.router.navigate(['/login'], { queryParams: { email: this.registrationForm.value.email } });

        },
        error: (err) => {
          console.error(err);
          this.showMessage('Erro ao registrar usuário.', true);
        },
      });
    }
  }
}
