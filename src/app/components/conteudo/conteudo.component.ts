import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Tema } from '../../model/tema.model';
import { SharedUiService } from '../../services/shared-ui.service';
import { TemasService } from '../../services/temas.service';

@Component({
  selector: 'app-conteudo',
  imports: [MatCardModule, CommonModule],
  templateUrl: './conteudo.component.html',
  styleUrl: './conteudo.component.scss',
})
export class ConteudoComponent {
  videoUrl: string = '';
  tema: Tema = {
    atividades: [],
    id: 0,
    nome: '',
    completo: false,
    titulo: ''
  };
  hasReached75 = false; // flag para disparar apenas uma vez
  videoKey: string | null = null;
  htmlString!: SafeHtml;

  constructor(
    private readonly sharedService: SharedUiService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private temasService: TemasService,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  onTimeUpdate(video: HTMLVideoElement) {
    const currentTime = video.currentTime;
    const duration = video.duration;

    if (!this.videoKey) return;

    // salva progresso
    localStorage.setItem(this.videoKey || '', currentTime.toString());

    // verifica 75%
    if (!this.tema?.atividades[1].concluida)
      if (!this.hasReached75 && duration && currentTime / duration >= 0.75) {
        this.hasReached75 = true;
        this.onVideo75Percent();
      }
  }

  onMetadataLoaded(video: HTMLVideoElement) {
    if (!this.videoKey) return;

    const savedTime = localStorage.getItem(this.videoKey);
    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }
  }

  onVideo75Percent() {
    if (!this.tema?.atividades[1].concluida) {
      console.log('Usuário assistiu 75% do vídeo!');
      this.temasService.registrarVideoAssistido(this.tema?.id + '').subscribe({
        next: (res: any) => {
          console.log('Usuario assistiu 75% do vídeo:', res);

          if (this.tema) {
            this.tema.atividades[1].concluida = true;
          }
        },
        error: (err: any) => {
          console.error(err);
          this.showMessage('Erro ao guardar resultado.', true);
        },
      });
    }
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
    
    this.route.paramMap.subscribe((params) => {
      const temaId = params.get('id');
      this.sharedService.goBackTo('tema/' + temaId);
      if (temaId) {
        this.temasService.getTemas().subscribe((temas: any) => {
          const temaIdx = temas.findIndex((cur: any) => cur.id == temaId);
          this.tema = temas[temaIdx];

          if (!this.tema) return;

          const conteudoASerImportado = this.tema.atividades[1].conteudoASerImportado;
          const videoKey = this.tema.atividades[1].videos[0].videoId;
          this.http.get(`assets/${conteudoASerImportado}`, { responseType: 'text' }).subscribe((html) => {
            this.htmlString = this.sanitizer.bypassSecurityTrustHtml(html);
          });

          try {
            const hostname = window.location.hostname;

            if (hostname === 'localhost') this.videoUrl = 'assets/videos/' + videoKey;
            else this.videoUrl = 'resource/' + videoKey;
          } catch {}
        });
      }
    });
  }
}
