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

  public login(token: string, userEmail: string): void {
    this.isLoggedIn = true;
    localStorage.setItem('authToken', token);
    this.saveUserState({ email: userEmail });
  }

  public logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userState');
  }

  public loadUserState() {
    return JSON.parse(localStorage.getItem('userState') || "");
  }

  public saveUserState(userState: any) {
    localStorage.setItem('userState', JSON.stringify(userState));
  }
}
