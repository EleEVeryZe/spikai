import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
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

  onLogin(email: string, password: string) {
    return this.httpClient.post('https://ql0yknlu2l.execute-api.sa-east-1.amazonaws.com/default/login', JSON.stringify({ email, password }));
  }

  getUserEmail = () => this.authService.loadUserState().email;

  getUserBucketName(userEmail?: string) {
    if (!userEmail)
        userEmail = this.authService.loadUserState().email;

    const sanitizedEmail = userEmail?.replace(/@/g, '_at_').replace(/\./g, '_dot_');
    return `assets/resource/user_${sanitizedEmail}.json`;
  }

  getUserState(userEmail?: string) {
    const filename = this.getUserBucketName(userEmail);
    return this.httpClient.get(filename);
  }
}