import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,

    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private usuarioRepositoryService: UsuarioRepositoryService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  loginForm!: FormGroup;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  isLoading = false;

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) this.router.navigate(['/principal']);

    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });

    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      if (email) {
        this.loginForm.patchValue({ email });
      }
    });
  }
  
  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulário enviado!', this.loginForm.value);
      this.isLoading = true;
      this.usuarioRepositoryService.onLogin(this.loginForm.value.email.toLowerCase(), this.loginForm.value.password).subscribe({
        next: (res: any) => {
          console.log('Login successful:', res);
          this.auth.login(res.token, this.loginForm.value.email);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error(err);
          if (err?.error?.message)
            this.showMessage(err?.error?.message); 
          else 
            this.showMessage('Erro ao fazer login.');

          this.isLoading = false;
        },
      });
    }
  }

  onRegister() {
    this.router.navigate(['/cadastro']);
  }
}
