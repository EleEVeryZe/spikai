import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
 const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
@Injectable({
  providedIn: 'root'
})
export class UsuarioRepositoryService {

  httpClient: HttpClient;
  constructor(httpClient: HttpClient) { 
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
}