import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { Tema } from '../../model/tema.model';
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
  tema: Tema | undefined;
  temaAnteriorConcluido = true;
  isVideoVisible: boolean = false;

  videoUrlSafe!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private temasService: TemasService, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const temaId = params.get('id');
      if (temaId) {
        this.temasService.getTemas().subscribe((temas: any) => {
          const temaIdx = temas.findIndex((cur: any) => cur.id == temaId);
          this.tema = temas[temaIdx];

          try {
            const videoId = temas[temaIdx].atividades[1].videos[0].videoId;
            this.videoUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
          } catch {}

          if (temaIdx > 0) this.temaAnteriorConcluido = temas[temaIdx - 1]?.completo ?? false;
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
    if (nomeAtividade.toLocaleLowerCase() == 'conteúdo') {
      this.isVideoVisible = true;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else this.router.navigate(['/' + this.tema?.id + '/' + nomeAtividade]);
  }

  fecharVideo() {
    this.isVideoVisible = false;
  }
}
