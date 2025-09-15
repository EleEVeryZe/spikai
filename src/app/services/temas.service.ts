import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tema } from '../model/tema.model';


@Injectable({
  providedIn: 'root'
})
export class TemasService {

  // Simulação de dados
  private temas: Tema[] = [
    {
      id: 1,
      nome: 'Verbo To Be',
      atividades: [
        { nome: 'Pré-teste', concluida: true, dataConclusao: new Date('2025-09-10T10:00:00') },
        { nome: 'Conteúdo', concluida: true, dataConclusao: new Date('2025-09-10T11:00:00') },
        { nome: 'Quizz', concluida: true, dataConclusao: new Date('2025-09-10T12:00:00') },
        { nome: 'Pós-teste', concluida: false }
      ],
      completo: false
    },
    {
      id: 2,
      nome: 'Simple Present',
      atividades: [
        { nome: 'Pré-teste', concluida: false },
        { nome: 'Conteúdo', concluida: false },
        { nome: 'Quizz', concluida: false },
        { nome: 'Pós-teste', concluida: false }
      ],
      completo: false
    }
  ];

  getTemas(): Observable<Tema[]> {
    return of(this.temas);
  }

  getTema(id: number): Observable<Tema | undefined> {
    const tema = this.temas.find(t => t.id === id);
    return of(tema);
  }

}