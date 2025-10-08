import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Curso } from '../../model/user.model';
import { SharedUiService } from '../../services/shared-ui.service';
import { UsuarioRepositoryService } from '../../services/usuario.repository.service';

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
export class TemasComponent implements OnInit {
  temas!: Curso[];

  constructor(private readonly sharedService: SharedUiService, private router: Router, private usuarioRepositoryService: UsuarioRepositoryService) {

  }
  ngOnInit(): void {
    this.usuarioRepositoryService.getUserState().subscribe(((usr: any) => {
      this.temas = usr.cursos;
    }));

    this.sharedService.hideArrowBackToolbar(true);
  }

  navegarParaTema(temaId: string) {
    this.router.navigate(['/tema', temaId]);
  }
}

