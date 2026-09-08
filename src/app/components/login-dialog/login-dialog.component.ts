import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-header">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon color="primary">admin_panel_settings</mat-icon>
        Acceso Administrador
      </h2>
      <button mat-icon-button mat-dialog-close class="close-btn">
        <mat-icon>close</mat-icon>
      </button>
    </div>

    <mat-dialog-content class="dialog-content">
      <p class="subtitle-text">
        Ingresa tus credenciales para poder cambiar el tipo de uniforme o eliminar actividades.
      </p>

      <form [formGroup]="form" (ngSubmit)="onLogin()" class="login-form">
        @if (errorMessage) {
          <div class="error-banner animate-fade-in">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>
        }

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Usuario</mat-label>
          <input matInput formControlName="usuario" placeholder="Usuario" required autocomplete="username" />
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contraseña</mat-label>
          <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required autocomplete="current-password" />
          <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
            <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="onLogin()">
        <mat-icon>lock_open</mat-icon>
        Iniciar Sesión
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px 8px 24px;
    }
    .dialog-title {
      font-size: 1.2rem !important;
      font-weight: 800 !important;
      margin: 0 !important;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dialog-content {
      padding: 12px 24px !important;
    }
    .subtitle-text {
      font-size: 0.88rem;
      color: #64748b;
      margin-bottom: 16px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .full-width {
      width: 100%;
    }
    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fee2e2;
      color: #b91c1c;
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .dialog-actions {
      padding: 12px 24px 20px 24px !important;
    }
  `]
})
export class LoginDialogComponent {
  private dialogRef = inject(MatDialogRef<LoginDialogComponent>);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  hidePassword = true;
  errorMessage = '';

  form = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required]
  });

  onLogin(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    const ok = this.authService.login(val.usuario || '', val.password || '');

    if (ok) {
      this.dialogRef.close(true);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos.';
    }
  }
}
