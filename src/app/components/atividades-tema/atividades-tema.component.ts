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
  tema: Tema | undefined;
  temaAnteriorConcluido = true;

  videoUrlSafe!: SafeResourceUrl;
  videoUrl: string | null = null;
  videoKey: string | null = null;


  constructor(private readonly sharedService: SharedUiService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private temasService: TemasService, private router: Router) {}

hasReached75 = false; // flag para disparar apenas uma vez

  onTimeUpdate(video: HTMLVideoElement) {
    const currentTime = video.currentTime;
    const duration = video.duration;

    if (!this.videoKey)
      return;

    // salva progresso
    localStorage.setItem(this.videoKey || "", currentTime.toString());

    // verifica 75%
    if (!this.hasReached75 && duration && currentTime / duration >= 0.75) {
      this.hasReached75 = true;
      this.onVideo75Percent();
    }
  }

  onMetadataLoaded(video: HTMLVideoElement) {
    if (!this.videoKey)
      return;

    const savedTime = localStorage.getItem(this.videoKey);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }
  }

  onVideo75Percent() {
    console.log('Usuário assistiu 75% do vídeo!');
    // Aqui você pode:
    // - enviar um evento para o backend
    // - desbloquear conteúdo
    // - mostrar notificação, etc.
  }

  ngOnInit(): void {
    this.sharedService.hideArrowBackToolbar(false);

    this.route.paramMap.subscribe((params) => {
      const temaId = params.get('id');
      if (temaId) {
        this.temasService.getTemas().subscribe((temas: any) => {
          const temaIdx = temas.findIndex((cur: any) => cur.id == temaId);
          this.tema = temas[temaIdx];

          try {
            this.videoKey = temas[temaIdx].atividades[1].videos[0].videoId;  
            const hostname = window.location.hostname;
            if (hostname === 'localhost') 
              this.videoUrl = "assets/resource/" + this.videoKey;    
            else 
              this.videoUrl = "resource/" + this.videoKey;    
              
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
    if (nomeAtividade.toLocaleLowerCase() == "pós-teste"){
      this.router.navigate(['/' + this.tema?.id + '/' + nomeAtividade + '/true']);
      return;
    }

    if (nomeAtividade.toLocaleLowerCase() == 'conteúdo') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    } else this.router.navigate(['/' + this.tema?.id + '/' + nomeAtividade]);
  }
}
