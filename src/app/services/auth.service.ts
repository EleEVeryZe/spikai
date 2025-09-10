// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedIn = false;

  constructor() {
    // Optionally read from localStorage/sessionStorage or a token
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  public isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  public login(token: string): void {
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
  }

  public logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('token');
  }
}
