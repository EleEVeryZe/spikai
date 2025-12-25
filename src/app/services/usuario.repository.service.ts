import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Usuario } from '../model/user.model';
 const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

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

    return this.httpClient
    .post<any>(
      "https://0xaywrm14h.execute-api.sa-east-1.amazonaws.com/default/usuario",
      { email: userEmail?.toLocaleLowerCase() }
    )
    .pipe(map(data => new Usuario(data)));
  }

  
  getUserStateStat(userEmail?: string) : Observable<Usuario> {
    const filename = this.getUserBucketName(userEmail?.toLowerCase());
    return this.httpClient.get<Usuario>(filename.toLocaleLowerCase().toLowerCase());
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