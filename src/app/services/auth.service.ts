import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'calendario_admin_auth_v1';

  // Credenciales por defecto para el Administrador
  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = '1b2026';

  readonly isAdmin = signal<boolean>(false);

  constructor() {
    this.checkStoredSession();
  }

  login(user: string, pass: string): boolean {
    if (user.trim().toLowerCase() === this.ADMIN_USER && pass === this.ADMIN_PASS) {
      this.isAdmin.set(true);
      try {
        sessionStorage.setItem(this.SESSION_KEY, 'true');
      } catch (e) {}
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAdmin.set(false);
    try {
      sessionStorage.removeItem(this.SESSION_KEY);
    } catch (e) {}
  }

  private checkStoredSession(): void {
    try {
      const stored = sessionStorage.getItem(this.SESSION_KEY);
      if (stored === 'true') {
        this.isAdmin.set(true);
      }
    } catch (e) {}
  }
}
