import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Usuario } from '../model/user.model';
import { environment } from '../../environments/environment';

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

  private executeGraphQLMutation<T>(query: string, variables: any, rootField: string) {
    return this.httpClient.post<any>(environment.api.graphql, JSON.stringify({ query, variables }), { headers }).pipe(
      map((resp: any) => {
        if (resp?.errors?.length) {
          const firstError = resp.errors[0];
          const message = firstError?.message || 'Erro de GraphQL';
          throw { error: { message }, graphQLErrors: resp.errors };
        }

        const data = resp?.data?.[rootField];
        if (data === undefined || data === null) {
          throw { error: { message: `Retorno inválido para ${rootField}` }, response: resp };
        }

        return data as T;
      }),
      catchError((err) => {
        if (err?.error?.message) {
          return throwError(() => err);
        }
        return throwError(() => ({ error: { message: err?.message || 'Erro ao executar GraphQL' }, originalError: err }));
      })
    );
  }

  private normalizeCreateUserInput(userInfo: any) {
    const email = userInfo.email?.toLowerCase?.();
    const username = userInfo.username || userInfo.name || (email ? email.split('@')[0] : undefined);
    const password = userInfo.password;

    if (!email || !username || !password) {
      throw new Error('createUser requires email, username and password');
    }

    return {
      email,
      username,
      password,
    };
  }

  private normalizeUpdateUserInput(userInfo: any) {
    if (userInfo.id === undefined || userInfo.id === null) {
      throw new Error('updateUser requires id field');
    }

    const input: any = { id: Number(userInfo.id) };
    if (userInfo.email) input.email = String(userInfo.email).toLowerCase();
    if (userInfo.username) input.username = userInfo.username;
    else if (userInfo.name) input.username = userInfo.name;
    if (userInfo.password) input.password = userInfo.password;

    return input;
  }

  postCadastro(userInfo: any) {
    const mutationInput = this.normalizeCreateUserInput(userInfo);
    const query = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(createUserInput: $input) {
          id
          email
          username
        }
      }
    `;

    return this.executeGraphQLMutation<any>(query, { input: mutationInput }, 'createUser');
  }

  updateUser(userInfo: any) {
    const mutationInput = this.normalizeUpdateUserInput(userInfo);
    const query = `
      mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(updateUserInput: $input) {
          id
          email
          username
        }
      }
    `;

    return this.executeGraphQLMutation<any>(query, { input: mutationInput }, 'updateUser');
  }

  onLogin(email: string, password: string) {
    const query = `
      mutation Login($input: LoginInput!) {
        login(loginInput: $input) {
          access_token
        }
      }
    `;

    return this.executeGraphQLMutation<{ access_token: string | undefined }>(query, { input: { email, password } }, 'login').pipe(
      map((loginData) => {
        const token = loginData?.access_token;
        if (!token) {
          throw { error: { message: 'token não retornado no login' }, response: loginData };
        }
        return { token };
      })
    );
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

  getUserState(userEmail?: string): Observable<Usuario> {
    if (!userEmail)
      userEmail = this.authService.loadUserState().email;

    const hostname = window.location.hostname;
    if (hostname === '!localhost')
      return this.getUserStateStat(userEmail);

    const graphqlQuery = {
      query: `
    query GetUser($email: String!) {
      userData(email: $email) {
        id
        nome
      }
    }`,
      variables: {
        email: userEmail?.toLowerCase()
      }
    };

    return this.httpClient.post<any>(environment.api.usuario, graphqlQuery).pipe(
      map(res => {
        const data = res.data?.userData;
        return new Usuario(data);
      })
    );
  }


  getUserStateStat(userEmail?: string): Observable<Usuario> {
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