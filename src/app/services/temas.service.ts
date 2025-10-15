import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Atividade } from '../model/atividade.model';
import { Resposta } from '../model/resposta.model';
import { Tema } from '../model/tema.model';
import { UsuarioRepositoryService } from './usuario.repository.service';


@Injectable({
  providedIn: 'root'
})
export class TemasService {
  constructor(private httpClient: HttpClient, private usuarioRepositoryService: UsuarioRepositoryService) {}

  getUserProperties() : Observable<any> {
    return this.usuarioRepositoryService.getUserState().pipe(map((usr: any) => ({ vocabulary: usr.vocabulary, ehGrupoControle: usr.ehGrupoControle }) ));
  } 
  
  getTemas(): Observable<Tema[]> {
     return this.usuarioRepositoryService.getUserState().pipe(map((usr: any) => usr.cursos ));
  }

  getTema(id: string): Observable<Tema | undefined> {
    return this.usuarioRepositoryService.getUserState().pipe(map((usr: any) => usr.cursos.find((cur:any) => cur.id == id)));
  }

  getAtividade(idTema: string, nomeAtividade: string): Observable<Atividade | undefined> {
    return this.usuarioRepositoryService.getUserState().pipe(map((usr: any) => usr.cursos.find((cur:any) => cur.id == idTema).atividades.find((atv:any) => atv.nome == nomeAtividade)));
  }

  responderAtividade(respostas: Resposta[], idCurso: string | null, ehPos: boolean | null ) {
    const email = this.usuarioRepositoryService.getUserEmail();
    return this.httpClient.post("https://vm6v7qxux3.execute-api.sa-east-1.amazonaws.com/default/pre-teste", { email, respostas, idCurso, ehPos });
  }

  responderQuizz(respostas: Resposta[], idCurso: string | null ) {
    const email = this.usuarioRepositoryService.getUserEmail();
    return this.httpClient.post("https://5ijvp6uva8.execute-api.sa-east-1.amazonaws.com/default/quizz", { email, respostas, idCurso });
  }

  registrarVideoAssistido(idCurso: string | null ) {
    const email = this.usuarioRepositoryService.getUserEmail();
    return this.httpClient.post("https://5ijvp6uva8.execute-api.sa-east-1.amazonaws.com/default/quizz", { email, nomeAtividade: "Conteúdo", idCurso });
  }
}