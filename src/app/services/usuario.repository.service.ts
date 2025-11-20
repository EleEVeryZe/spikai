import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tema } from '../model/tema.model';
import { AuthService } from './auth.service';
 const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

export interface Usuario {
  name: string;
  email: string;
  age: number;
  gender: string;
  education: string;
  password: string;
  vocabulary: string;
  cursos: Tema[]
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioRepositoryService {

  httpClient: HttpClient;
  constructor(httpClient: HttpClient, private authService: AuthService) { 
    this.httpClient = httpClient;
  }

  postCadastro(userInfo: any) {
    return this.httpClient
   .post(
      'https://tjikhik5sh.execute-api.sa-east-1.amazonaws.com/default/cadastro',
      JSON.stringify(userInfo),
      { headers }
    );
  }

  updateUser(userInfo: any) {
    return this.httpClient
   .post(
      'https://tjikhik5sh.execute-api.sa-east-1.amazonaws.com/default/cadastro',
      JSON.stringify({ ...userInfo, isEdit: true }),
      { headers }
    );
  }

  onLogin(email: string, password: string) {
    return this.httpClient.post('https://ql0yknlu2l.execute-api.sa-east-1.amazonaws.com/default/login', JSON.stringify({ email, password }));
  }

  getUserEmail = () => this.authService.loadUserState().email;

  getUserBucketName(userEmail?: string) {
    if (!userEmail)
        userEmail = this.authService.loadUserState().email;

    const sanitizedEmail = userEmail?.replace(/@/g, '_at_').replace(/\./g, '_dot_');
    const hostname = window.location.hostname;
    if (hostname === 'localhost')
      return `assets/resource/user_${sanitizedEmail}.json`;

    return `resource/user_${sanitizedEmail}.json`;
  }

  getUserState(userEmail?: string) : Observable<Usuario> {
    if (!userEmail)
        userEmail = this.authService.loadUserState().email;

    const hostname = window.location.hostname;
    if (hostname === '!localhost')
      return this.getUserStateStat(userEmail);

    return this.httpClient.post<Usuario>("https://0xaywrm14h.execute-api.sa-east-1.amazonaws.com/default/usuario", JSON.stringify({ email: userEmail }));
  }

  
  getUserStateStat(userEmail?: string) : Observable<Usuario> {
    const filename = this.getUserBucketName(userEmail);
    return this.httpClient.get<Usuario>(filename.toLocaleLowerCase());
  }

  getAllUser() {
    let path = "";
    const hostname = window.location.hostname;
    if (hostname === 'localhost') 
      path = `assets/resource/usuarios.json`;
    else 
      path = `resource/usuarios.json`;

    return this.httpClient.get<any[]>(path);
  }
}