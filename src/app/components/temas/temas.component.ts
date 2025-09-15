import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-temas',
  imports: [
     CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatGridListModule,
    MatButtonModule,
  ],
  templateUrl: './temas.component.html',
  styleUrl: './temas.component.scss'
})
export class TemasComponent {
  temas = [
    { nome: 'to-be', titulo: 'To Be', concluido: 40 },
    { nome: 'present-continuous', titulo: 'Present Continuous', concluido: 75 },
    { nome: 'simple-past', titulo: 'Simple Past', concluido: 20 },
    // adicione mais temas conforme necessário
  ];

  constructor(private router: Router) {

  }

  navegarParaTema(tema: string) {
    this.router.navigate(['/tema', 1]);
  }
}

