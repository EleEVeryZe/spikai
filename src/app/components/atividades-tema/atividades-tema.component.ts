import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Tema } from '../../model/tema.model';
import { TemasService } from '../../services/temas.service';

@Component({
  selector: 'app-atividades-tema',
  imports: [
    
     CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './atividades-tema.component.html',
  styleUrl: './atividades-tema.component.scss'
})
export class AtividadesTemaComponent {
  tema: Tema | undefined;
  temaAnteriorConcluido = true; // Simula a verificação do tema anterior

  constructor(
    private route: ActivatedRoute,
    private temasService: TemasService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const temaId = params.get('id');
      if (temaId) {
        this.temasService.getTema(+temaId).subscribe(tema => {
          this.tema = tema;
        });
      }
    });
  }
}
