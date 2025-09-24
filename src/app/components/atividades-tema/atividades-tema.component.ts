import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Tema } from '../../model/tema.model';
import { TemasService } from '../../services/temas.service';

@Component({
  selector: 'app-atividades-tema',
  imports: [MatProgressBarModule, MatButtonModule, CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './atividades-tema.component.html',
  styleUrl: './atividades-tema.component.scss',
})
export class AtividadesTemaComponent {
  tema: Tema | undefined;
  temaAnteriorConcluido = true;

  constructor(private route: ActivatedRoute, private temasService: TemasService, private router: Router ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const temaId = params.get('id');
      if (temaId) {
        this.temasService.getTema(temaId).subscribe((tema: any) => {
          this.tema = tema;
          if (tema.id === 2) {
            this.temasService.getTema('1').subscribe((prevTema) => {
              this.temaAnteriorConcluido = prevTema?.completo ?? false;
            });
          } else {
            this.temaAnteriorConcluido = true; // Primeiro tema sempre liberado
          }
        });
      }
    });
  }

  getTemaProgress(): number {
    if (!this.tema || !this.tema.atividades.length) {
      return 0;
    }
    const atividadesConcluidas = this.tema.atividades.filter((a) => a.concluida).length;
    return Math.round((atividadesConcluidas / this.tema.atividades.length) * 100);
  }

  getActivityIcon(activityName: 'Pré-teste' | 'Conteúdo' | 'Quizz' | 'Pós-teste'): string {
    switch (activityName) {
      case 'Pré-teste':
        return 'assignment'; // Ícone de formulário/tarefa
      case 'Conteúdo':
        return 'book'; // Ícone de livro
      case 'Quizz':
        return 'quiz'; // Ícone de questionário (se disponível, senão 'help_outline')
      case 'Pós-teste':
        return 'grading'; // Ícone de avaliação/teste
      default:
        return 'help_outline';
    }
  }

  iniciarAtividade(nomeAtividade: string) {
    this.router.navigate(['/' + this.tema?.id + "/" + nomeAtividade]);
  }
}
