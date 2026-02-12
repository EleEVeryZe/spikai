import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AtividadeBase } from '../../model/atividade.model';
import { Curso } from '../../model/curso.model';
import { SharedUiService } from '../../services/shared-ui.service';
import { TemasService } from '../../services/temas.service';

@Component({
  selector: 'app-atividades-tema',
  imports: [
    MatProgressBarModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    YouTubePlayerModule,
  ],
  templateUrl: './atividades-tema.component.html',
  styleUrl: './atividades-tema.component.scss',
})
export class AtividadesTemaComponent {
  tema: Curso | undefined;
  temaAnteriorConcluido = true;
  isLoadingTema = true;

  constructor(
    private readonly sharedService: SharedUiService,
    private route: ActivatedRoute,
    private temasService: TemasService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  getCardBtnTxt(ehAtvdConcluida: boolean) {
    return ehAtvdConcluida ? 'Revisar' : 'Iniciar';
  }


  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: isError ? ['snackbar-error'] : ['snackbar-success'],
    });
  }

  ngOnInit(): void {
    this.sharedService.hideArrowBackToolbar(false);
    this.sharedService.goBackTo('/');
    this.route.paramMap.subscribe((params) => {
      const temaId = params.get('id');
      if (temaId) {
        this.temasService.getTemas().subscribe((temas: any) => {
          const temaIdx = temas.findIndex((cur: any) => cur.id == temaId);
          this.tema = temas[temaIdx];
          if (temaIdx > 0) this.temaAnteriorConcluido = temas[temaIdx - 1]?.completo ?? false;
          this.isLoadingTema = false;
        });
      }
    });
  }

  ehAtividadeAnteriorConcluida(i: number) {
    if (i === 0) return false;
    return !this.tema?.atividades[i - 1].concluida;
  }

  getTemaProgress(): number {
    if (!this.tema || !this.tema.atividades.length) {
      return 0;
    }
    const atividadesConcluidas = this.tema.atividades.filter((a) => a.concluida).length;
    return Math.round((atividadesConcluidas / this.tema.atividades.length) * 100);
  }

  getActivityIcon(activityName: any): string {
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

  getActivityDescription(activityName: any): string {
    switch (activityName) {
      case 'Pré-teste':
        return ''; // Ícone de formulário/tarefa
      case 'Conteúdo':
        return ''; // Ícone de livro
      case 'Quizz':
        return '';
      case 'Pós-teste':
        return ''; // Ícone de avaliação/teste
      default:
        return '';
    }
  }

  iniciarAtividade(atividade: AtividadeBase) {
    const msg = this.tema?.ehPossivelIniciarAtividade(atividade);

    if (msg){
        this.showMessage(msg);
        return;
    }

    console.log(this.tema?.getUrlAtividade(atividade))
    this.router.navigate([this.tema?.getUrlAtividade(atividade)]);
  }
}
