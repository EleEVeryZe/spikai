import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { UiUtilsService } from '../../services/ui.utils.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

export interface Teacher {
  id?: string;
  name: string;
  phone: string;
  email: string;
  birthDate?: Date;
  gender?: 'M' | 'F' | 'other' | 'prefer-not-to-say';
  languages: string[];
  experienceYears: number;
  hourlyRate: number;
  educationLevel?: 'high-school' | 'bachelor' | 'master' | 'phd' | 'other';
  hasCertificate: boolean;
  certificateType?: string;
  availableTimes: string[];
  biography?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LanguageOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-cadastro-professor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule ,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cadastro-professor.component.html',
  styleUrl: './cadastro-professor.component.scss'
})
export class CadastroProfessorComponent implements OnInit {
   @Output() teacherSubmitted = new EventEmitter<Teacher>();
  
  teacherForm: FormGroup;
  isSubmitting = false;
  maxDate = new Date();
  
  // Opções para os selects
  genderOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Feminino' },
    { value: 'other', label: 'Outro' },
    { value: 'prefer-not-to-say', label: 'Prefiro não dizer' }
  ];
  
  educationOptions = [
    { value: 'high-school', label: 'Ensino Médio' },
    { value: 'bachelor', label: 'Graduação' },
    { value: 'master', label: 'Mestrado' },
    { value: 'phd', label: 'Doutorado' },
    { value: 'other', label: 'Outro' }
  ];
  
  languageOptions: LanguageOption[] = [
    { value: 'english', label: 'Inglês' },
    { value: 'spanish', label: 'Espanhol' },
    { value: 'french', label: 'Francês' },
    { value: 'german', label: 'Alemão' },
    { value: 'italian', label: 'Italiano' },
    { value: 'japanese', label: 'Japonês' },
    { value: 'chinese', label: 'Chinês' },
    { value: 'portuguese', label: 'Português' },
    { value: 'russian', label: 'Russo' },
    { value: 'korean', label: 'Coreano' }
  ];
  
  availableTimes = [
    'Manhã (8h-12h)',
    'Tarde (13h-17h)',
    'Noite (18h-22h)',
    'Finais de semana'
  ];
  
  certificateOptions = [
    'TOEFL',
    'IELTS',
    'Cambridge',
    'DELE',
    'DELF',
    'CELTA',
    'TEFL',
    'Outro'
  ];

  constructor(
    private fb: FormBuilder,
    private uiUtils: UiUtilsService,
    private usuarioRepositoryService: UsuarioRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teacherForm = this.createForm();
  }

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this.fb.group({
      // Informações pessoais
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{4,5}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: [null],
      gender: ['prefer-not-to-say'],
      
      // Informações profissionais
      languages: [[], [Validators.required, Validators.minLength(1)]],
      experienceYears: [0, [Validators.required, Validators.min(0), Validators.max(50)]],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      educationLevel: ['bachelor'],
      hasCertificate: [false],
      certificateType: [''],
      
      // Disponibilidade
      availableTimes: [[]],
      
      // Biografia
      biography: ['', [Validators.maxLength(1000)]],
      
      // Endereço (opcional)
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      })
    });
  }

  get f() {
    return this.teacherForm.controls;
  }

  get addressControls() {
    return (this.teacherForm.get('address') as FormGroup).controls;
  }

  onCertificateChange(event: any): void {
    const hasCert = event.checked;
    const certTypeControl = this.teacherForm.get('certificateType');
    
    if (hasCert) {
      certTypeControl?.setValidators([Validators.required]);
    } else {
      certTypeControl?.clearValidators();
      certTypeControl?.setValue('');
    }
    certTypeControl?.updateValueAndValidity();
  }

  formatPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 10) {
      value = value.substring(0, 11);
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)$/, '($1');
    }
    
    this.teacherForm.patchValue({ phone: value });
  }

  onSubmit(): void {
    if (this.teacherForm.invalid) {
      this.markFormGroupTouched(this.teacherForm);
      return;
    }

    this.isSubmitting = true;

    const teacherData: Teacher = {
        ...this.teacherForm.value,
        ehProfessor: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

     this.usuarioRepositoryService
              .postCadastro(teacherData)
              .pipe(finalize(() => (this.isSubmitting = false)))
              .subscribe({
                next: () => {
                  this.uiUtils.showMessage('Usuário registrado com sucesso!');
                  this.router.navigate(['/login'], {
                    queryParams: { email: teacherData.email },
                  });
                },
                error: (err) => {
                  console.error('Erro ao registrar usuário:', err);
                  if (err?.error) this.uiUtils.showMessage(err?.error.message, true);
                  else this.uiUtils.showMessage('Erro ao registrar usuário.', true);
                },
              });
  }

  onCancel(): void {
    if (confirm('Deseja cancelar o cadastro? Todas as alterações serão perdidas.')) {
      this.teacherForm.reset({
        gender: 'prefer-not-to-say',
        experienceYears: 0,
        hourlyRate: 0,
        educationLevel: 'bachelor',
        hasCertificate: false,
        availableTimes: []
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  toggleAvailableTime(a: any, b: any) {

  }
}