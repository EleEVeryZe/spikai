// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn = false;

  constructor() {
    // Optionally read from localStorage/sessionStorage or a token
    this.isLoggedIn = !!localStorage.getItem('authToken');
  }

  public isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  public login(token: string): void {
    this.isLoggedIn = true;
    localStorage.setItem('authToken', token);
  }

  public logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('authToken');
  }
}
